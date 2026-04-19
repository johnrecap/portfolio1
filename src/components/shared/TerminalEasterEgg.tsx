import { useState, useEffect } from 'react';
import { Terminal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TerminalEasterEgg = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: 'input' | 'output'; text: string }[]>([
    { type: 'output', text: 'Welcome to the hidden terminal. Type "help" to see available commands.' }
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on backtick (`), avoiding opening when typing in an input field
      if (e.key === '\`' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    setHistory((prev) => [...prev, { type: 'input', text: cmd }]);
    
    let output = '';
    switch (trimmed) {
      case 'help':
        output = 'Available commands:\\n- help: Show this message\\n- clear: Clear terminal\\n- ping: Check connectivity\\n- whoami: Identity check\\n- joke: Tell me a dev joke\\n- secret: ???';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'ping':
        output = 'pong ⚡';
        break;
      case 'whoami':
        output = 'guest_user@portfolio';
        break;
      case 'joke':
        const jokes = [
          "Why do programmers prefer dark mode?\\nBecause light attracts bugs.",
          "How many programmers does it take to change a light bulb?\\nNone, that's a hardware problem.",
          "There are 10 types of people in the world: those who understand binary, and those who don't.",
          "Real programmers count from 0.",
        ];
        output = jokes[Math.floor(Math.random() * jokes.length)];
        break;
      case 'secret':
        output = 'Initializing warp drive... just kidding. You found the easter egg! 🚀';
        break;
      default:
        output = `command not found: ${cmd}`;
    }

    setHistory((prev) => [...prev, { type: 'output', text: output }]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[450px] bg-slate-950 border border-slate-700 shadow-2xl rounded-lg z-50 overflow-hidden text-sm"
        >
          <div className="bg-slate-900 border-b border-slate-700 p-2 flex justify-between items-center cursor-move">
            <div className="flex gap-2 items-center text-slate-400 text-xs font-mono ml-2">
              <Terminal className="w-3 h-3" /> secret_terminal
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
              <X className="w-3 h-3" />
            </button>
          </div>
          
          <div className="p-4 h-[300px] font-mono overflow-y-auto flex flex-col bg-slate-950/90 backdrop-blur-sm">
            {history.map((line, i) => (
              <div key={i} className={`mb-2 ${line.type === 'input' ? 'text-slate-300' : 'text-slate-400 whitespace-pre-line'}`}>
                {line.type === 'input' && <span className="text-green-500 mr-2">❯</span>}
                {line.text}
              </div>
            ))}
            
            <form onSubmit={onSubmit} className="flex items-center mt-2">
              <span className="text-green-500 mr-2 shrink-0">❯</span>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-slate-300 font-mono shadow-none focus:ring-0 placeholder:text-slate-700 p-0"
                placeholder="Type a command..."
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
