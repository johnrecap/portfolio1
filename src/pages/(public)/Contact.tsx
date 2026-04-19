import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Clock, Code, ExternalLink, LogIn, Mail, MapPin, Send } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, type User } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageSeo } from '@/components/shared/PageSeo';
import { useProfile } from '@/hooks/useProfile';
import { auth, db, handleFirestoreError, OperationType } from '@/lib/firebase';

export const ContactForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { profile } = useProfile();
  const { t } = useTranslation();

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        form.setValue('name', nextUser.displayName || '');
        form.setValue('email', nextUser.email || '');
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, [form]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success(t('contact.signInSuccess'));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('contact.signInError');
      toast.error(message);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user && (!values.whatsapp || values.whatsapp.trim().length < 5)) {
      form.setError('whatsapp', {
        type: 'manual',
        message: t('contact.whatsappReqGuest'),
      });
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        ...values,
        read: false,
        userId: user ? user.uid : 'guest',
        createdAt: serverTimestamp(),
      });

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
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }
  };

  const socialLinks = [
    profile.linkedinUrl ? { href: profile.linkedinUrl, label: 'LinkedIn', icon: ExternalLink } : null,
    profile.githubUrl ? { href: profile.githubUrl, label: 'GitHub', icon: Code } : null,
    profile.websiteUrl ? { href: profile.websiteUrl, label: t('contact.website'), icon: ExternalLink } : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: typeof ExternalLink;
  }>;

  return (
    <div className="relative flex w-full flex-col gap-12 py-8">
      <PageSeo title={t('nav.contact')} description={t('contact.subtitle')} />

      <header className="max-w-3xl space-y-5">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
          {t('contact.eyebrow')}
        </p>
        <h1 className="font-heading text-4xl font-black tracking-tight text-foreground md:text-6xl">
          {t('contact.title')} <span className="text-primary">{t('contact.usefulTogether')}</span>
        </h1>
        <p className="text-base leading-8 text-muted-foreground md:text-lg">{t('contact.subtitle')}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_0.88fr]">
        <section className="space-y-6">
          <AnimatePresence>
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 rounded-[1.5rem] border border-primary/20 bg-primary/10 p-4"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold text-foreground">{t('contact.successTitle')}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t('contact.successMsg')}</p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {isAuthChecking ? (
            <div className="rounded-[2rem] border border-border/60 bg-card/60 p-8 text-center text-muted-foreground shadow-sm">
              {t('contact.checking')}
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-xl"
              >
                {user ? (
                  <div className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-primary/20 bg-primary/5 px-4 py-3">
                    <span className="text-sm text-foreground">
                      {t('contact.signedInAs')} <strong>{user.email}</strong>
                    </span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => auth.signOut()}>
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
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder={t('contact.selectRange')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under_5k">{t('contact.under5k')}</SelectItem>
                            <SelectItem value="5k_10k">{t('contact.5kTo10k')}</SelectItem>
                            <SelectItem value="10k_plus">{t('contact.10kPlus')}</SelectItem>
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
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                {t('contact.availableForWork')}
              </h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{t('contact.availableDesc')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-border/60 bg-card/70 p-5 shadow-sm">
              <div className="flex items-center gap-3 text-primary">
                <Clock className="h-5 w-5" />
                <p className="font-semibold text-foreground">{t('contact.responseTitle')}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{t('contact.responseValue')}</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/60 bg-card/70 p-5 shadow-sm">
              <div className="flex items-center gap-3 text-primary">
                <MapPin className="h-5 w-5" />
                <p className="font-semibold text-foreground">{t('contact.location')}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{t('contact.remote')}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border/60 bg-card/70 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-primary">
              <Mail className="h-5 w-5" />
              <h2 className="font-heading text-lg font-bold text-foreground">{t('contact.connect')}</h2>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border/60 bg-card/70 p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-foreground">{t('contact.quickFAQ')}</h2>
            <div className="mt-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{t('contact.workingHoursQ')}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{t('contact.workingHoursA')}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{t('contact.agenciesQ')}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{t('contact.agenciesA')}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
