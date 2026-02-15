import { useConverterStore } from '@/store/converterStore';

export function Preview() {
  const { outputDocument, setOutputDocument } = useConverterStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-700">미리보기 (변환 결과)</h2>
        <span className="text-xs text-gray-500">
          {outputDocument.length} 자
        </span>
      </div>
      <textarea
        className="flex-1 w-full p-4 border border-gray-300 rounded-lg bg-white overflow-auto whitespace-pre-wrap text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="document-preview"
        value={outputDocument}
        onChange={(e) => setOutputDocument(e.target.value)}
        placeholder="변환된 문서가 여기에 표시됩니다..."
      />
    </div>
  );
}
