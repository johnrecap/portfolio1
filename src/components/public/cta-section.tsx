import { motion } from 'motion/react';
import { ArrowRight, Github, Linkedin, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfile } from '@/hooks/useProfile';
import { buttonVariants } from '@/components/ui/button';

export const CTASection = () => {
  const { t } = useTranslation();
  const { profile } = useProfile();

  const actions = [
    {
      href: '/contact',
      label: t('ctaSection.primaryAction'),
      internal: true,
      icon: ArrowRight,
    },
    profile.githubUrl
      ? {
          href: profile.githubUrl,
          label: 'GitHub',
          internal: false,
          icon: Github,
        }
      : null,
    profile.linkedinUrl
      ? {
          href: profile.linkedinUrl,
          label: 'LinkedIn',
          internal: false,
          icon: Linkedin,
        }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    internal: boolean;
    icon: typeof ArrowRight;
  }>;

  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-slate-800 bg-[#0d1117] shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-slate-800 bg-[#161b22] px-5 py-3 font-mono text-xs text-slate-400">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="mx-auto flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            root@portfolio:~# connect
          </div>
        </div>

        <div className="grid gap-10 p-8 lg:grid-cols-[1fr_0.9fr] lg:p-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {t('ctaSection.eyebrow')}
            </p>
            <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-white md:text-5xl">
              {t('ctaSection.title')}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              {t('ctaSection.description')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {actions.map((action) =>
                action.internal ? (
                  <Link
                    key={action.href}
                    to={action.href}
                    className={buttonVariants({
                      className:
                        'h-12 gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-hover',
                    })}
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                ) : (
                  <a
                    key={action.href}
                    href={action.href}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({
                      variant: 'outline',
                      className:
                        'h-12 gap-2 rounded-full border-white/10 bg-white/5 px-6 text-sm font-bold text-white hover:bg-white/10 hover:text-white',
                    })}
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </a>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                {t('ctaSection.responseTitle')}
              </p>
              <p className="mt-3 text-lg font-semibold text-white">{t('ctaSection.responseValue')}</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">{t('ctaSection.responseDescription')}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                {t('ctaSection.focusTitle')}
              </p>
              <p className="mt-3 text-lg font-semibold text-white">{t('ctaSection.focusValue')}</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">{t('ctaSection.focusDescription')}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
