import { usePublicDocument } from './public-firestore';
import { useDocument } from './useFirestore';
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

type PublicProfileOptions = {
  disabled?: boolean;
};

function resolveProfile(data: Record<string, unknown> | null, loading: boolean) {
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

export function useProfile(options?: PublicProfileOptions) {
  const { data, loading } = usePublicDocument<Record<string, unknown>>('settings', 'profile', options);
  return resolveProfile(data, loading);
}

export function useDashboardProfile() {
  const { data, loading } = useDocument<Record<string, unknown>>('settings', 'profile');
  return resolveProfile(data, loading);
}
