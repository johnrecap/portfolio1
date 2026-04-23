import { useState, type MouseEvent } from 'react';
import { Mail, Maximize2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCollection } from '@/hooks/useFirestore';
import { isUnreadMessage } from '@/lib/content-utils';

type MessageRecord = {
  id: string;
  name: string;
  email: string;
  budget?: string;
  whatsapp?: string;
  message: string;
  read?: boolean;
  status?: 'new' | 'reviewed' | 'archived';
  priority?: 'normal' | 'high';
  adminNotes?: string;
};

export const DashboardMessages = () => {
  const { data: messages, loading, removeDocument, updateDocument } = useCollection<MessageRecord>('messages');
  const [selectedMessage, setSelectedMessage] = useState<MessageRecord | null>(null);
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

  const handleDeleteClick = (id: string, e?: MouseEvent) => {
    e?.stopPropagation();
    setMessageToDelete(id);
  };

  const handleOpenMessage = async (message: MessageRecord) => {
    setSelectedMessage({
      ...message,
      read: true,
      status: message.status ?? 'reviewed',
      priority: message.priority ?? 'normal',
      adminNotes: message.adminNotes ?? '',
    });

    if (isUnreadMessage(message)) {
      await updateDocument(message.id, { read: true, status: message.status ?? 'reviewed' });
    }
  };

  const handleSaveMeta = async () => {
    if (!selectedMessage) {
      return;
    }

    await updateDocument(selectedMessage.id, {
      read: selectedMessage.read ?? true,
      status: selectedMessage.status ?? 'reviewed',
      priority: selectedMessage.priority ?? 'normal',
      adminNotes: selectedMessage.adminNotes ?? '',
    });
  };

  return (
    <div className="flex w-full flex-1 flex-col overflow-x-hidden pt-10 pb-12">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-3xl font-heading font-bold tracking-tight md:text-4xl">
              {t('dashboardMessages.inboxMessages')}
            </h1>
            <p className="text-lg text-muted-foreground">{t('dashboardMessages.inquiriesAndMessages')}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">{t('dashboardMessages.loading')}</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
              <Mail className="h-8 w-8 opacity-50" />
              <p>{t('dashboardMessages.emptyInbox')}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {messages.map((message) => {
                const unread = isUnreadMessage(message);

                return (
                  <div
                    key={message.id}
                    className={`group relative flex cursor-pointer flex-col items-start gap-4 p-6 transition-colors hover:bg-muted/30 ${
                      unread ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => void handleOpenMessage(message)}
                  >
                    <div className="flex w-full items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {unread ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                          <h3 className="text-lg font-bold">
                            {message.name}
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                              ({message.email})
                            </span>
                          </h3>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-block rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                            {t(`dashboardMessages.statusOptions.${message.status ?? (unread ? 'new' : 'reviewed')}`)}
                          </span>
                          <span className="inline-block rounded bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-500">
                            {t(`dashboardMessages.priorityOptions.${message.priority ?? 'normal'}`)}
                          </span>
                          {message.budget ? (
                            <span className="inline-block rounded bg-teal-500/10 px-2 py-1 text-xs font-semibold text-teal-500">
                              {t('dashboardMessages.budget')}: {message.budget}
                            </span>
                          ) : null}
                          {message.whatsapp ? (
                            <span className="inline-block rounded bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-500">
                              {t('dashboardMessages.contact')}: {message.whatsapp}
                            </span>
                          ) : (
                            <span className="inline-block rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                              {t('dashboardMessages.methodPref')}: {t('dashboardMessages.emailOnly')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleOpenMessage(message);
                          }}
                        >
                          <Maximize2 className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(event) => handleDeleteClick(message.id, event)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full rounded-xl bg-muted/50 p-4 text-sm text-foreground line-clamp-2" dir="auto">
                      {message.message}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={Boolean(selectedMessage)} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-xl">
          {selectedMessage ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {t('dashboardMessages.messageFrom', { name: selectedMessage.name })}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/30 p-4 text-sm">
                  <div>
                    <span className="mb-1 block text-xs uppercase text-muted-foreground">
                      {t('dashboardMessages.emailLabel')}
                    </span>
                    <span className="font-medium">{selectedMessage.email}</span>
                  </div>
                  {selectedMessage.whatsapp ? (
                    <div>
                      <span className="mb-1 block text-xs uppercase text-muted-foreground">
                        {t('dashboardMessages.whatsappLabel')}
                      </span>
                      <span className="font-medium">{selectedMessage.whatsapp}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="mb-1 block text-xs uppercase text-muted-foreground">
                        {t('dashboardMessages.methodPref')}
                      </span>
                      <span className="font-medium">{t('dashboardMessages.emailOnly')}</span>
                    </div>
                  )}
                  {selectedMessage.budget ? (
                    <div className="col-span-2">
                      <span className="mb-1 block text-xs uppercase text-muted-foreground">
                        {t('dashboardMessages.budgetLabel')}
                      </span>
                      <span className="font-medium">{selectedMessage.budget}</span>
                    </div>
                  ) : null}
                </div>
                <div>
                  <span className="mb-2 block text-xs uppercase text-muted-foreground">
                    {t('dashboardMessages.messageContentLabel')}
                  </span>
                  <div
                    className="max-h-[50vh] overflow-y-auto rounded-xl border border-border bg-card p-4 text-sm leading-relaxed whitespace-pre-wrap"
                    dir="auto"
                  >
                    {selectedMessage.message}
                  </div>
                </div>
                <div className="grid gap-4 rounded-lg bg-muted/30 p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="message-status">{t('dashboardMessages.status')}</Label>
                    <select
                      id="message-status"
                      className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50"
                      value={selectedMessage.status ?? 'reviewed'}
                      onChange={(event) =>
                        setSelectedMessage((current) =>
                          current ? { ...current, status: event.target.value as MessageRecord['status'] } : current,
                        )
                      }
                    >
                      <option value="new">{t('dashboardMessages.statusOptions.new')}</option>
                      <option value="reviewed">{t('dashboardMessages.statusOptions.reviewed')}</option>
                      <option value="archived">{t('dashboardMessages.statusOptions.archived')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message-priority">{t('dashboardMessages.priority')}</Label>
                    <select
                      id="message-priority"
                      className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50"
                      value={selectedMessage.priority ?? 'normal'}
                      onChange={(event) =>
                        setSelectedMessage((current) =>
                          current ? { ...current, priority: event.target.value as MessageRecord['priority'] } : current,
                        )
                      }
                    >
                      <option value="normal">{t('dashboardMessages.priorityOptions.normal')}</option>
                      <option value="high">{t('dashboardMessages.priorityOptions.high')}</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message-admin-notes">{t('dashboardMessages.adminNotes')}</Label>
                    <Textarea
                      id="message-admin-notes"
                      value={selectedMessage.adminNotes ?? ''}
                      onChange={(event) =>
                        setSelectedMessage((current) =>
                          current ? { ...current, adminNotes: event.target.value } : current,
                        )
                      }
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => void handleSaveMeta()}>{t('dashboardMessages.saveMeta')}</Button>
                <Button variant="destructive" onClick={() => handleDeleteClick(selectedMessage.id)}>
                  {t('dashboardMessages.deleteMessage')}
                </Button>
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  {t('dashboardMessages.close')}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(messageToDelete)} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboardMessages.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('dashboardMessages.deleteDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('dashboardMessages.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="border-transparent bg-red-500 text-white hover:bg-red-600"
            >
              {t('dashboardMessages.confirmDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
