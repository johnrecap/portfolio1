import { useDocument } from './useFirestore';

const DEFAULT_PROFILE = {
  displayName: 'Mohamed Saied',
  displayNameAr: 'محمد سعيد',
  title: 'Full-Stack Developer',
  titleAr: 'مطور برمجيات متكامل',
  bio: "Crafting robust, scalable web and mobile applications with a focus on modern architectures and seamless user experiences. Passionate about clean code and kinetic UI design.",
  bioAr: "أصمم وأبني تطبيقات ويب وهواتف محمولة قوية وقابلة للتوسع مع التركيز على البنى الحديثة وتقديم تجارب مستخدم متميزة. شغوف بكتابة أكواد نظيفة وتصميم واجهات تفاعلية.",
  isAvailable: true,
  githubUrl: 'https://github.com/msaied',
  linkedinUrl: 'https://linkedin.com/in/msaied',
  websiteUrl: '',
  metaTitle: 'Mohamed Saied - Full Stack Developer',
  metaTitleAr: 'محمد سعيد - مطور برمجيات متكامل',
  metaDescription: 'Portfolio and digital workspace of Mohamed Saied, specializing in modern web and mobile application development.',
  metaDescriptionAr: 'مساحة رقمية وتطبيقات محمد سعيد، متخصص في تطوير الويب الحديث وتطبيقات الهواتف الموبايل.',
  profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEpMS7bpnt68tnkqp2_cxoeyhdbNW2Lw1xH-CJeYb54crTGf7O5C62aNhBOGRSTadCUJpH-pn3dXLnPmifpdQz-MYuOXQ1MQr2L_9mwz182oeztwNSS551GOzV4BwQ8Wo45Ipps2kpfiBu-UwhegVRWsQdjKu7nf0s_lxwoJnISIWW5ApFuzIiXi2D2KwlfHJjfUt9DSqWklyXgRtdiAo-71h1gp8V-g6wigCUbt0PV90cv_1eEO51D_xHeEwL953DpHW1Q0GI8Rk2',
  heroImage: '',
};

export function useProfile() {
  const { data, loading } = useDocument('settings', 'profile');
  
  if (loading) return { profile: DEFAULT_PROFILE, loading };
  
  // Merge loaded overrides, but ignore empty strings to avoid breaking the UI
  const mergedProfile = { ...DEFAULT_PROFILE };
  if (data) {
    Object.keys(data).forEach(key => {
      const val = (data as any)[key];
      if (val !== undefined && val !== null && val !== '') {
        (mergedProfile as any)[key] = val;
      }
    });
  }
  
  return { 
    profile: mergedProfile, 
    loading 
  };
}
