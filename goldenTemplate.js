export function renderGoldenTemplate({
  subject,
  title,
  subtitle,
  bodyHTML,
  ctas,
  bannerUrl,
}) {
  const ctaHTML = ctas
    .filter(c => c.label && c.url)
    .map(
      c => `
      <a href="${c.url}" target="_blank"
        style="
          display:inline-block;
          margin:10px 8px;
          padding:12px 22px;
          background:#7a2eff;
          color:#ffffff;
          text-decoration:none;
          border-radius:8px;
          font-weight:600;
        ">
        ${c.label}
      </a>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${subject}</title>
</head>

<body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
<tr>
<td align="center">

<table width="720" cellpadding="0" cellspacing="0"
 style="
  background:#ffffff;
  border-radius:12px;
  box-shadow:0 12px 32px rgba(91,44,131,0.18);
 ">

<tr>
<td style="
  background:linear-gradient(135deg,#784eaa,#a578ff);
  padding:46px 42px;
  color:#ffffff;
">
<h1 style="margin:0;font-size:30px;">${title}</h1>
<p style="margin-top:14px;font-size:18px;">${subtitle}</p>
</td>
</tr>

${bannerUrl ? `
<tr>
<td>
<img src="${bannerUrl}" style="width:100%;display:block;" />
</td>
</tr>
` : ""}

<tr>
<td style="
  padding:42px;
  font-size:15px;
  line-height:1.7;
  color:#1f2937;
">
<p><strong>Dear BITSian,</strong></p>

${bodyHTML}

<div style="margin-top:28px;">
${ctaHTML}
</div>

<p style="margin-top:28px;">
Warm regards,<br/>
<strong style="color:#4b1d7a;">BITS Pilani Digital</strong>
</p>
</td>
</tr>

<tr>
<td style="
  background-color:#ede7f6;
  padding:24px;
  text-align:center;
">
<a href="$[LI:UNSUBSCRIBE]$"
 style="font-size:8pt;color:#af76ff;">
unsubscribe
</a>
</td>
</tr>

</table>

</td>
</tr>
</table>
</body>
</html>
`;
}
