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
