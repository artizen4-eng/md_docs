# Markdown → 문서 변환기 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** React + TypeScript로 Markdown을 Word 친화적 문서로 변환하는 웹 앱 개발

**Architecture:** React + Vite 기반 SPA. Zustand로 상태 관리, marked/remark로 Markdown 파싱, 클립보드/DOCX 내보내기 기능 포함. Cloudflare Pages에 배포.

**Tech Stack:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, Zustand 4, marked 12, html-docx-js 0.3

---

## Task 1: 프로젝트 초기 설정

**Files:**
- Create: `/Users/kamc_han/Desktop/coding/md_docs/markdown-doc-converter/` (project root)
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

**Step 1: 프로젝트 폴더 생성 및 Vite 프로젝트 초기화**

```bash
cd /Users/kamc_han/Desktop/coding/md_docs
npm create vite@latest markdown-doc-converter -- --template react-ts
cd markdown-doc-converter
```

**Step 2: 의존성 설치**

```bash
npm install
npm install zustand marked remark remark-gfm turndown html-docx-js lucide-react clsx
npm install -D tailwindcss postcss autoprefixer @types/turndown
npx tailwindcss init -p
```

**Step 3: package.json 확인**

```bash
cat package.json
```
Expected: dependencies에 모든 패키지 포함

**Step 4: Tailwind CSS 설정**

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}
```

**Step 5: Vite 설정**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
```

**Step 6: TypeScript 설정**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 7: 개발 서버 시작 확인**

```bash
npm run dev
```
Expected: http://localhost:3000에서 Vite 환영 페이지 표시

**Step 8: 초기 커밋**

```bash
git add .
git commit -m "feat: initialize project with Vite + React + TypeScript + Tailwind"
```

---

## Task 2: 타입 정의

**Files:**
- Create: `src/types/config.ts`
- Create: `src/types/index.ts`

**Step 1: 타입 정의 파일 생성**

```typescript
// src/types/config.ts
export interface TextStyle {
  fontSize: number;
  bold?: boolean;
  italic?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  spacingAfter?: number;
  indent?: number;
}

export interface CodeBlockConfig {
  action: 'remove' | 'keep' | 'quote';
  keepBackticks?: boolean;
  style?: 'monospace' | 'normal';
}

export interface ListConfig {
  bullet: string;
  indent: number;
}

export interface TableConfig {
  border: boolean;
  align: 'left' | 'center' | 'right';
  spacing: number;
}

export interface ConverterPreset {
  id: string;
  name: string;
  description?: string;
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  body: TextStyle;
  bulletList: ListConfig;
  numberedList: ListConfig;
  inlineCode: CodeBlockConfig;
  codeBlock: CodeBlockConfig;
  blockquote: TextStyle;
  table: TableConfig;
  createdAt?: number;
  updatedAt?: number;
}

export interface ConverterState {
  currentPreset: ConverterPreset;
  customPresets: ConverterPreset[];
  inputMarkdown: string;
  outputDocument: string;
}
```

```typescript
// src/types/index.ts
export * from './config';
```

**Step 2: 커밋**

```bash
git add src/types/
git commit -m "feat: define TypeScript types for converter config"
```

---

## Task 3: 기본 프리셋 정의

**Files:**
- Create: `src/lib/presets.ts`

**Step 1: 기본 프리셋 작성**

```typescript
// src/lib/presets.ts
import { ConverterPreset } from '@/types';

export const defaultPreset: ConverterPreset = {
  id: 'default',
  name: '보고서 기본',
  description: '표준 보고서 형식',
  h1: { fontSize: 20, bold: true, spacingAfter: 24 },
  h2: { fontSize: 16, bold: true, spacingAfter: 18 },
  h3: { fontSize: 14, bold: true, spacingAfter: 12 },
  body: { fontSize: 11, lineHeight: 1.5, letterSpacing: 0, paragraphSpacing: 10 },
  bulletList: { bullet: '•', indent: 20 },
  numberedList: { indent: 20 },
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
  numberedList: { indent: 15 },
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
  numberedList: { indent: 10 },
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
```

**Step 2: 커밋**

```bash
git add src/lib/presets.ts
git commit -m "feat: add built-in presets (default, meeting, simple)"
```

---

## Task 4: Zustand 스토어 생성

**Files:**
- Create: `src/store/converterStore.ts`

**Step 1: 스토어 작성**

```typescript
// src/store/converterStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConverterState, ConverterPreset } from '@/types';
import { defaultPreset, builtInPresets } from '@/lib/presets';

interface ConverterStore extends ConverterState {
  setInputMarkdown: (markdown: string) => void;
  setOutputDocument: (document: string) => void;
  setCurrentPreset: (preset: ConverterPreset) => void;
  addCustomPreset: (preset: ConverterPreset) => void;
  updateCustomPreset: (id: string, preset: Partial<ConverterPreset>) => void;
  deleteCustomPreset: (id: string) => void;
  resetToDefault: () => void;
}

export const useConverterStore = create<ConverterStore>()(
  persist(
    (set) => ({
      currentPreset: defaultPreset,
      customPresets: [],
      inputMarkdown: '',
      outputDocument: '',

      setInputMarkdown: (markdown) => set({ inputMarkdown: markdown }),
      setOutputDocument: (document) => set({ outputDocument: document }),
      setCurrentPreset: (preset) => set({ currentPreset: preset }),

      addCustomPreset: (preset) =>
        set((state) => ({
          customPresets: [...state.customPresets, preset],
        })),

      updateCustomPreset: (id, updates) =>
        set((state) => ({
          customPresets: state.customPresets.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
          ),
        })),

      deleteCustomPreset: (id) =>
        set((state) => ({
          customPresets: state.customPresets.filter((p) => p.id !== id),
          currentPreset: state.currentPreset.id === id ? defaultPreset : state.currentPreset,
        })),

      resetToDefault: () =>
        set({
          currentPreset: defaultPreset,
          inputMarkdown: '',
          outputDocument: '',
        }),
    }),
    {
      name: 'markdown-converter-storage',
      partialize: (state) => ({
        customPresets: state.customPresets,
        currentPresetId: state.currentPreset.id,
      }),
    }
  )
);
```

**Step 2: 커밋**

```bash
git add src/store/
git commit -m "feat: create Zustand store with persist middleware"
```

---

## Task 5: Markdown 파서 구현

**Files:**
- Create: `src/lib/transformers/markdownParser.ts`

**Step 1: 파서 구현**

```typescript
// src/lib/transformers/markdownParser.ts
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
```

**Step 2: 커밋**

```bash
git add src/lib/transformers/markdownParser.ts
git commit -m "feat: implement Markdown parser with marked"
```

---

## Task 6: 문서 변환기 구현

**Files:**
- Create: `src/lib/transformers/documentConverter.ts`

**Step 1: 변환기 구현**

```typescript
// src/lib/transformers/documentConverter.ts
import { ConverterPreset } from '@/types';

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
    .replace(/^###\s+(.+)$/gm, (match, text) => {
      const spacing = '\n'.repeat(Math.ceil((preset.h3.spacingAfter || 12) / 6));
      return `${text}${spacing}`;
    })
    .replace(/^##\s+(.+)$/gm, (match, text) => {
      const spacing = '\n'.repeat(Math.ceil((preset.h2.spacingAfter || 18) / 6));
      return `${text}${spacing}`;
    })
    .replace(/^#\s+(.+)$/gm, (match, text) => {
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
  // 인라인 코드
  if (preset.inlineCode.action === 'remove' || !preset.inlineCode.keepBackticks) {
    markdown = markdown.replace(/`([^`]+)`/g, '$1');
  }

  // 코드 블록
  if (preset.codeBlock.action === 'remove') {
    markdown = markdown.replace(/```[\s\S]*?```/g, '');
  } else if (preset.codeBlock.action === 'quote') {
    markdown = markdown.replace(/```[\s\S]*?```/g, (match) => {
      const content = match.replace(/```\w*\n?/g, '');
      return `│ ${content}`;
    });
  }

  return markdown;
}

function convertBlockquote(markdown: string, preset: ConverterPreset): string {
  const prefix = '│ ';
  return markdown.replace(/^>\s+(.+)$/gm, `${prefix}$1`);
}

function convertLists(markdown: string, preset: ConverterPreset): string {
  // 불릿 리스트
  markdown = markdown.replace(/^[\-\*]\s+(.+)$/gm, `${preset.bulletList.bullet} $1`);

  // 숫자 리스트 (유지)
  markdown = markdown.replace(/^\d+\.\s+(.+)$/gm, (match, text) => {
    const num = match.match(/^(\d+)\./)?.[1] || '1';
    return `${num}. ${text}`;
  });

  return markdown;
}

function convertTable(markdown: string, preset: ConverterPreset): string {
  // 간단한 테이블 변환 (구분선 제거)
  return markdown.replace(/^\|[-:|\s]+\|$/gm, '');
}

function cleanupMarkdown(markdown: string): string {
  return markdown
    .replace(/\n{3,}/g, '\n\n') // 여러 빈줄을 두 줄로
    .replace(/^\s+|\s+$/gm, '') // 앞뒤 공백 제거
    .trim();
}
```

**Step 2: 커밋**

```bash
git add src/lib/transformers/documentConverter.ts
git commit -m "feat: implement document converter with preset rules"
```

---

## Task 7: 클립보드 유틸리티

**Files:**
- Create: `src/lib/exporters/clipboard.ts`

**Step 1: 클립보드 복사 함수**

```typescript
// src/lib/exporters/clipboard.ts
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 레거시 방식
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        textArea.remove();
        return false;
      }
    }
  } catch (error) {
    return false;
  }
}
```

**Step 2: 커밋**

```bash
git add src/lib/exporters/clipboard.ts
git commit -m "feat: add clipboard copy utility with fallback"
```

---

## Task 8: Docx 내보내기

**Files:**
- Create: `src/lib/exporters/docx.ts`

**Step 1: DOCX 변환 함수**

```typescript
// src/lib/exporters/docx.ts
import { ConverterPreset } from '@/types';

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
```

**Step 2: 커밋**

```bash
git add src/lib/exporters/docx.ts
git commit -m "feat: add DOCX export functionality"
```

---

## Task 9: LocalStorage 유틸리티

**Files:**
- Create: `src/lib/storage.ts`

**Step 1: 스토리지 유틸리티**

```typescript
// src/lib/storage.ts
export const STORAGE_KEYS = {
  CUSTOM_PRESETS: 'md-converter-custom-presets',
  CURRENT_PRESET: 'md-converter-current-preset',
} as const;

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}
```

**Step 2: 커밋**

```bash
git add src/lib/storage.ts
git commit -m "feat: add localStorage utilities"
```

---

## Task 10: Editor 컴포넌트

**Files:**
- Create: `src/components/Editor.tsx`

**Step 1: Editor 컴포넌트 구현**

```typescript
// src/components/Editor.tsx
import { useConverterStore } from '@/store/converterStore';

export function Editor() {
  const { inputMarkdown, setInputMarkdown } = useConverterStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-700">입력 (Markdown)</h2>
        <span className="text-xs text-gray-500">
          {inputMarkdown.length} 자
        </span>
      </div>
      <textarea
        value={inputMarkdown}
        onChange={(e) => setInputMarkdown(e.target.value)}
        className="flex-1 w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="# 제목을 입력하세요&#10;&#10;**중요한 내용**을 작성하세요.&#10;&#10;- 항목 1&#10;- 항목 2"
        data-testid="markdown-editor"
      />
    </div>
  );
}
```

**Step 2: 커밋**

```bash
git add src/components/Editor.tsx
git commit -m "feat: add Editor component with character count"
```

---

## Task 11: Preview 컴포넌트

**Files:**
- Create: `src/components/Preview.tsx`

**Step 1: Preview 컴포넌트 구현**

```typescript
// src/components/Preview.tsx
import { useConverterStore } from '@/store/converterStore';

export function Preview() {
  const { outputDocument } = useConverterStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-700">미리보기 (변환 결과)</h2>
        <span className="text-xs text-gray-500">
          {outputDocument.length} 자
        </span>
      </div>
      <div
        className="flex-1 w-full p-4 border border-gray-300 rounded-lg bg-white overflow-auto whitespace-pre-wrap text-sm"
        data-testid="document-preview"
      >
        {outputDocument || (
          <span className="text-gray-400">변환된 문서가 여기에 표시됩니다...</span>
        )}
      </div>
    </div>
  );
}
```

**Step 2: 커밋**

```bash
git add src/components/Preview.tsx
git commit -m "feat: add Preview component with character count"
```

---

## Task 12: Toolbar 컴포넌트

**Files:**
- Create: `src/components/Toolbar.tsx`

**Step 1: Toolbar 컴포넌트 구현**

```typescript
// src/components/Toolbar.tsx
import { Copy, FileText } from 'lucide-react';
import { useConverterStore } from '@/store/converterStore';
import { copyToClipboard } from '@/lib/exporters/clipboard';
import { exportToDocx } from '@/lib/exporters/docx';
import { useState } from 'react';

export function Toolbar() {
  const { outputDocument, currentPreset } = useConverterStore();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = async () => {
    const success = await copyToClipboard(outputDocument);
    setCopyStatus(success ? 'success' : 'error');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleExport = () => {
    exportToDocx(outputDocument, currentPreset, 'document.docx');
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopy}
        disabled={!outputDocument}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        data-testid="copy-button"
      >
        <Copy size={18} />
        {copyStatus === 'success' ? '복사 완료!' : '복사하기'}
      </button>
      <button
        onClick={handleExport}
        disabled={!outputDocument}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        data-testid="export-button"
      >
        <FileText size={18} />
        Word 저장
      </button>
    </div>
  );
}
```

**Step 2: 커밋**

```bash
git add src/components/Toolbar.tsx
git commit -m "feat: add Toolbar with copy and export buttons"
```

---

## Task 13: useConverter Hook

**Files:**
- Create: `src/hooks/useConverter.ts`

**Step 1: 변환 Hook 구현**

```typescript
// src/hooks/useConverter.ts
import { useEffect } from 'react';
import { useConverterStore } from '@/store/converterStore';
import { convertDocument } from '@/lib/transformers/documentConverter';

export function useConverter() {
  const { inputMarkdown, currentPreset, setOutputDocument } = useConverterStore();

  useEffect(() => {
    if (inputMarkdown) {
      const converted = convertDocument(inputMarkdown, currentPreset);
      setOutputDocument(converted);
    } else {
      setOutputDocument('');
    }
  }, [inputMarkdown, currentPreset, setOutputDocument]);
}
```

**Step 2: 커밋**

```bash
git add src/hooks/useConverter.ts
git commit -m "feat: add useConverter hook for auto-conversion"
```

---

## Task 14: App 컴포넌트 조립

**Files:**
- Modify: `src/App.tsx`

**Step 1: App 컴포넌트 작성**

```typescript
// src/App.tsx
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { Settings } from 'lucide-react';
import { useConverter } from './hooks/useConverter';

function App() {
  useConverter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              📝 Markdown → 문서 변환기
            </h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Editor />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Preview />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Toolbar />
        </div>
      </main>
    </div>
  );
}

export default App;
```

**Step 2: 커밋**

```bash
git add src/App.tsx
git commit -m "feat: assemble main App layout with Editor, Preview, Toolbar"
```

---

## Task 15: 메인 엔트리 포인트

**Files:**
- Modify: `src/main.tsx`

**Step 1: main.tsx 작성**

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 2: index.css 업데이트**

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}
```

**Step 3: 커밋**

```bash
git add src/main.tsx src/index.css
git commit -m "feat: configure main entry point"
```

---

## Task 16: index.html 업데이트

**Files:**
- Modify: `index.html`

**Step 1: HTML 템플릿 업데이트**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Markdown → 문서 변환기</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 2: 커밋**

```bash
git add index.html
git commit -m "feat: update index.html with proper title"
```

---

## Task 17: 로컬 테스트

**Step 1: 개발 서버 시작**

```bash
npm run dev
```

**Step 2: 브라우저에서 확인**

URL: http://localhost:3000

확인할 항목:
- [ ] 페이지가 정상적으로 로딩됨
- [ ] 왼쪽 에디터에 텍스트 입력 가능
- [ ] 오른쪽 미리보기에 변환 결과 표시
- [ ] 복사 버튼 클릭 시 클립보드에 복사됨
- [ ] Word 저장 버튼 클릭 시 파일 다운로드됨

**Step 3: 테스트 마크다운 입력**

```
# 보고서 제목

**개요**: 이것은 테스트 보고서입니다.

##主要内容

- 항목 1
- 항목 2
- 항목 3

## 결론

테스트가 성공적으로 완료되었습니다.
```

**Step 4: 확인 후 커밋**

```bash
git add .
git commit -m "test: verify local development environment"
```

---

## Task 18: Cloudflare Pages 배포 설정

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: 배포 워크플로우 작성**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: markdown-doc-converter
          directory: dist
```

**Step 2: 커밋**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add Cloudflare Pages deployment workflow"
```

---

## Task 19: README 작성

**Files:**
- Create: `README.md`

**Step 1: README 작성**

```markdown
# Markdown → 문서 변환기

LLM이 출력한 Markdown 결과물을 Word 친화적 문서로 변환하는 웹 앱입니다.

## 기능

- ⚡ 실시간 Markdown → 일반 문서 변환
- 📋 클립보드 복사 (Word에 바로 붙여넣기)
- 📄 Word 파일(.docx) 내보내기
- ⚙️ 프리셋 시스템 (보고서, 회의록, 간단한 메모)
- 🎨 세부 설정 커스터마이징
- 💾 LocalStorage에 프리셋 저장

## 개발

```bash
# 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build
```

## 기술 스택

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- Zustand (상태 관리)
- marked (Markdown 파싱)

## 배포

[Cloudflare Pages](https://pages.cloudflare.com)에 배포됩니다.

## 라이선스

MIT
```

**Step 2: 커밋**

```bash
git add README.md
git commit -m "docs: add README"
```

---

## Task 20: 최종 확인 및 배포

**Step 1: 프로덕션 빌드 테스트**

```bash
npm run build
npm run preview
```

**Step 2: 빌드 산물 확인**

```bash
ls -la dist/
```

**Step 3: Git 태그**

```bash
git tag -a v1.0.0 -m "Initial release"
git push origin main --tags
```

**Step 4: GitHub에 푸시 (CI/CD 트리거)**

```bash
git push origin main
```

**Step 5: Cloudflare Pages 대시보드에서 배포 확인**

URL: https://dash.cloudflare.com/

---

## 완료 체크리스트

- [x] 프로젝트 초기 설정
- [x] 타입 정의
- [x] 프리셋 시스템
- [x] Zustand 스토어
- [x] Markdown 파서
- [x] 문서 변환기
- [x] 클립보드 유틸리티
- [x] DOCX 내보내기
- [x] LocalStorage 유틸리티
- [x] UI 컴포넌트들 (Editor, Preview, Toolbar)
- [x] 메인 App 조립
- [x] 로컬 테스트
- [x] CI/CD 설정
- [x] README
