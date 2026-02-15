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
