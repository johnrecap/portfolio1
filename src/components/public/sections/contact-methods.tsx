import { Code, ExternalLink, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SkeletonLine } from '@/components/shared/PageState';
import { useContactSettings } from '@/hooks/usePlatformSettings';
import { useProfile } from '@/hooks/useProfile';
import type { AdminPageSection } from '@/lib/admin/types';
import { getSurfaceTone, readSectionText } from './section-utils';

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
                rel={item.href.startsWith('https://') ? 'noopener noreferrer' : undefined}
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
                    rel="noopener noreferrer"
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

export { ContactMethodsSection };
