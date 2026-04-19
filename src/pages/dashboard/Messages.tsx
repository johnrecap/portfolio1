import { useState } from 'react';
import { useCollection } from '@/hooks/useFirestore';
import { Mail, Trash2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';

export const DashboardMessages = () => {
  const { data: messages, loading, removeDocument } = useCollection('messages');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const { t } = useTranslation();

  const confirmDelete = async () => {
    if (messageToDelete) {
      await removeDocument(messageToDelete);
      if (selectedMessage?.id === messageToDelete) {
        setSelectedMessage(null);
      }
      setMessageToDelete(null);
    }
  };

  const handleDeleteClick = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMessageToDelete(id);
  };

  return (
    <div className="flex-1 flex flex-col pt-10 pb-12 overflow-x-hidden w-full">
      <div className="px-6 md:px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-2">{t('dashboardMessages.inboxMessages')}</h1>
            <p className="text-muted-foreground text-lg">{t('dashboardMessages.inquiriesAndMessages')}</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {loading ? (
             <div className="p-8 text-center text-muted-foreground">{t('dashboardMessages.loading')}</div>
          ) : messages.length === 0 ? (
             <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
               <Mail className="w-8 h-8 opacity-50" />
               <p>{t('dashboardMessages.emptyInbox')}</p>
             </div>
          ) : (
            <div className="divide-y divide-border">
              {messages.map((msg: any) => (
                <div 
                  key={msg.id} 
                  className="p-6 relative group hover:bg-muted/30 transition-colors flex flex-col items-start gap-4 cursor-pointer"
                  onClick={() => setSelectedMessage(msg)}
                >
                  <div className="flex w-full justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{msg.name} <span className="text-sm font-normal text-muted-foreground ml-2">({msg.email})</span></h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.budget && <span className="text-xs font-semibold bg-teal-500/10 text-teal-500 px-2 py-1 rounded inline-block">{t('dashboardMessages.budget')}: {msg.budget}</span>}
                        {msg.whatsapp ? 
                          <span className="text-xs font-semibold bg-blue-500/10 text-blue-500 px-2 py-1 rounded inline-block">{t('dashboardMessages.contact')}: {msg.whatsapp}</span>
                        :
                          <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded inline-block">{t('dashboardMessages.methodPref')}: {t('dashboardMessages.emailOnly')}</span>
                        }
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Maximize2 className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => handleDeleteClick(msg.id, e)} className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-xl w-full text-sm text-foreground line-clamp-2" dir="auto">
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={!!selectedMessage} onOpenChange={(v) => !v && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{t('dashboardMessages.messageFrom', { name: selectedMessage.name })}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase mb-1">{t('dashboardMessages.emailLabel')}</span>
                    <span className="font-medium">{selectedMessage.email}</span>
                  </div>
                  {selectedMessage.whatsapp ? (
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase mb-1">{t('dashboardMessages.whatsappLabel')}</span>
                      <span className="font-medium">{selectedMessage.whatsapp}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase mb-1">{t('dashboardMessages.methodPref')}</span>
                      <span className="font-medium">{t('dashboardMessages.emailOnly')}</span>
                    </div>
                  )}
                  {selectedMessage.budget && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground block text-xs uppercase mb-1">{t('dashboardMessages.budgetLabel')}</span>
                      <span className="font-medium">{selectedMessage.budget}</span>
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase mb-2">{t('dashboardMessages.messageContentLabel')}</span>
                  <div className="bg-card p-4 rounded-xl border border-border text-sm leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto" dir="auto">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
              <DialogFooter>
                 <Button variant="destructive" onClick={() => handleDeleteClick(selectedMessage.id)}>{t('dashboardMessages.deleteMessage')}</Button>
                 <Button variant="outline" onClick={() => setSelectedMessage(null)}>{t('dashboardMessages.close')}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!messageToDelete} onOpenChange={(v) => !v && setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboardMessages.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboardMessages.deleteDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('dashboardMessages.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white border-transparent">
              {t('dashboardMessages.confirmDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
