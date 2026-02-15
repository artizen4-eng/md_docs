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
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1');
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
  // 테이블 구분선 제거
  let result = markdown.replace(/^\|[-:|\s]+\|$/gm, '');

  // 구분선 --- 또는 -- 사이에 줄바꿈
  result = result.replace(/^-{3,}\s*$/gm, '\n');
  result = result.replace(/^--\s*$/gm, '\n');

  return result;
}

function cleanupMarkdown(markdown: string): string {
  let result = markdown;

  // 여러 빈줄을 두 줄로 정리
  result = result.replace(/\n{3,}/g, '\n\n');

  // 앞뒤 공백 제거
  result = result.replace(/^\s+|\s+$/gm, '');

  // 문장 끝 마침표 뒤에만 줄바꿈 (번호, 계위 제외)
  result = result.replace(/\./g, (match, offset, str) => {
    // 앞 문자가 숫자면 번호니까 줄바꿈 안 함 (예: "1.")
    if (offset > 0 && /\d/.test(str[offset - 1])) {
      return '.';
    }
    // 앞앞이 번호.번호 패턴이면 줄바꿈 안 함 (예: "1.1.")
    const prefix = str.substring(Math.max(0, offset - 10), offset);
    if (/\d\.\d+$/.test(prefix)) {
      return '.';
    }
    return '.\n';
  });

  // 다시 여러 빈줄 정리
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}
