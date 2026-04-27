import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';

export const AddJobModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { addJob } = useStore();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob({
      ...formData,
      status: 'active',
      candidatesCount: 0,
      postedDate: new Date().toISOString()
    });
    setFormData({ title: '', department: '', location: '', type: 'Full-time' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{t('jobs.modalTitle', 'Post New Job')}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <form id="add-job-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">{t('jobs.jobTitle', 'Job Title')}</label>
              <input 
                id="title" 
                required 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-foreground mb-1">{t('jobs.department', 'Department')}</label>
              <input 
                id="department" 
                required 
                type="text" 
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
                placeholder="e.g. Engineering"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">{t('jobs.location', 'Location')}</label>
              <input 
                id="location" 
                required 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
                placeholder="e.g. Remote, New York, etc."
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1">{t('jobs.type', 'Type')}</label>
              <select
                id="type"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow text-foreground"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </form>
        </div>
        <div className="p-4 sm:p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            {t('jobs.cancel', 'Cancel')}
          </button>
          <button 
            type="submit" 
            form="add-job-form" 
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            {t('jobs.postStart', 'Post Job')}
          </button>
        </div>
      </div>
    </div>
  );
};
