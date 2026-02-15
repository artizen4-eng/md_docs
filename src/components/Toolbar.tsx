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
