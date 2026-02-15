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
