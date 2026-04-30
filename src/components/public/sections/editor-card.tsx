import { Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SkeletonLine } from '@/components/shared/PageState';
import { useProfile } from '@/hooks/useProfile';
import type { AdminPageSection } from '@/lib/admin/types';
import { readSectionText } from './section-utils';

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

export { EditorCardSection };
