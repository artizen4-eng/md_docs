import type { ConverterPreset } from '@/types';

export const defaultPreset: ConverterPreset = {
  id: 'default',
  name: '보고서 기본',
  description: '표준 보고서 형식',
  h1: { fontSize: 20, bold: true, spacingAfter: 24 },
  h2: { fontSize: 16, bold: true, spacingAfter: 18 },
  h3: { fontSize: 14, bold: true, spacingAfter: 12 },
  body: { fontSize: 11, lineHeight: 1.5, letterSpacing: 0, paragraphSpacing: 10 },
  bulletList: { bullet: '•', indent: 20 },
  numberedList: { bullet: '.', indent: 20 },
  inlineCode: { action: 'keep', keepBackticks: false, style: 'monospace' },
  codeBlock: { action: 'remove' },
  blockquote: { fontSize: 11, indent: 10, spacingAfter: 10 },
  table: { border: true, align: 'left', spacing: 2 },
};

export const meetingPreset: ConverterPreset = {
  id: 'meeting',
  name: '회의록',
  description: '회의록용 형식',
  h1: { fontSize: 18, bold: true, spacingAfter: 20 },
  h2: { fontSize: 14, bold: true, spacingAfter: 14 },
  h3: { fontSize: 12, bold: true, spacingAfter: 10 },
  body: { fontSize: 10, lineHeight: 1.4, paragraphSpacing: 8 },
  bulletList: { bullet: '□', indent: 15 },
  numberedList: { bullet: '.', indent: 15 },
  inlineCode: { action: 'keep', keepBackticks: false, style: 'normal' },
  codeBlock: { action: 'remove' },
  blockquote: { fontSize: 10, indent: 8, spacingAfter: 8 },
  table: { border: true, align: 'left', spacing: 1 },
};

export const simplePreset: ConverterPreset = {
  id: 'simple',
  name: '간단한 메모',
  description: '간단한 메모용',
  h1: { fontSize: 16, bold: true, spacingAfter: 16 },
  h2: { fontSize: 14, bold: true, spacingAfter: 12 },
  h3: { fontSize: 12, bold: true, spacingAfter: 8 },
  body: { fontSize: 11, lineHeight: 1.3, paragraphSpacing: 6 },
  bulletList: { bullet: '•', indent: 10 },
  numberedList: { bullet: '.', indent: 10 },
  inlineCode: { action: 'remove' },
  codeBlock: { action: 'remove' },
  blockquote: { fontSize: 11, indent: 5 },
  table: { border: false, align: 'left', spacing: 1 },
};

export const builtInPresets: ConverterPreset[] = [
  defaultPreset,
  meetingPreset,
  simplePreset,
];
