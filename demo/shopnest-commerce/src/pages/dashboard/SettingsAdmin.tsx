import { useState } from 'react';
import { useStore } from '../../store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export function SettingsAdmin() {
  const { taxSettings, updateTaxSettings } = useStore();
  const [enabled, setEnabled] = useState(taxSettings.enabled);
  const [rate, setRate] = useState(taxSettings.rate.toString());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateTaxSettings({
      enabled,
      rate: parseFloat(rate) || 0,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tighter text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Manage global store configurations.</p>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Tax Configuration</h3>
            <p className="text-sm text-slate-500">Enable or disable taxes and set the default rate.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold text-slate-900 block">Enable Taxes</label>
              <span className="text-sm text-slate-500">Apply tax automatically at checkout</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className={`transition-opacity ${enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <label className="text-sm font-bold text-slate-900 block mb-1">Tax Rate (%)</label>
            <div className="max-w-[200px]">
              <Input 
                type="number" 
                min="0" 
                step="0.1" 
                value={rate} 
                onChange={(e) => setRate(e.target.value)} 
                disabled={!enabled}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
          {isSaved && (
            <span className="text-emerald-600 text-sm font-bold flex items-center gap-1 animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="h-4 w-4" />
              Settings saved
            </span>
          )}
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
