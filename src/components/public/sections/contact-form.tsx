import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, LogIn, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { buildFirestoreErrorInfo, getAuthInstance, getFirestoreInstance, OperationType } from '@/lib/firebase';
import type { AdminPageSection } from '@/lib/admin/types';
import { readSectionText } from './section-utils';

type ContactUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

const SUBMISSION_STORAGE_KEY = 'portfolio:contact-submit-times';
const SUBMISSION_WINDOW_MS = 60_000;
const SUBMISSION_LIMIT = 3;

function readRecentSubmissionTimes() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(SUBMISSION_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) {
      return [];
    }

    const cutoff = Date.now() - SUBMISSION_WINDOW_MS;
    return parsed.filter((value): value is number => typeof value === 'number' && value >= cutoff);
  } catch {
    return [];
  }
}

function writeRecentSubmissionTimes(times: number[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(times));
}

function ContactFormSection({ section }: { section: AdminPageSection }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<ContactUser | null>(null);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const title = readSectionText(section, 'title', '', isArabic);
  const subtitle = readSectionText(section, 'subtitle', '', isArabic);

  const formSchema = z.object({
    name: z.string().min(2, t('contact.validation.name')),
    email: z.string().email(t('contact.validation.email')),
    whatsapp: z.string().optional(),
    budget: z.string().optional(),
    message: z.string().min(10, t('contact.validation.message')),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      budget: '',
      message: '',
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const [{ GoogleAuthProvider, signInWithPopup }, auth] = await Promise.all([
        import('firebase/auth'),
        getAuthInstance(),
      ]);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const nextUser = result.user;
      setUser({
        uid: nextUser.uid,
        email: nextUser.email,
        displayName: nextUser.displayName,
      });
      form.setValue('name', nextUser.displayName || '');
      form.setValue('email', nextUser.email || '');
      toast.success(t('contact.signInSuccess'));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('contact.signInError');
      toast.error(message);
    }
  };

  const handleSignOut = async () => {
    const auth = await getAuthInstance();
    await auth.signOut();
    setUser(null);
  };

  const onSubmit = async (values: FormValues) => {
    if (!user && (!values.whatsapp || values.whatsapp.trim().length < 5)) {
      form.setError('whatsapp', {
        type: 'manual',
        message: t('contact.whatsappReqGuest'),
      });
      return;
    }

    const recentSubmissions = readRecentSubmissionTimes();
    if (recentSubmissions.length >= SUBMISSION_LIMIT) {
      toast.error(t('contact.throttleError'));
      return;
    }

    try {
      const [{ addDoc, collection, serverTimestamp }, db] = await Promise.all([
        import('firebase/firestore'),
        getFirestoreInstance(),
      ]);

      await addDoc(collection(db, 'messages'), {
        ...values,
        read: false,
        userId: user ? user.uid : 'guest',
        createdAt: serverTimestamp(),
      });

      writeRecentSubmissionTimes([...recentSubmissions, Date.now()]);
      setIsSuccess(true);
      toast.success(t('contact.successTitle'));
      form.reset({
        name: user?.displayName || '',
        email: user?.email || '',
        whatsapp: '',
        budget: '',
        message: '',
      });
      window.setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      const errInfo = buildFirestoreErrorInfo(error, OperationType.CREATE, 'messages');
      console.error('Contact form error:', JSON.stringify(errInfo));
      toast.error(t('contact.sendError'));
    }
  };

  return (
    <section className="py-4 md:py-6">
      <div className="space-y-6">
        {title || subtitle ? (
          <div className="max-w-3xl space-y-3">
            {title ? <h2 className="font-heading text-3xl font-black text-foreground">{title}</h2> : null}
            {subtitle ? <p className="text-base leading-8 text-muted-foreground">{subtitle}</p> : null}
          </div>
        ) : null}

        {isSuccess ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-3 rounded-[1.5rem] border border-primary/20 bg-primary/10 p-4 animate-in fade-in slide-in-from-top-2"
          >
            <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">{t('contact.successTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('contact.successMsg')}</p>
            </div>
          </div>
        ) : null}

        <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-6 rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-xl"
            >
              {user ? (
                <div className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-primary/20 bg-primary/5 px-4 py-3">
                  <span className="text-sm text-foreground">
                    {t('contact.signedInAs')} <strong>{user.email}</strong>
                  </span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => void handleSignOut()}>
                    {t('contact.signOut')}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-border bg-muted/40 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{t('contact.signInPrefill')}</span>
                  <Button type="button" variant="outline" size="sm" onClick={handleGoogleLogin} className="gap-2">
                    <LogIn className="h-4 w-4" />
                    {t('contact.signIn')}
                  </Button>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('contact.namePlaceholder')} {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.email')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('contact.emailPlaceholder')}
                          {...field}
                          className="h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.budget')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 w-full rounded-xl border-border/70 bg-surface/70 px-4 text-start shadow-sm">
                            <SelectValue placeholder={t('contact.selectRange')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          align="start"
                          className="rounded-2xl border border-border/70 bg-card/95 p-1.5 shadow-2xl backdrop-blur-md"
                        >
                          <SelectItem value="under_5k" className="min-h-11 rounded-xl px-3">
                            {t('contact.under5k')}
                          </SelectItem>
                          <SelectItem value="5k_10k" className="min-h-11 rounded-xl px-3">
                            {t('contact.5kTo10k')}
                          </SelectItem>
                          <SelectItem value="10k_plus" className="min-h-11 rounded-xl px-3">
                            {t('contact.10kPlus')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.whatsapp')}</FormLabel>
                      <FormControl>
                        <Input
                          dir="ltr"
                          placeholder={t('contact.whatsappPlaceholder')}
                          {...field}
                          className="h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contact.message')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('contact.messagePlaceholder')}
                        className="min-h-[180px] rounded-2xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="h-12 gap-2 rounded-full px-7 text-sm font-bold">
                {form.formState.isSubmitting ? t('contact.sending') : t('contact.send')}
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Form>
      </div>
    </section>
  );
}

export { ContactFormSection };
