import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import { buildPrompt } from "./promptBuilder.js";
import { renderGoldenTemplate } from "./goldenTemplate.js";

dotenv.config();

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* -----------------------------
   Generate Email Endpoint
------------------------------ */
app.post("/generate-email", async (req, res) => {
  const apiKey = req.headers["x-app-key"];

  if (apiKey !== process.env.APP_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const {
      degree,
      priority,
      tone,
      prompt,
      ctas = [],
      bannerUrl = "",
      variant = 0,
      user = "admin",
    } = req.body;

    if (!prompt || prompt.length > 3000) {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    const aiPrompt = buildPrompt({
      degree,
      priority,
      tone,
      userPrompt: prompt,
      variant,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: aiPrompt }],
      temperature: Math.min(0.3 + variant * 0.1, 0.7),
    });

    const rawText = completion.choices[0].message.content.trim();

    const lines = rawText.split("\n").filter(Boolean);

    const subject = lines.shift() || "Academic Update";
    const title = lines.shift() || "Important Academic Notification";
    const subtitle = lines.shift() || "Please read carefully";
    const bodyHTML = lines.map(p => `<p>${p}</p>`).join("");

    const html = renderGoldenTemplate({
      subject,
      title,
      subtitle,
      bodyHTML,
      ctas,
      bannerUrl,
    });

    /* -----------------------------
       Minimal Audit Log
    ------------------------------ */
    fs.appendFileSync(
      "audit.log",
      `${new Date().toISOString()} | ${user} | ${degree} | ${priority}\n`
    );

    res.json({
      subject,
      html,
    });
  } catch (error) {
    console.error("Generation failed:", error);
    res.status(500).json({ error: "Email generation failed" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
