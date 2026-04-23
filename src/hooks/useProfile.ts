import { useDocument } from './useFirestore';

const DEFAULT_PROFILE = {
  displayName: 'Mohamed Saied',
  displayNameAr: '\u0645\u062d\u0645\u062f \u0633\u0639\u064a\u062f',
  title: 'Full-Stack Product Engineer',
  titleAr: '\u0645\u0647\u0646\u062f\u0633 \u0645\u0646\u062a\u062c\u0627\u062a \u0648\u0628\u0631\u0645\u062c\u064a\u0627\u062a \u0645\u062a\u0643\u0627\u0645\u0644',
  bio: 'I design and ship polished web products, admin dashboards, and scalable backend workflows with a strong focus on clarity, performance, and maintainable systems.',
  bioAr:
    '\u0623\u0635\u0645\u0645 \u0648\u0623\u0637\u0648\u0651\u0631 \u0645\u0646\u062a\u062c\u0627\u062a \u0648\u064a\u0628 \u0645\u062a\u0643\u0627\u0645\u0644\u0629 \u0648\u0644\u0648\u062d\u0627\u062a \u062a\u062d\u0643\u0645 \u0639\u0645\u0644\u064a\u0629 \u0648\u062a\u062f\u0641\u0642\u0627\u062a \u062e\u0644\u0641\u064a\u0629 \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062a\u0648\u0633\u0639\u060c \u0645\u0639 \u062a\u0631\u0643\u064a\u0632 \u0648\u0627\u0636\u062d \u0639\u0644\u0649 \u0627\u0644\u0648\u0636\u0648\u062d \u0648\u0627\u0644\u0623\u062f\u0627\u0621 \u0648\u0633\u0647\u0648\u0644\u0629 \u0627\u0644\u062a\u0637\u0648\u064a\u0631 \u0644\u0627\u062d\u0642\u064b\u0627.',
  isAvailable: true,
  githubUrl: 'https://github.com/msaied',
  linkedinUrl: 'https://linkedin.com/in/msaied',
  websiteUrl: '',
  metaTitle: 'Mohamed Studio | Mohamed Saied',
  metaTitleAr: '\u0645\u062d\u0645\u062f \u0633\u062a\u0648\u062f\u064a\u0648 | \u0645\u062d\u0645\u062f \u0633\u0639\u064a\u062f',
  metaDescription:
    'Mohamed Studio is the bilingual portfolio and digital workspace of Mohamed Saied, focused on product engineering, modern frontend systems, backend architecture, and admin-managed site experiences.',
  metaDescriptionAr:
    '\u0645\u062d\u0645\u062f \u0633\u062a\u0648\u062f\u064a\u0648 \u0647\u0648 \u0627\u0644\u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0631\u0642\u0645\u064a\u0629 \u062b\u0646\u0627\u0626\u064a\u0629 \u0627\u0644\u0644\u063a\u0629 \u0644\u0645\u062d\u0645\u062f \u0633\u0639\u064a\u062f\u060c \u0648\u064a\u0631\u0643\u0632 \u0639\u0644\u0649 \u0647\u0646\u062f\u0633\u0629 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a\u060c \u0648\u0627\u0644\u0648\u0627\u062c\u0647\u0627\u062a \u0627\u0644\u062d\u062f\u064a\u062b\u0629\u060c \u0648\u0627\u0644\u0628\u0646\u064a\u0629 \u0627\u0644\u062e\u0644\u0641\u064a\u0629\u060c \u0648\u062a\u062c\u0627\u0631\u0628 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062f\u0627\u0631\u0629 \u0628\u064a\u0627\u0646\u0627\u062a\u0647.',
  profileImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCEpMS7bpnt68tnkqp2_cxoeyhdbNW2Lw1xH-CJeYb54crTGf7O5C62aNhBOGRSTadCUJpH-pn3dXLnPmifpdQz-MYuOXQ1MQr2L_9mwz182oeztwNSS551GOzV4BwQ8Wo45Ipps2kpfiBu-UwhegVRWsQdjKu7nf0s_lxwoJnISIWW5ApFuzIiXi2D2KwlfHJjfUt9DSqWklyXgRtdiAo-71h1gp8V-g6wigCUbt0PV90cv_1eEO51D_xHeEwL953DpHW1Q0GI8Rk2',
  heroImage: '',
};

export function useProfile() {
  const { data, loading } = useDocument('settings', 'profile');

  if (loading) {
    return { profile: DEFAULT_PROFILE, loading };
  }

  const mergedProfile = { ...DEFAULT_PROFILE };

  if (data) {
    Object.keys(data).forEach((key) => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && value !== '') {
        (mergedProfile as Record<string, unknown>)[key] = value;
      }
    });
  }

  return {
    profile: mergedProfile,
    loading,
  };
}
