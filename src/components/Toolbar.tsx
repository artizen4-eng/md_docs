import { Copy } from 'lucide-react';
import { useConverterStore } from '@/store/converterStore';
import { copyToClipboard } from '@/lib/exporters/clipboard';
import { useState } from 'react';

export function Toolbar() {
  const { outputDocument } = useConverterStore();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = async () => {
    const success = await copyToClipboard(outputDocument);
    setCopyStatus(success ? 'success' : 'error');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleCopy}
        disabled={!outputDocument}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
        data-testid="copy-button"
      >
        <Copy size={18} />
        {copyStatus === 'success' ? '복사 완료!' : '복사하기'}
      </button>
    </div>
  );
}
