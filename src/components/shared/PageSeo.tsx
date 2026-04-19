import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/hooks/useProfile";

type PageSeoProps = {
  title?: string;
  description?: string;
  image?: string;
};

export function PageSeo({ title, description, image }: PageSeoProps) {
  const { profile } = useProfile();
  const { i18n } = useTranslation();

  const localizedSiteTitle =
    i18n.language === "ar"
      ? profile.metaTitleAr || profile.metaTitle
      : profile.metaTitle;
  const localizedSiteDescription =
    i18n.language === "ar"
      ? profile.metaDescriptionAr || profile.metaDescription || profile.bioAr || profile.bio
      : profile.metaDescription || profile.bio;

  const fullTitle = title ? `${title} | ${localizedSiteTitle}` : localizedSiteTitle;
  const metaDescription = description || localizedSiteDescription;
  const metaImage = image || profile.heroImage || profile.profileImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {metaImage ? <meta property="og:image" content={metaImage} /> : null}
    </Helmet>
  );
}
