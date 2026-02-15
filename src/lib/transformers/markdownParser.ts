import { marked } from 'marked';

export interface ParsedMarkdown {
  html: string;
  headings: Array<{ level: number; text: string }>;
  codeBlocks: string[];
}

export function parseMarkdown(markdown: string): ParsedMarkdown {
  const headings: Array<{ level: number; text: string }> = [];
  const codeBlocks: string[] = [];

  // 커스텀 렌더러로 헤딩 추출
  const renderer = new marked.Renderer();
  const originalHeading = renderer.heading.bind(renderer);
  renderer.heading = (text, level, raw) => {
    headings.push({ level, text: raw });
    return originalHeading(text, level, raw);
  };

  const originalCode = renderer.code.bind(renderer);
  renderer.code = (code, language) => {
    codeBlocks.push(code);
    return originalCode(code, language);
  };

  marked.setOptions({
    renderer,
    breaks: true,
    gfm: true,
  });

  const html = marked(markdown);

  return { html, headings, codeBlocks };
}
