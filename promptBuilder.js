export function buildPrompt({
  degree,
  priority,
  tone,
  userPrompt,
  variant,
}) {
  return `
You are drafting an official email for BITS Pilani Digital learners.

Audience:
- Programme: ${degree}
- Learner profile: ${
    degree === "BS"
      ? "Younger learners; be clear, structured, and reassuring"
      : "Working professionals; be concise and respectful"
  }

Priority level: ${priority}
Tone: ${tone}

STRICT RULES:
- Do NOT use emojis
- Do NOT include HTML
- Do NOT include markdown
- Do NOT invent dates
- Keep language neutral and academic
- No slang

FORMAT (IMPORTANT):
1. First line: Email subject (max 60 characters)
2. Second line: Header title
3. Third line: Header subtitle
4. Remaining lines: Email body (plain text paragraphs)

Variant seed: ${variant}

User-provided information:
${userPrompt}
`;
}
