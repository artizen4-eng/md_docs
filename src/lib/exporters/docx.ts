import type { ConverterPreset } from '@/types';

export async function exportToDocx(
  content: string,
  preset: ConverterPreset,
  filename: string = 'document.docx'
): Promise<void> {
  // HTML로 변환 후 다운로드
  const html = generateHtmlContent(content, preset);

  // Blob 생성 및 다운로드
  const blob = new Blob([html], { type: 'application/vnd.ms-word' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function generateHtmlContent(content: string, preset: ConverterPreset): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
      font-size: ${preset.body.fontSize}pt;
      line-height: ${preset.body.lineHeight || 1.5};
      letter-spacing: ${preset.body.letterSpacing || 0}pt;
    }
    h1 { font-size: ${preset.h1.fontSize}pt; font-weight: bold; }
    h2 { font-size: ${preset.h2.fontSize}pt; font-weight: bold; }
    h3 { font-size: ${preset.h3.fontSize}pt; font-weight: bold; }
    b { font-weight: bold; }
    i { font-style: italic; }
  </style>
</head>
<body>
${content.replace(/\n/g, '<br>')}
</body>
</html>
  `.trim();
}
