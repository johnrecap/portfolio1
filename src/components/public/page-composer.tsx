import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import * as z from 'zod';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, type User } from 'firebase/auth';
import {
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Clock,
  Code,
  ExternalLink,
  LogIn,
  Mail,
  MapPin,
  Send,
  Terminal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { CTASection } from '@/components/public/cta-section';
import { FeaturedProjectsGrid } from '@/components/public/featured-projects';
import { HeroSection } from '@/components/public/hero-section';
import { ShowcaseSection } from '@/components/public/showcase-section';
import { TestimonialsSection } from '@/components/public/testimonials-section';
import { SkeletonBlocks, SkeletonLine, SkeletonMedia } from '@/components/shared/PageState';
import { Button, buttonVariants } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useContactSettings } from '@/hooks/usePlatformSettings';
import { useProfile } from '@/hooks/useProfile';
import { usePublicCollection, usePublicMediaLibrary } from '@/hooks/public-firestore';
import { auth, db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { readComposerText } from '@/lib/admin/page-content';
import { resolveMediaField, type ProjectRecord } from '@/lib/content-hub';
import { mergePublicProjects } from '@/lib/public-projects';
import { buildProfileImageStyle } from '@/lib/profile-image';
import type { AdminPageConfig, AdminPageSection, PlatformPageId, StylePreset } from '@/lib/admin/types';

function getSurfaceTone(stylePreset: StylePreset) {
  switch (stylePreset) {
    case 'muted':
      return 'border-border/40 bg-background/60';
    case 'emphasis':
      return 'border-primary/20 bg-primary/5';
    case 'contrast':
      return 'border-slate-800 bg-[#0d1117] text-slate-100';
    case 'default':
    default:
      return 'border-border/60 bg-card/70';
  }
}

function readSectionText(
  section: AdminPageSection,
  key: string,
  fallback: string,
  isArabic: boolean,
) {
  return readComposerText(section.content, key, fallback, isArabic);
}

function AboutIntroSection({ section }: { section: AdminPageSection }) {
  const { profile, loading: profileLoading } = useProfile();
  const { assets, loading: mediaLoading } = usePublicMediaLibrary();
  const { data: projects } = usePublicCollection<ProjectRecord>('projects');
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const bio = isArabic ? profile.bioAr || profile.bio : profile.bio;
  const title = readSectionText(section, 'title', t('about.subtitle'), isArabic);
  const intro = readSectionText(section, 'intro', t('about.intro'), isArabic);
  const eyebrow = readSectionText(section, 'eyebrow', t('about.title'), isArabic);
  const centered = section.variant === 'centered';
  const minimal = section.variant === 'minimal';
  const displayName = isArabic ? profile.displayNameAr || profile.displayName : profile.displayName;
  const profileMediaLoading = profileLoading || mediaLoading;
  const totalProjectCount = mergePublicProjects(projects).length;
  const profileImage = profileMediaLoading
    ? null
    : resolveMediaField(
        {
          url: profile.profileImage,
          assetId: profile.profileImageAssetId,
        },
        assets,
      );
  const profileImageStyle = buildProfileImageStyle(profile);

  return (
    <section className="py-6 md:py-8">
      <div className={`space-y-8 ${centered ? 'mx-auto max-w-4xl text-center' : 'max-w-5xl'}`}>
        <div
          className={
            centered || minimal || !profileImage?.url
              ? 'space-y-6'
              : 'grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'
          }
        >
          <div className={`space-y-4 ${centered ? 'mx-auto max-w-3xl' : ''}`}>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
            <h1 className="font-heading text-4xl font-black tracking-tight text-foreground md:text-6xl">
              {title}
            </h1>
            <p className={`text-base leading-8 text-muted-foreground md:text-lg ${centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}>
              {intro}
            </p>
            {profileLoading ? (
              <div className={`space-y-3 ${centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`} aria-hidden="true">
                <SkeletonLine className="h-4 w-full" />
                <SkeletonLine className="h-4 w-5/6" />
                <SkeletonLine className="h-4 w-3/4" />
              </div>
            ) : bio ? (
              <p className={`text-base leading-8 text-muted-foreground ${centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}>
                {bio}
              </p>
            ) : null}
          </div>

          {profileMediaLoading ? (
            <div className={`${centered || minimal ? 'mx-auto w-full max-w-sm' : 'w-full'} overflow-hidden rounded-[1.5rem] border border-border/60 bg-muted/30 shadow-sm`}>
              <SkeletonMedia className="aspect-[4/5] w-full rounded-none" />
            </div>
          ) : profileImage?.url ? (
            <div className={`${centered || minimal ? 'mx-auto w-full max-w-sm' : 'w-full'} overflow-hidden rounded-[1.5rem] border border-border/60 bg-muted shadow-sm`}>
              <img
                src={profileImage.url}
                alt={profileImage.alt || displayName}
                referrerPolicy="no-referrer"
                className="aspect-[4/5] w-full bg-muted"
                style={profileImageStyle}
              />
            </div>
          ) : null}
        </div>

        {!minimal ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t('about.statProjects')}
              </p>
              <p className="mt-3 font-heading text-4xl font-black text-foreground">{totalProjectCount}</p>
            </div>
            <div className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t('about.statAvailability')}
              </p>
              <div className="mt-3 font-heading text-xl font-bold text-foreground">
                {profileLoading ? (
                  <SkeletonLine className="h-7 w-32" />
                ) : (
                  t(profile.isAvailable ? 'about.availableNow' : 'about.unavailableNow')
                )}
              </div>
            </div>
            <div className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t('about.statDisciplines')}
              </p>
              <p className="mt-3 font-heading text-4xl font-black text-foreground">3</p>
            </div>
          </div>
        ) : null}

        <div className={`flex flex-wrap gap-4 ${centered ? 'justify-center' : ''}`}>
          <Link
            to="/projects"
            className={buttonVariants({
              size: 'lg',
              className: 'h-12 gap-2 px-7 text-sm font-bold',
            })}
          >
            {t('about.viewProjects')}
            <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
          </Link>
          <Link
            to="/contact"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className: 'h-12 border-border/70 bg-card/60 px-7 text-sm font-bold',
            })}
          >
            {t('about.contactCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}

function StrengthsSection({ section }: { section: AdminPageSection }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const strengths = [
    readSectionText(section, 'strength1', t('about.strength1'), isArabic),
    readSectionText(section, 'strength2', t('about.strength2'), isArabic),
    readSectionText(section, 'strength3', t('about.strength3'), isArabic),
  ];
  const title = readSectionText(section, 'title', '', isArabic);
  const subtitle = readSectionText(section, 'subtitle', '', isArabic);
  const centered = section.variant === 'card';

  return (
    <section className="py-4 md:py-6">
      {title || subtitle ? (
        <div className={`mb-8 ${centered ? 'max-w-3xl text-center mx-auto' : 'max-w-3xl'}`}>
          {title ? <h2 className="font-heading text-3xl font-black text-foreground">{title}</h2> : null}
          {subtitle ? <p className="mt-3 text-base leading-8 text-muted-foreground">{subtitle}</p> : null}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-3">
        {strengths.map((item) => (
          <div
            key={item}
            className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}
          >
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm font-semibold leading-7 text-foreground">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EditorCardSection({ section }: { section: AdminPageSection }) {
  const { profile, loading: profileLoading } = useProfile();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const displayName = isArabic ? profile.displayNameAr || profile.displayName : profile.displayName;
  const role = isArabic ? profile.titleAr || profile.title : profile.title;
  const comment = readSectionText(section, 'comment', t('about.editorComment'), isArabic);
  const filename = readSectionText(section, 'filename', 'about-workspace.ts', false);

  return (
    <section className="py-4 md:py-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-[#0d1117] shadow-2xl" dir="ltr">
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-5 py-3 font-mono text-xs text-slate-400">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            {filename}
          </div>
          <div className="w-12" />
        </div>

        <div className="grid grid-cols-[52px_1fr]">
          <div className="border-e border-slate-800 bg-[#0b0f14] py-5 text-right font-mono text-xs text-slate-600">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="px-3 leading-7">
                {index + 1}
              </div>
            ))}
          </div>
          <div className="space-y-3 px-5 py-5 font-mono text-sm text-slate-300">
            <p className="text-slate-500">/** {comment} */</p>
            <div className="leading-7">
              name:{' '}
              {profileLoading ? (
                <SkeletonLine className="inline-block h-4 w-36 align-middle" />
              ) : (
                `"${displayName}"`
              )}
            </div>
            <div className="leading-7">
              role:{' '}
              {profileLoading ? (
                <SkeletonLine className="inline-block h-4 w-44 align-middle" />
              ) : (
                `"${role}"`
              )}
            </div>
            <div className="leading-7">location: "{t('about.locationValue')}"</div>
            <div className="leading-7">
              availability:{' '}
              {profileLoading ? (
                <SkeletonLine className="inline-block h-4 w-32 align-middle" />
              ) : (
                `"${t(profile.isAvailable ? 'about.availableNow' : 'about.unavailableNow')}"`
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Firebase', 'Node.js', 'Tailwind CSS', 'Express'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactIntroSection({ section }: { section: AdminPageSection }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const eyebrow = readSectionText(section, 'eyebrow', t('contact.eyebrow'), isArabic);
  const title = readSectionText(section, 'title', t('contact.title'), isArabic);
  const highlight = readSectionText(section, 'highlight', t('contact.usefulTogether'), isArabic);
  const subtitle = readSectionText(section, 'subtitle', t('contact.subtitle'), isArabic);
  const centered = section.variant === 'centered';

  return (
    <section className="py-6 md:py-8">
      <header className={`${centered ? 'mx-auto max-w-4xl text-center' : 'max-w-3xl'} space-y-5`}>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
        <h1 className="font-heading text-4xl font-black tracking-tight text-foreground md:text-6xl">
          {title} <span className="text-primary">{highlight}</span>
        </h1>
        <p className="text-base leading-8 text-muted-foreground md:text-lg">{subtitle}</p>
      </header>
    </section>
  );
}

function ContactFormSection({ section }: { section: AdminPageSection }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
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
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-[1.5rem] border border-primary/20 bg-primary/10 p-4"
          >
            <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">{t('contact.successTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('contact.successMsg')}</p>
            </div>
          </motion.div>
        ) : null}

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
        )}
      </div>
    </section>
  );
}

function AvailabilitySection({ section }: { section: AdminPageSection }) {
  const { contactSettings, loading: contactLoading } = useContactSettings({ publicRead: true });
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const title = readSectionText(section, 'title', t('contact.availableForWork'), isArabic);
  const subtitle = readSectionText(
    section,
    'subtitle',
    isArabic
      ? contactSettings.availabilityLabelAr || t('contact.availableDesc')
      : contactSettings.availabilityLabel || t('contact.availableDesc'),
    isArabic,
  );
  const responseValue = isArabic
    ? contactSettings.responseTimeAr || t('contact.responseValue')
    : contactSettings.responseTime || t('contact.responseValue');
  const locationValue = isArabic
    ? contactSettings.locationAr || t('contact.remote')
    : contactSettings.location || t('contact.remote');

  return (
    <section className="py-4 md:py-6">
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
            <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
          </div>
          {contactLoading ? (
            <div className="mt-4 space-y-3" aria-hidden="true">
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-4/5" />
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
            <div className="flex items-center gap-3 text-primary">
              <Clock className="h-5 w-5" />
              <p className="font-semibold text-foreground">{t('contact.responseTitle')}</p>
            </div>
            {contactLoading ? (
              <SkeletonLine className="mt-4 h-4 w-40" />
            ) : (
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{responseValue}</p>
            )}
          </div>
          <div className={`rounded-[1.5rem] border p-5 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
            <div className="flex items-center gap-3 text-primary">
              <MapPin className="h-5 w-5" />
              <p className="font-semibold text-foreground">{t('contact.location')}</p>
            </div>
            {contactLoading ? (
              <SkeletonLine className="mt-4 h-4 w-32" />
            ) : (
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{locationValue}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactMethodsSection({ section }: { section: AdminPageSection }) {
  const { profile, loading: profileLoading } = useProfile();
  const { contactSettings, loading: contactLoading } = useContactSettings({ publicRead: true });
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const directTitle = readSectionText(section, 'directTitle', t('contact.directChannelsTitle'), isArabic);
  const socialTitle = readSectionText(section, 'socialTitle', t('contact.socialLinksTitle'), isArabic);

  const directChannels = [
    contactSettings.email
      ? { label: t('contact.email'), value: contactSettings.email, href: `mailto:${contactSettings.email}` }
      : null,
    contactSettings.whatsapp
      ? {
          label: t('contact.whatsapp'),
          value: contactSettings.whatsapp,
          href: `https://wa.me/${contactSettings.whatsapp.replace(/[^\d]/g, '')}`,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href: string }>;

  const socialLinks = [
    profile.linkedinUrl ? { href: profile.linkedinUrl, label: 'LinkedIn', icon: ExternalLink } : null,
    profile.githubUrl ? { href: profile.githubUrl, label: 'GitHub', icon: Code } : null,
    profile.websiteUrl ? { href: profile.websiteUrl, label: t('contact.website'), icon: ExternalLink } : null,
  ].filter(Boolean) as Array<{ href: string; label: string; icon: typeof ExternalLink }>;

  return (
    <section className="py-4 md:py-6">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className={`rounded-[1.5rem] border p-6 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
          <div className="flex items-center gap-3 text-primary">
            <Mail className="h-5 w-5" />
            <h2 className="font-heading text-lg font-bold text-foreground">{directTitle}</h2>
          </div>
          <div className="mt-5 space-y-3">
            {contactLoading ? (
              <>
                <SkeletonLine className="h-11 w-full rounded-[1.25rem]" />
                <SkeletonLine className="h-11 w-full rounded-[1.25rem]" />
              </>
            ) : directChannels.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.href.startsWith('https://') ? '_blank' : undefined}
                rel={item.href.startsWith('https://') ? 'noreferrer' : undefined}
                className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-border/60 bg-background/60 px-4 py-3 text-sm transition-colors hover:bg-muted/60"
              >
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-muted-foreground" dir="ltr">
                  {item.value}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {profileLoading ? (
            <div className={`rounded-[1.5rem] border p-6 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
              <div className="flex items-center gap-3 text-primary">
                <Mail className="h-5 w-5" />
                <h2 className="font-heading text-lg font-bold text-foreground">{socialTitle}</h2>
              </div>
              <div className="mt-5 flex flex-wrap gap-3" aria-hidden="true">
                <SkeletonLine className="h-9 w-24" />
                <SkeletonLine className="h-9 w-20" />
              </div>
            </div>
          ) : socialLinks.length > 0 ? (
            <div className={`rounded-[1.5rem] border p-6 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
              <div className="flex items-center gap-3 text-primary">
                <Mail className="h-5 w-5" />
                <h2 className="font-heading text-lg font-bold text-foreground">{socialTitle}</h2>
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
          ) : null}

          <div className={`rounded-[1.5rem] border p-6 shadow-sm ${getSurfaceTone(section.stylePreset)}`}>
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
        </div>
      </div>
    </section>
  );
}

type PublicPageComposerProps = {
  pageId: PlatformPageId;
  pageConfig: AdminPageConfig;
  loading?: boolean;
};

function renderSection(pageId: PlatformPageId, section: AdminPageSection) {
  switch (section.type) {
    case 'hero':
      return <HeroSection key={section.id} variant={section.variant as 'split' | 'centered' | 'minimal'} content={section.content} />;
    case 'showcase':
      return <ShowcaseSection key={section.id} variant={section.variant as 'grid' | 'spotlight'} content={section.content} />;
    case 'featuredProjects':
      return (
        <FeaturedProjectsGrid
          key={section.id}
          variant={section.variant as 'spotlight' | 'grid' | 'carousel'}
          content={section.content}
        />
      );
    case 'testimonials':
      return <TestimonialsSection key={section.id} variant={section.variant as 'card' | 'minimal'} content={section.content} />;
    case 'cta':
      return <CTASection key={section.id} variant={section.variant as 'banner' | 'card' | 'terminal-strip'} content={section.content} />;
    case 'aboutIntro':
      return <AboutIntroSection key={section.id} section={section} />;
    case 'strengths':
      return <StrengthsSection key={section.id} section={section} />;
    case 'editorCard':
      return <EditorCardSection key={section.id} section={section} />;
    case 'contactIntro':
      return <ContactIntroSection key={section.id} section={section} />;
    case 'contactForm':
      return <ContactFormSection key={section.id} section={section} />;
    case 'contactMethods':
      return <ContactMethodsSection key={section.id} section={section} />;
    case 'availability':
      return <AvailabilitySection key={section.id} section={section} />;
    default:
      return null;
  }
}

export function PublicPageComposer({ pageId, pageConfig, loading = false }: PublicPageComposerProps) {
  const enabledSections = useMemo(
    () => pageConfig.sections.filter((section) => section.enabled),
    [pageConfig.sections],
  );

  const pageClass =
    pageId === 'home'
      ? 'flex w-full flex-col gap-10 overflow-hidden lg:gap-16'
      : pageId === 'contact'
        ? 'relative flex w-full flex-col gap-8 py-2'
        : 'flex w-full flex-col gap-8 pt-2 pb-10';

  if (loading && enabledSections.length === 0) {
    return (
      <div className={pageClass}>
        <SkeletonBlocks count={pageId === 'home' ? 4 : 3} />
      </div>
    );
  }

  return <div className={pageClass}>{enabledSections.map((section) => renderSection(pageId, section))}</div>;
}
