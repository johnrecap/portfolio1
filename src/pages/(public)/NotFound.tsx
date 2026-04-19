import { Link } from 'react-router-dom';
import { Terminal, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotFound = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-2xl bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-2xl font-mono text-sm">
        {/* Terminal Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="mx-auto flex items-center gap-2 text-slate-400 text-xs">
            <Terminal className="w-4 h-4" /> root@portfolio:~ 
          </div>
        </div>
        
        {/* Terminal Body */}
        <div className="p-6 text-slate-300 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-green-500">visitor@web</span>
            <span className="text-slate-500">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-slate-500">$</span>
            <span className="typing-effect">curl -X GET https://portfolio.local/unknown</span>
          </div>
          
          <div className="space-y-1 mt-2">
            <p className="text-red-400">Error: 404 Not Found</p>
            <p>The requested URL was not found on this server.</p>
            <p className="text-slate-500">Details: Route object does not exist in the navigation tree.</p>
          </div>
          
          <div className="flex items-center gap-2 mt-6">
            <span className="text-green-500">visitor@web</span>
            <span className="text-slate-500">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-slate-500">$</span>
            <span className="animate-pulse block w-2 h-4 bg-slate-400"></span>
          </div>
          
          <div className="pt-8">
             <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded transition-colors border border-slate-700 hover:border-slate-500"
            >
              <Home className="w-4 h-4" /> 
              return /home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
