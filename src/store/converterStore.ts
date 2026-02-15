import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ConverterState, ConverterPreset } from '@/types';
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
    (set, _get) => ({
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
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // currentPresetId로부터 전체 프리셋 객체 복원
        const presetId = (state as any).currentPresetId;
        const allPresets = [...builtInPresets, ...(state.customPresets || [])];
        const foundPreset = allPresets.find((p: ConverterPreset) => p.id === presetId);
        if (foundPreset) {
          (state as any).currentPreset = foundPreset;
        }
      },
    }
  )
);
