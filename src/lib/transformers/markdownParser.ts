import { marked } from 'marked';

export interface ParsedMarkdown {
  html: string;
  headings: Array<{ level: number; text: string }>;
  codeBlocks: string[];
}

export async function parseMarkdown(markdown: string): Promise<ParsedMarkdown> {
  const headings: Array<{ level: number; text: string }> = [];
  const codeBlocks: string[] = [];

  // 마크다운에서 헤딩과 코드블록 추출
  const headingMatches = markdown.matchAll(/^#{1,3}\s+(.+)$/gm);
  for (const match of headingMatches) {
    const level = match[0].match(/^#/g)?.length || 1;
    headings.push({ level, text: match[1] });
  }

  const codeMatches = markdown.matchAll(/```[\s\S]*?```/g);
  for (const match of codeMatches) {
    codeBlocks.push(match[0].replace(/```\w*\n?/g, '').replace(/```$/g, ''));
  }

  // HTML로 변환
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const html = await marked(markdown);

  return { html, headings, codeBlocks };
}
