import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/hooks/useProfile";
import { useSeoSettings } from "@/hooks/usePlatformSettings";
import { resolveLocalizedSeoTitle } from "@/lib/admin/brand";

const DEFAULT_CANONICAL_SITE_URL = "https://portfolio.saeeddev.com";

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

  const normalizedTitle = title?.trim();
  const fullTitle =
    normalizedTitle && normalizedTitle !== localizedSiteTitle
      ? `${normalizedTitle} | ${localizedSiteTitle}`
      : localizedSiteTitle;
  const metaDescription = description || (profileLoading || seoLoading ? "" : localizedSiteDescription);
  const metaImage =
    image ||
    (!seoLoading ? seoSettings.ogImage : "") ||
    (!profileLoading ? profile.heroImage || profile.profileImage : "");
  const siteUrl = (seoSettings.siteUrl || DEFAULT_CANONICAL_SITE_URL).replace(/\/$/, "");
  const canonicalUrl =
    typeof window === "undefined"
      ? `${siteUrl}/`
      : `${siteUrl}${window.location.pathname === "/" ? "/" : window.location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {metaDescription ? <meta name="description" content={metaDescription} /> : null}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
      {metaImage ? <meta property="og:image" content={metaImage} /> : null}
      <meta property="og:url" content={canonicalUrl} />
    </Helmet>
  );
}
