import type { ConverterPreset } from '@/types';

export function convertDocument(
  markdown: string,
  preset: ConverterPreset
): string {
  let result = markdown;

  // 헤딩 변환
  result = convertHeadings(result, preset);

  // 볼드/이탤릭 변환
  result = convertBoldItalic(result);

  // 코드 처리
  result = convertCode(result, preset);

  // 인용문 처리
  result = convertBlockquote(result, preset);

  // 리스트 처리
  result = convertLists(result, preset);

  // 테이블 처리
  result = convertTable(result, preset);

  // 불필요한 요소 제거
  result = cleanupMarkdown(result);

  return result;
}

function convertHeadings(markdown: string, preset: ConverterPreset): string {
  // 헤딩 마크 제거하고 공백 정리
  return markdown
    .replace(/^###\s+(.+)$/gm, (_match, text) => {
      const spacing = '\n'.repeat(Math.ceil((preset.h3.spacingAfter || 12) / 6));
      return `${text}${spacing}`;
    })
    .replace(/^##\s+(.+)$/gm, (_match, text) => {
      const spacing = '\n'.repeat(Math.ceil((preset.h2.spacingAfter || 18) / 6));
      return `${text}${spacing}`;
    })
    .replace(/^#\s+(.+)$/gm, (_match, text) => {
      const spacing = '\n'.repeat(Math.ceil((preset.h1.spacingAfter || 24) / 6));
      return `${text}${spacing}`;
    });
}

function convertBoldItalic(markdown: string): string {
  return markdown
    .replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>');
}

function convertCode(markdown: string, preset: ConverterPreset): string {
  let result = markdown;

  // 인라인 코드
  if (preset.inlineCode.action === 'remove' || !preset.inlineCode.keepBackticks) {
    result = result.replace(/`([^`]+)`/g, '$1');
  }

  // 코드 블록
  if (preset.codeBlock.action === 'remove') {
    result = result.replace(/```[\s\S]*?```/g, '');
  } else if (preset.codeBlock.action === 'quote') {
    result = result.replace(/```[\s\S]*?```/g, (match) => {
      const content = match.replace(/```\w*\n?/g, '');
      return `│ ${content}`;
    });
  }

  return result;
}

function convertBlockquote(markdown: string, _preset: ConverterPreset): string {
  const prefix = '│ ';
  return markdown.replace(/^>\s+(.+)$/gm, `${prefix}$1`);
}

function convertLists(markdown: string, preset: ConverterPreset): string {
  let result = markdown;

  // 불릿 리스트
  result = result.replace(/^[\-\*]\s+(.+)$/gm, `${preset.bulletList.bullet} $1`);

  // 숫자 리스트 (유지)
  result = result.replace(/^\d+\.\s+(.+)$/gm, (match, text) => {
    const num = match.match(/^(\d+)\./)?.[1] || '1';
    return `${num}. ${text}`;
  });

  return result;
}

function convertTable(markdown: string, _preset: ConverterPreset): string {
  // 간단한 테이블 변환 (구분선 제거)
  return markdown.replace(/^\|[-:|\s]+\|$/gm, '');
}

function cleanupMarkdown(markdown: string): string {
  return markdown
    .replace(/\n{3,}/g, '\n\n') // 여러 빈줄을 두 줄로
    .replace(/^\s+|\s+$/gm, '') // 앞뒤 공백 제거
    .trim();
}
