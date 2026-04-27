import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';

export const AddCandidateModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { addCandidate } = useStore();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCandidate({
      ...formData,
      status: 'applied',
      dateApplied: new Date().toISOString()
    });
    setFormData({ name: '', email: '', role: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{t('candidates.modalTitle', 'Add Candidate')}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <form id="add-candidate-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">{t('candidates.name', 'Name')}</label>
              <input 
                id="name" 
                required 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">{t('candidates.email', 'Email')}</label>
              <input 
                id="email" 
                required 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
                placeholder="e.g. john@example.com"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">{t('candidates.role', 'Role')}</label>
              <input 
                id="role" 
                required 
                type="text" 
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
                placeholder="e.g. Frontend Developer"
              />
            </div>
          </form>
        </div>
        <div className="p-4 sm:p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            {t('candidates.cancel', 'Cancel')}
          </button>
          <button 
            type="submit" 
            form="add-candidate-form" 
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            {t('candidates.add', 'Add Candidate')}
          </button>
        </div>
      </div>
    </div>
  );
};
