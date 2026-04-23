import type {
  AdminPageSection,
  PageSectionType,
  PageSectionVariant,
  PlatformPageId,
} from './types';

export type SectionContentFieldType = 'text' | 'textarea' | 'url';

export type SectionContentField = {
  key: string;
  type: SectionContentFieldType;
  label: string;
  labelAr: string;
  placeholder?: string;
  placeholderAr?: string;
  rows?: number;
  dir?: 'ltr' | 'rtl' | 'auto';
};

export type PageSectionDefinition = {
  type: PageSectionType;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  pages: PlatformPageId[];
  defaultVariant: PageSectionVariant;
  variants: PageSectionVariant[];
  fields: SectionContentField[];
};

const MULTILINGUAL_COPY_FIELDS = [
  {
    key: 'eyebrow',
    type: 'text',
    label: 'Eyebrow',
    labelAr: 'العنوان العلوي',
  },
  {
    key: 'eyebrowAr',
    type: 'text',
    label: 'Eyebrow Arabic',
    labelAr: 'العنوان العلوي بالعربية',
  },
  {
    key: 'title',
    type: 'text',
    label: 'Title',
    labelAr: 'العنوان',
  },
  {
    key: 'titleAr',
    type: 'text',
    label: 'Title Arabic',
    labelAr: 'العنوان بالعربية',
  },
  {
    key: 'subtitle',
    type: 'textarea',
    label: 'Description',
    labelAr: 'الوصف',
    rows: 4,
  },
  {
    key: 'subtitleAr',
    type: 'textarea',
    label: 'Description Arabic',
    labelAr: 'الوصف بالعربية',
    rows: 4,
  },
] as const satisfies SectionContentField[];

const SECTION_DEFINITIONS = [
  {
    type: 'hero',
    title: 'Hero',
    titleAr: 'الواجهة الأولى',
    description: 'Controls the first fold, the main promise, and the primary actions.',
    descriptionAr: 'يتحكم في أول شاشة، والوعد الرئيسي، والأزرار الأساسية.',
    pages: ['home'],
    defaultVariant: 'split',
    variants: ['split', 'centered', 'minimal'],
    fields: [
      ...MULTILINGUAL_COPY_FIELDS,
      {
        key: 'highlight',
        type: 'text',
        label: 'Highlight',
        labelAr: 'الكلمة البارزة',
      },
      {
        key: 'highlightAr',
        type: 'text',
        label: 'Highlight Arabic',
        labelAr: 'الكلمة البارزة بالعربية',
      },
      {
        key: 'primaryLabel',
        type: 'text',
        label: 'Primary CTA label',
        labelAr: 'نص الزر الأساسي',
      },
      {
        key: 'primaryLabelAr',
        type: 'text',
        label: 'Primary CTA label Arabic',
        labelAr: 'نص الزر الأساسي بالعربية',
      },
      {
        key: 'primaryHref',
        type: 'url',
        label: 'Primary CTA href',
        labelAr: 'رابط الزر الأساسي',
      },
      {
        key: 'secondaryLabel',
        type: 'text',
        label: 'Secondary CTA label',
        labelAr: 'نص الزر الثانوي',
      },
      {
        key: 'secondaryLabelAr',
        type: 'text',
        label: 'Secondary CTA label Arabic',
        labelAr: 'نص الزر الثانوي بالعربية',
      },
      {
        key: 'secondaryHref',
        type: 'url',
        label: 'Secondary CTA href',
        labelAr: 'رابط الزر الثانوي',
      },
    ],
  },
  {
    type: 'showcase',
    title: 'Showcase',
    titleAr: 'عرض القدرات',
    description: 'Highlights the breadth of the portfolio platform in one compact section.',
    descriptionAr: 'يعرض اتساع المنصة في سكشن مختصر وواضح.',
    pages: ['home'],
    defaultVariant: 'grid',
    variants: ['grid', 'spotlight'],
    fields: [...MULTILINGUAL_COPY_FIELDS],
  },
  {
    type: 'featuredProjects',
    title: 'Featured Projects',
    titleAr: 'المشروعات المميزة',
    description: 'Controls the featured-projects spotlight copy and supporting CTA.',
    descriptionAr: 'يتحكم في نصوص عرض المشروعات المميزة والزر الداعم لها.',
    pages: ['home'],
    defaultVariant: 'spotlight',
    variants: ['spotlight', 'grid', 'carousel'],
    fields: [
      ...MULTILINGUAL_COPY_FIELDS,
      {
        key: 'viewAllLabel',
        type: 'text',
        label: 'View all label',
        labelAr: 'نص زر عرض الكل',
      },
      {
        key: 'viewAllLabelAr',
        type: 'text',
        label: 'View all label Arabic',
        labelAr: 'نص زر عرض الكل بالعربية',
      },
    ],
  },
  {
    type: 'testimonials',
    title: 'Testimonials',
    titleAr: 'آراء العملاء',
    description: 'Controls the heading and intro for social proof content.',
    descriptionAr: 'يتحكم في عنوان ومقدمة قسم الآراء والتوصيات.',
    pages: ['home'],
    defaultVariant: 'card',
    variants: ['card', 'minimal'],
    fields: [...MULTILINGUAL_COPY_FIELDS],
  },
  {
    type: 'cta',
    title: 'Call to Action',
    titleAr: 'الدعوة إلى الإجراء',
    description: 'Handles the closing conversion block and its action links.',
    descriptionAr: 'يتحكم في قسم الإغلاق التحويلي وروابطه الأساسية.',
    pages: ['home', 'about', 'projects', 'blog'],
    defaultVariant: 'card',
    variants: ['banner', 'card', 'terminal-strip'],
    fields: [
      ...MULTILINGUAL_COPY_FIELDS,
      {
        key: 'primaryLabel',
        type: 'text',
        label: 'Primary action label',
        labelAr: 'نص الإجراء الأساسي',
      },
      {
        key: 'primaryLabelAr',
        type: 'text',
        label: 'Primary action label Arabic',
        labelAr: 'نص الإجراء الأساسي بالعربية',
      },
      {
        key: 'primaryHref',
        type: 'url',
        label: 'Primary action href',
        labelAr: 'رابط الإجراء الأساسي',
      },
      {
        key: 'secondaryLabel',
        type: 'text',
        label: 'Secondary action label',
        labelAr: 'نص الإجراء الثانوي',
      },
      {
        key: 'secondaryLabelAr',
        type: 'text',
        label: 'Secondary action label Arabic',
        labelAr: 'نص الإجراء الثانوي بالعربية',
      },
      {
        key: 'secondaryHref',
        type: 'url',
        label: 'Secondary action href',
        labelAr: 'رابط الإجراء الثانوي',
      },
    ],
  },
  {
    type: 'aboutIntro',
    title: 'About Intro',
    titleAr: 'مقدمة نبذة عني',
    description: 'Controls the main about-page introduction and opening narrative.',
    descriptionAr: 'يتحكم في مقدمة صفحة نبذة عني والرسالة الافتتاحية لها.',
    pages: ['about'],
    defaultVariant: 'split',
    variants: ['split', 'centered', 'minimal'],
    fields: [
      ...MULTILINGUAL_COPY_FIELDS,
      {
        key: 'intro',
        type: 'textarea',
        label: 'Intro body',
        labelAr: 'النص التمهيدي',
        rows: 4,
      },
      {
        key: 'introAr',
        type: 'textarea',
        label: 'Intro body Arabic',
        labelAr: 'النص التمهيدي بالعربية',
        rows: 4,
      },
    ],
  },
  {
    type: 'strengths',
    title: 'Strengths',
    titleAr: 'نقاط القوة',
    description: 'Controls the strengths list and the support copy around it.',
    descriptionAr: 'يتحكم في قائمة نقاط القوة والنصوص الداعمة المحيطة بها.',
    pages: ['about'],
    defaultVariant: 'grid',
    variants: ['grid', 'card'],
    fields: [
      ...MULTILINGUAL_COPY_FIELDS,
      {
        key: 'strength1',
        type: 'text',
        label: 'Strength 1',
        labelAr: 'نقطة القوة الأولى',
      },
      {
        key: 'strength1Ar',
        type: 'text',
        label: 'Strength 1 Arabic',
        labelAr: 'نقطة القوة الأولى بالعربية',
      },
      {
        key: 'strength2',
        type: 'text',
        label: 'Strength 2',
        labelAr: 'نقطة القوة الثانية',
      },
      {
        key: 'strength2Ar',
        type: 'text',
        label: 'Strength 2 Arabic',
        labelAr: 'نقطة القوة الثانية بالعربية',
      },
      {
        key: 'strength3',
        type: 'text',
        label: 'Strength 3',
        labelAr: 'نقطة القوة الثالثة',
      },
      {
        key: 'strength3Ar',
        type: 'text',
        label: 'Strength 3 Arabic',
        labelAr: 'نقطة القوة الثالثة بالعربية',
      },
    ],
  },
  {
    type: 'editorCard',
    title: 'Editor Card',
    titleAr: 'بطاقة المحرر',
    description: 'Controls the supporting code-editor style surface on the about page.',
    descriptionAr: 'يتحكم في البطاقة الداعمة ذات طابع محرر الكود في صفحة نبذة عني.',
    pages: ['about'],
    defaultVariant: 'editor',
    variants: ['editor', 'minimal'],
    fields: [
      {
        key: 'filename',
        type: 'text',
        label: 'Filename',
        labelAr: 'اسم الملف',
      },
      {
        key: 'comment',
        type: 'textarea',
        label: 'Editor comment',
        labelAr: 'تعليق المحرر',
        rows: 3,
      },
      {
        key: 'commentAr',
        type: 'textarea',
        label: 'Editor comment Arabic',
        labelAr: 'تعليق المحرر بالعربية',
        rows: 3,
      },
    ],
  },
  {
    type: 'contactIntro',
    title: 'Contact Intro',
    titleAr: 'مقدمة التواصل',
    description: 'Controls the top introduction and framing copy for the contact page.',
    descriptionAr: 'يتحكم في مقدمة صفحة التواصل والنصوص الافتتاحية الخاصة بها.',
    pages: ['contact'],
    defaultVariant: 'split',
    variants: ['split', 'centered'],
    fields: [
      ...MULTILINGUAL_COPY_FIELDS,
      {
        key: 'highlight',
        type: 'text',
        label: 'Highlight',
        labelAr: 'الكلمة البارزة',
      },
      {
        key: 'highlightAr',
        type: 'text',
        label: 'Highlight Arabic',
        labelAr: 'الكلمة البارزة بالعربية',
      },
    ],
  },
  {
    type: 'contactMethods',
    title: 'Contact Methods',
    titleAr: 'وسائل التواصل',
    description: 'Controls the direct channels and supporting contact labels.',
    descriptionAr: 'يتحكم في وسائل التواصل المباشرة والعناوين المساندة لها.',
    pages: ['contact'],
    defaultVariant: 'grid',
    variants: ['grid', 'card'],
    fields: [
      {
        key: 'title',
        type: 'text',
        label: 'Section title',
        labelAr: 'عنوان السكشن',
      },
      {
        key: 'titleAr',
        type: 'text',
        label: 'Section title Arabic',
        labelAr: 'عنوان السكشن بالعربية',
      },
      {
        key: 'directTitle',
        type: 'text',
        label: 'Direct channels title',
        labelAr: 'عنوان قنوات التواصل المباشر',
      },
      {
        key: 'directTitleAr',
        type: 'text',
        label: 'Direct channels title Arabic',
        labelAr: 'عنوان قنوات التواصل المباشر بالعربية',
      },
      {
        key: 'socialTitle',
        type: 'text',
        label: 'Social links title',
        labelAr: 'عنوان الروابط الاجتماعية',
      },
      {
        key: 'socialTitleAr',
        type: 'text',
        label: 'Social links title Arabic',
        labelAr: 'عنوان الروابط الاجتماعية بالعربية',
      },
    ],
  },
  {
    type: 'contactForm',
    title: 'Contact Form',
    titleAr: 'نموذج التواصل',
    description: 'Controls the form area title and short helper copy.',
    descriptionAr: 'يتحكم في عنوان منطقة النموذج والنص التوضيحي القصير.',
    pages: ['contact'],
    defaultVariant: 'default',
    variants: ['default', 'card'],
    fields: [...MULTILINGUAL_COPY_FIELDS],
  },
  {
    type: 'availability',
    title: 'Availability',
    titleAr: 'التوفر الحالي',
    description: 'Controls the sidebar availability messaging on the contact page.',
    descriptionAr: 'يتحكم في رسائل التوفر الحالية داخل العمود الجانبي بصفحة التواصل.',
    pages: ['contact'],
    defaultVariant: 'card',
    variants: ['card', 'minimal'],
    fields: [...MULTILINGUAL_COPY_FIELDS],
  },
  {
    type: 'projectsHero',
    title: 'Projects Hero',
    titleAr: 'مقدمة صفحة المشروعات',
    description: 'Controls the projects-page heading and intro copy.',
    descriptionAr: 'يتحكم في عنوان صفحة المشروعات ونصها التمهيدي.',
    pages: ['projects'],
    defaultVariant: 'centered',
    variants: ['centered', 'split'],
    fields: [...MULTILINGUAL_COPY_FIELDS],
  },
  {
    type: 'projectsListing',
    title: 'Projects Listing',
    titleAr: 'قائمة المشروعات',
    description: 'Controls the discovery/listing area copy for the projects page.',
    descriptionAr: 'يتحكم في نصوص منطقة الاستكشاف والقائمة داخل صفحة المشروعات.',
    pages: ['projects'],
    defaultVariant: 'grid',
    variants: ['grid', 'spotlight'],
    fields: [
      {
        key: 'title',
        type: 'text',
        label: 'Listing title',
        labelAr: 'عنوان القائمة',
      },
      {
        key: 'titleAr',
        type: 'text',
        label: 'Listing title Arabic',
        labelAr: 'عنوان القائمة بالعربية',
      },
      {
        key: 'subtitle',
        type: 'textarea',
        label: 'Listing intro',
        labelAr: 'مقدمة القائمة',
        rows: 3,
      },
      {
        key: 'subtitleAr',
        type: 'textarea',
        label: 'Listing intro Arabic',
        labelAr: 'مقدمة القائمة بالعربية',
        rows: 3,
      },
    ],
  },
  {
    type: 'blogHero',
    title: 'Blog Hero',
    titleAr: 'مقدمة المدونة',
    description: 'Controls the blog-page heading and intro copy.',
    descriptionAr: 'يتحكم في عنوان صفحة المدونة ونصها التمهيدي.',
    pages: ['blog'],
    defaultVariant: 'centered',
    variants: ['centered', 'split'],
    fields: [...MULTILINGUAL_COPY_FIELDS],
  },
  {
    type: 'blogListing',
    title: 'Blog Listing',
    titleAr: 'قائمة المقالات',
    description: 'Controls the listing copy for the blog index.',
    descriptionAr: 'يتحكم في نصوص قائمة المقالات داخل صفحة المدونة.',
    pages: ['blog'],
    defaultVariant: 'grid',
    variants: ['grid', 'minimal'],
    fields: [
      {
        key: 'title',
        type: 'text',
        label: 'Listing title',
        labelAr: 'عنوان القائمة',
      },
      {
        key: 'titleAr',
        type: 'text',
        label: 'Listing title Arabic',
        labelAr: 'عنوان القائمة بالعربية',
      },
      {
        key: 'subtitle',
        type: 'textarea',
        label: 'Listing intro',
        labelAr: 'مقدمة القائمة',
        rows: 3,
      },
      {
        key: 'subtitleAr',
        type: 'textarea',
        label: 'Listing intro Arabic',
        labelAr: 'مقدمة القائمة بالعربية',
        rows: 3,
      },
    ],
  },
] as const satisfies PageSectionDefinition[];

export function getSectionDefinition(type: PageSectionType): PageSectionDefinition {
  const definition = SECTION_DEFINITIONS.find((section) => section.type === type);

  if (!definition) {
    throw new Error(`Unknown section definition: ${type}`);
  }

  return definition;
}

export function getPageSectionDefinitions(pageId: PlatformPageId): PageSectionDefinition[] {
  return SECTION_DEFINITIONS.filter((section) => (section.pages as readonly PlatformPageId[]).includes(pageId));
}

export function normalizeSectionVariant(
  type: PageSectionType,
  variant: PageSectionVariant,
): PageSectionVariant {
  const definition = getSectionDefinition(type);
  return (definition.variants as readonly PageSectionVariant[]).includes(variant)
    ? variant
    : definition.defaultVariant;
}

export function sanitizePageSections(
  pageId: PlatformPageId,
  sections: AdminPageSection[],
): AdminPageSection[] {
  const allowedTypes = new Set(getPageSectionDefinitions(pageId).map((section) => section.type));

  return sections
    .filter((section) => allowedTypes.has(section.type))
    .map((section, index) => ({
      ...section,
      order: typeof section.order === 'number' ? section.order : index + 1,
      variant: normalizeSectionVariant(section.type, section.variant),
    }))
    .sort((left, right) => left.order - right.order);
}
