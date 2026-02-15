import { useConverterStore } from '@/store/converterStore';
import { builtInPresets } from '@/lib/presets';
import { X } from 'lucide-react';
import { useState } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { currentPreset, setCurrentPreset } = useConverterStore();
  const [selectedPreset, setSelectedPreset] = useState(currentPreset);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setCurrentPreset(selectedPreset);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">⚙️ 설정</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-medium text-gray-700">프리셋 선택</h3>
          {builtInPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                selectedPreset.id === preset.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{preset.name}</div>
              {preset.description && (
                <div className="text-sm text-gray-600 mt-1">{preset.description}</div>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            확인
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
