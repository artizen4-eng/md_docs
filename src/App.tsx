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
