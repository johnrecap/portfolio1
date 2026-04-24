import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/hooks/useProfile";
import { useSeoSettings } from "@/hooks/usePlatformSettings";
import { resolveLocalizedSeoTitle } from "@/lib/admin/brand";

type PageSeoProps = {
  title?: string;
  description?: string;
  image?: string;
};

export function PageSeo({ title, description, image }: PageSeoProps) {
  const { profile, loading: profileLoading } = useProfile();
  const { seoSettings, loading: seoLoading } = useSeoSettings({ publicRead: true });
  const { i18n } = useTranslation();

  const localizedSiteTitle = resolveLocalizedSeoTitle(seoSettings, profile, i18n.language === "ar");
  const localizedSiteDescription =
    i18n.language === "ar"
      ? seoSettings.defaultDescriptionAr || profile.metaDescriptionAr || profile.metaDescription || profile.bioAr || profile.bio
      : seoSettings.defaultDescription || profile.metaDescription || profile.bio;

  const fullTitle = title ? `${title} | ${localizedSiteTitle}` : localizedSiteTitle;
  const metaDescription = description || (profileLoading || seoLoading ? "" : localizedSiteDescription);
  const metaImage =
    image ||
    (!seoLoading ? seoSettings.ogImage : "") ||
    (!profileLoading ? profile.heroImage || profile.profileImage : "");

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {metaDescription ? <meta name="description" content={metaDescription} /> : null}
      <meta property="og:title" content={fullTitle} />
      {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
      {metaImage ? <meta property="og:image" content={metaImage} /> : null}
      {seoSettings.siteUrl ? <meta property="og:url" content={seoSettings.siteUrl} /> : null}
    </Helmet>
  );
}
