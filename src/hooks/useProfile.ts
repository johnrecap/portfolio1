import { usePublicDocument } from './public-firestore';
import { createDefaultProfileSettings } from '@/lib/admin/defaults';

const DEFAULT_PROFILE = {
  ...createDefaultProfileSettings(),
  githubUrl: 'https://github.com/msaied',
  linkedinUrl: 'https://linkedin.com/in/msaied',
  profileImage:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCEpMS7bpnt68tnkqp2_cxoeyhdbNW2Lw1xH-CJeYb54crTGf7O5C62aNhBOGRSTadCUJpH-pn3dXLnPmifpdQz-MYuOXQ1MQr2L_9mwz182oeztwNSS551GOzV4BwQ8Wo45Ipps2kpfiBu-UwhegVRWsQdjKu7nf0s_lxwoJnISIWW5ApFuzIiXi2D2KwlfHJjfUt9DSqWklyXgRtdiAo-71h1gp8V-g6wigCUbt0PV90cv_1eEO51D_xHeEwL953DpHW1Q0GI8Rk2',
};

const LOADING_PROFILE = {
  ...DEFAULT_PROFILE,
  profileImage: '',
  profileImageAssetId: '',
  heroImage: '',
  heroImageAssetId: '',
};

export function useProfile() {
  const { data, loading } = usePublicDocument('settings', 'profile');

  if (loading) {
    return { profile: LOADING_PROFILE, loading };
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
