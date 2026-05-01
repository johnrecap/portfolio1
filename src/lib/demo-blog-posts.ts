type BlogRecord = {
  id: string;
  title: string;
  titleAr?: string | null;
  slug: string;
  excerpt: string;
  excerptAr?: string | null;
  content: string;
  contentAr?: string | null;
  category: string;
  coverImage?: string | null;
  coverImageAssetId?: string | null;
  image?: string | null;
  imageAssetId?: string | null;
  tags?: string[] | null;
  readTime?: string | null;
  featured?: boolean | null;
  seo?: {
    title?: string | null;
    titleAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    image?: string | null;
    imageAssetId?: string | null;
  } | null;
  createdAt?: { seconds?: number | null } | null;
};

export const DEMO_BLOG_POSTS: BlogRecord[] = [
  {
    id: 'blog-shopnest-commerce-demo',
    title: 'How ShopNest Commerce Works: React E-commerce Dashboard and Storefront Demo',
    titleAr: 'شرح ديمو ShopNest Commerce: متجر إلكتروني ولوحة إدارة مبنية بـ React',
    slug: 'shopnest-commerce-react-ecommerce-dashboard',
    excerpt:
      'A practical breakdown of the ShopNest Commerce demo, who it helps, how the storefront and admin dashboard work, and which React technologies power it.',
    excerptAr:
      'شرح عملي لديمو ShopNest Commerce، الفئات المستفيدة منه، طريقة عمل واجهة المتجر ولوحة الإدارة، والتقنيات المستخدمة في بنائه.',
    category: 'E-commerce Dashboards',
    coverImage: '/demo-previews/ShopNest-Commerce.png',
    tags: ['React ecommerce dashboard', 'e-commerce admin dashboard', 'React', 'TypeScript', 'Zustand'],
    readTime: '7 min',
    featured: true,
    createdAt: { seconds: 1_777_406_400 },
    seo: {
      title: 'React Ecommerce Dashboard Demo - How ShopNest Commerce Works',
      titleAr: 'شرح ديمو متجر إلكتروني React ولوحة إدارة ShopNest Commerce',
      description:
        'Learn how the ShopNest Commerce React ecommerce dashboard demo works, who it helps, the business value it shows, and the technologies behind it.',
      descriptionAr:
        'تعرف على طريقة عمل ديمو متجر ShopNest Commerce المبني بـ React، والفئات المستفيدة منه، وقيمته العملية، والتقنيات المستخدمة.',
      image: '/demo-previews/ShopNest-Commerce.png',
    },
    content: `## What this demo is

ShopNest Commerce is a working React e-commerce demo that combines two surfaces in one product: a customer-facing storefront and an admin dashboard for managing the operation behind it.

The goal is not to show a static product grid. The demo shows how a real store experience can move from browsing products to cart behavior, checkout states, coupons, orders, and product management.

## Who it is useful for

This kind of system is useful for store owners, small retail teams, founders testing a commerce idea, and agencies that need to show a client a realistic e-commerce workflow before a full build.

It is especially relevant when the project needs both a storefront and an internal e-commerce admin dashboard instead of only a marketing site.

## How it works

The storefront lets visitors browse products, view product details, add items to a cart, apply coupons, and move through checkout states. The admin area focuses on the operational side: products, orders, coupons, and sales visibility.

The demo data is session-scoped, so a visitor can edit and test without changing the default state for the next visitor.

## Business value

For a client, this demo proves that the project can support both the buyer journey and the internal workflow. That matters because many commerce projects fail when the admin workflow is treated as an afterthought.

The strongest value is showing how the public store and the management dashboard belong to the same product.

## Technologies used

- React
- TypeScript
- Tailwind CSS
- Zustand
- React Router
- React Hook Form
- Zod
- Recharts
- Vite

## Search intent covered

This article supports searches around React ecommerce dashboard, e-commerce admin dashboard, React e-commerce app, storefront and admin dashboard, and online store management dashboard.

## When to build something like this

Build this direction when the store needs custom product behavior, operational controls, dashboards, coupons, checkout states, or workflows that a simple template cannot express cleanly.

If your store needs a practical storefront plus an admin workflow, review the ShopNest Commerce demo and send the project context through the contact page.`,
    contentAr: `## ما هو هذا الديمو؟

ShopNest Commerce هو ديمو متجر إلكتروني مبني بـ React يجمع بين واجهتين: واجهة متجر للعميل، ولوحة إدارة لتشغيل المنتجات والطلبات والكوبونات.

الهدف ليس عرض شبكة منتجات ثابتة فقط، بل توضيح كيف تتحرك تجربة المتجر من التصفح إلى السلة والدفع وإدارة الطلبات.

## لمن يفيد؟

يناسب أصحاب المتاجر، فرق البيع الصغيرة، مؤسسي المنتجات التجارية، والوكالات التي تحتاج عرض تجربة متجر واقعية قبل تنفيذ مشروع كامل.

يفيد خصوصًا عندما يحتاج المشروع إلى متجر إلكتروني ولوحة إدارة متجر إلكتروني، وليس صفحة عرض فقط.

## كيف يعمل؟

واجهة المتجر تسمح بتصفح المنتجات، عرض التفاصيل، الإضافة إلى السلة، استخدام الكوبونات، وتجربة حالات الدفع. أما لوحة الإدارة فتركز على المنتجات والطلبات والكوبونات وقراءة مؤشرات البيع.

بيانات الديمو معزولة لكل جلسة، لذلك يستطيع الزائر التجربة والتعديل بدون التأثير على الزائر التالي.

## الفائدة العملية

يوضح الديمو أن المشروع التجاري يحتاج إلى تجربة شراء واضحة ونظام إدارة خلفها. كثير من مشاريع التجارة الإلكترونية تفشل عندما يتم تجاهل لوحة الإدارة أو بناؤها كجزء ثانوي.

القيمة الأساسية هنا أن المتجر ولوحة الإدارة يعملان كمنتج واحد.

## التقنيات المستخدمة

- React
- TypeScript
- Tailwind CSS
- Zustand
- React Router
- React Hook Form
- Zod
- Recharts
- Vite

## الكلمات المفتاحية المستهدفة

متجر إلكتروني React، لوحة إدارة متجر إلكتروني، React ecommerce dashboard، e-commerce admin dashboard، إدارة منتجات وطلبات.

إذا كنت تحتاج متجرًا إلكترونيًا مع لوحة إدارة عملية، افتح ديمو ShopNest Commerce ثم أرسل تفاصيل مشروعك من صفحة التواصل.`,
  },
  {
    id: 'blog-clinic-flow-manager-demo',
    title: 'ClinicFlow Manager: Clinic Management Dashboard Workflow Explained',
    titleAr: 'شرح ClinicFlow Manager: لوحة إدارة عيادة ومواعيد وفواتير',
    slug: 'clinic-flow-manager-clinic-management-dashboard',
    excerpt:
      'A detailed look at the ClinicFlow Manager demo, including appointments, patients, doctors, billing, reports, target users, and the React stack behind it.',
    excerptAr:
      'نظرة تفصيلية على ديمو ClinicFlow Manager، بما يشمل المواعيد والمرضى والأطباء والفواتير والتقارير والفئات المستهدفة والتقنيات المستخدمة.',
    category: 'Healthcare Dashboards',
    coverImage: '/demo-previews/clinic-flow-manager.png',
    tags: ['clinic management dashboard', 'healthcare admin dashboard', 'React', 'i18next', 'Recharts'],
    readTime: '7 min',
    featured: true,
    createdAt: { seconds: 1_777_492_800 },
    seo: {
      title: 'Clinic Management Dashboard Demo - ClinicFlow Manager Explained',
      titleAr: 'شرح ديمو لوحة إدارة عيادة ClinicFlow Manager',
      description:
        'See how the ClinicFlow Manager clinic management dashboard demo handles appointments, patients, doctors, billing, reporting, and bilingual UI.',
      descriptionAr:
        'تعرف على ديمو ClinicFlow Manager لإدارة العيادات، المواعيد، المرضى، الأطباء، الفواتير، التقارير، والواجهة الثنائية اللغة.',
      image: '/demo-previews/clinic-flow-manager.png',
    },
    content: `## What this demo is

ClinicFlow Manager is a clinic management dashboard demo for healthcare operations. It focuses on the practical daily work of appointments, patient records, doctors, billing, and reporting.

The demo is built to show how a clinic team can move through common tasks without relying on disconnected spreadsheets or static screens.

## Who it is useful for

This direction is useful for clinics, private medical centers, healthcare startups, operations managers, and teams planning a custom healthcare admin dashboard.

It is not a medical-record system by itself. It is a product demonstration of how a clear clinic workflow can be structured in a React dashboard.

## How it works

The dashboard organizes clinic work into major areas: appointments, patients, doctors, billing, and reports. Each area gives the team a focused way to see current work, update records, and understand operational status.

The demo also supports bilingual interface patterns, which matters for teams working in Arabic and English.

## Business value

The value is operational clarity. A clinic dashboard should help the team answer simple questions quickly: who is booked, which patients need follow-up, what billing activity exists, and where the team needs attention.

For a client, the demo shows how a healthcare workflow can be translated into a clean, maintainable interface.

## Technologies used

- React
- TypeScript
- Tailwind CSS
- Zustand
- Recharts
- Vite
- i18next

## Search intent covered

This article supports searches around clinic management dashboard, healthcare admin dashboard, clinic operations dashboard, appointment dashboard, and React healthcare dashboard.

## When to build something like this

Build this kind of dashboard when clinic operations are becoming hard to track manually, or when the team needs a custom workflow that generic booking tools do not handle well.

If your clinic needs a custom dashboard, open the ClinicFlow Manager demo and send the workflow you want to simplify.`,
    contentAr: `## ما هو هذا الديمو؟

ClinicFlow Manager هو ديمو لوحة إدارة عيادة يركز على التشغيل اليومي: المواعيد، المرضى، الأطباء، الفواتير، والتقارير.

الديمو يوضح كيف يمكن لفريق العيادة إدارة العمل بدون الاعتماد على ملفات منفصلة أو شاشات ثابتة.

## لمن يفيد؟

يناسب العيادات، المراكز الطبية الخاصة، الشركات الناشئة في المجال الصحي، ومديري التشغيل الذين يحتاجون لوحة إدارة عيادة مخصصة.

هو ليس نظام سجلات طبية كامل، لكنه نموذج عملي لطريقة تنظيم سير العمل داخل لوحة React.

## كيف يعمل؟

تقسم اللوحة العمل إلى أقسام واضحة: المواعيد، المرضى، الأطباء، الفواتير، والتقارير. كل قسم يساعد الفريق على رؤية الحالة الحالية وتحديث البيانات وفهم مؤشرات التشغيل.

الديمو يدعم أيضًا نمط واجهة عربي وإنجليزي، وهذا مهم للفرق التي تعمل بلغتين.

## الفائدة العملية

الفائدة الأساسية هي وضوح التشغيل. لوحة إدارة العيادة يجب أن تساعد الفريق على معرفة المواعيد، المرضى الذين يحتاجون متابعة، نشاط الفواتير، والمناطق التي تحتاج انتباه.

## التقنيات المستخدمة

- React
- TypeScript
- Tailwind CSS
- Zustand
- Recharts
- Vite
- i18next

## الكلمات المفتاحية المستهدفة

لوحة إدارة عيادة، clinic management dashboard، healthcare admin dashboard، إدارة مواعيد المرضى، React healthcare dashboard.

إذا كنت تحتاج لوحة إدارة عيادة مخصصة، افتح ديمو ClinicFlow Manager ثم أرسل سير العمل الذي تريد تبسيطه.`,
  },
  {
    id: 'blog-agency-flow-crm-demo',
    title: 'AgencyFlow CRM: React CRM Dashboard for Leads, Deals, Clients, and Tasks',
    titleAr: 'شرح AgencyFlow CRM: لوحة CRM للوكالات والعملاء والصفقات والمهام',
    slug: 'agency-flow-crm-react-crm-dashboard',
    excerpt:
      'A full explanation of the AgencyFlow CRM demo, the agency workflows it covers, the business value, target users, and the dashboard technologies used.',
    excerptAr:
      'شرح كامل لديمو AgencyFlow CRM، تدفقات العمل التي يخدمها، قيمته العملية، الفئات المناسبة له، والتقنيات المستخدمة في بنائه.',
    category: 'CRM Dashboards',
    coverImage: '/demo-previews/agency-flow-crm.png',
    tags: ['React CRM dashboard', 'agency CRM dashboard', 'internal tools', 'Zustand', 'Recharts'],
    readTime: '8 min',
    featured: true,
    createdAt: { seconds: 1_777_579_200 },
    seo: {
      title: 'React CRM Dashboard Demo - AgencyFlow CRM Explained',
      titleAr: 'شرح ديمو React CRM Dashboard للوكالات AgencyFlow CRM',
      description:
        'Learn how the AgencyFlow CRM React dashboard demo manages leads, deals, clients, tasks, reports, and isolated visitor sessions.',
      descriptionAr:
        'تعرف على ديمو AgencyFlow CRM المبني بـ React لإدارة العملاء المحتملين والصفقات والعملاء والمهام والتقارير.',
      image: '/demo-previews/agency-flow-crm.png',
    },
    content: `## What this demo is

AgencyFlow CRM is a React CRM dashboard demo for small agencies and service teams. It covers the core workflow between leads, deals, clients, tasks, and reporting.

The demo is designed to show how a CRM can feel practical without becoming bloated or difficult to use.

## Who it is useful for

This kind of CRM dashboard is useful for agencies, consultants, small sales teams, account managers, and service businesses that need a clear pipeline.

It is strongest when the team wants a focused internal tool rather than a large generic CRM with too many unused features.

## How it works

The workflow starts with leads, moves into deals, connects work to clients, and supports follow-up through tasks and reports. The dashboard gives the team one place to understand pipeline state and day-to-day next actions.

Because the demo data is isolated per visitor session, visitors can safely test creation, editing, and workflow movement.

## Business value

The business value is pipeline visibility. Small agencies often lose time because leads, client context, and tasks are spread across messages, sheets, and notes.

A custom CRM dashboard can bring those pieces into one operational workspace and make follow-up easier.

## Technologies used

- React
- TypeScript
- Tailwind CSS
- Zustand
- Recharts
- Vite

## Search intent covered

This article supports searches around React CRM dashboard, agency CRM dashboard, CRM dashboard for agencies, custom CRM dashboard, and internal tools developer.

## When to build something like this

Build this direction when the team has a clear sales or client pipeline but generic CRM tools are either too complex or do not match the workflow.

If your agency needs a focused CRM dashboard, open the AgencyFlow CRM demo and share the pipeline you want to manage.`,
    contentAr: `## ما هو هذا الديمو؟

AgencyFlow CRM هو ديمو لوحة CRM مبنية بـ React للوكالات والفرق الخدمية الصغيرة. يغطي العمل بين العملاء المحتملين والصفقات والعملاء والمهام والتقارير.

الهدف هو توضيح كيف يمكن أن تكون لوحة CRM عملية وواضحة بدون تضخم أو تعقيد زائد.

## لمن يفيد؟

يناسب الوكالات، المستشارين، فرق المبيعات الصغيرة، مديري الحسابات، والشركات الخدمية التي تحتاج رؤية واضحة لمسار العملاء.

يفيد خصوصًا عندما تحتاج الشركة إلى أداة داخلية مركزة بدل نظام CRM عام مليء بخصائص غير مستخدمة.

## كيف يعمل؟

يبدأ سير العمل من العملاء المحتملين، ثم الصفقات، ثم ربط العمل بالعملاء، ثم متابعة المهام والتقارير. اللوحة تعطي الفريق مكانًا واحدًا لفهم حالة المسار والخطوات التالية.

بيانات الديمو معزولة لكل زائر، لذلك يمكن تجربة الإضافة والتعديل وتحريك الحالات بأمان.

## الفائدة العملية

القيمة الأساسية هي وضوح خط المبيعات. كثير من الوكالات تضيع وقتًا لأن بيانات العملاء والمهام موزعة بين الرسائل والجداول والملاحظات.

لوحة CRM مخصصة تجمع هذه الأجزاء في مساحة تشغيل واحدة.

## التقنيات المستخدمة

- React
- TypeScript
- Tailwind CSS
- Zustand
- Recharts
- Vite

## الكلمات المفتاحية المستهدفة

React CRM dashboard، agency CRM dashboard، نظام CRM للشركات الصغيرة، لوحة CRM للوكالات، أدوات داخلية للشركات.

إذا كانت وكالتك تحتاج لوحة CRM مركزة، افتح ديمو AgencyFlow CRM ثم أرسل مسار العمل الذي تريد إدارته.`,
  },
  {
    id: 'blog-storeops-inventory-demo',
    title: 'StoreOps Inventory: Inventory Dashboard React Demo for Products, Stock, and Orders',
    titleAr: 'شرح StoreOps Inventory: لوحة مخزون React للمنتجات والموردين والطلبات',
    slug: 'storeops-inventory-dashboard-react-demo',
    excerpt:
      'A breakdown of the StoreOps Inventory demo, including stock movements, suppliers, sales orders, reporting, target users, and the React dashboard stack.',
    excerptAr:
      'شرح ديمو StoreOps Inventory بما يشمل حركة المخزون والموردين وطلبات البيع والتقارير والفئات المناسبة والتقنيات المستخدمة.',
    category: 'Inventory Dashboards',
    coverImage: '/demo-previews/StoreOps-Inventory.png',
    tags: ['inventory dashboard React', 'inventory management dashboard', 'retail dashboard', 'i18next'],
    readTime: '7 min',
    featured: false,
    createdAt: { seconds: 1_777_665_600 },
    seo: {
      title: 'Inventory Dashboard React Demo - StoreOps Inventory Explained',
      titleAr: 'شرح ديمو Inventory Dashboard React لإدارة المخزون',
      description:
        'See how the StoreOps Inventory React dashboard demo handles products, suppliers, stock movements, sales orders, reports, and bilingual UI.',
      descriptionAr:
        'تعرف على ديمو StoreOps Inventory لإدارة المنتجات والموردين وحركة المخزون وطلبات البيع والتقارير بواجهة React.',
      image: '/demo-previews/StoreOps-Inventory.png',
    },
    content: `## What this demo is

StoreOps Inventory is an inventory dashboard React demo for retail operations. It focuses on products, suppliers, stock movements, sales orders, and reporting.

The demo shows how a stock management workflow can be structured in a clear internal dashboard rather than scattered across sheets and manual notes.

## Who it is useful for

This kind of dashboard is useful for small stores, retail teams, warehouse operators, suppliers, and founders building inventory-heavy products.

It is especially useful when the team needs stock visibility and repeatable operational flows.

## How it works

The dashboard groups inventory work into products, suppliers, stock activity, orders, and reports. It lets the user understand what exists, what is moving, and what needs attention.

The demo includes bilingual UI patterns and editable session data, so visitors can test the flow without changing the original demo state.

## Business value

Inventory work becomes risky when stock numbers, supplier details, and orders live in disconnected tools. A dedicated inventory management dashboard reduces confusion and makes decisions easier.

For a client, this demo proves that operational dashboards can be clear, focused, and built around daily use.

## Technologies used

- React
- TypeScript
- Tailwind CSS
- Zustand
- Recharts
- Vite
- i18next

## Search intent covered

This article supports searches around inventory dashboard React, inventory management dashboard, stock management dashboard, retail inventory dashboard, and React internal tools.

## When to build something like this

Build this direction when stock movement, suppliers, sales orders, and reporting are central to the business.

If your team needs better inventory visibility, open the StoreOps Inventory demo and send the workflow you want to organize.`,
    contentAr: `## ما هو هذا الديمو؟

StoreOps Inventory هو ديمو لوحة مخزون مبنية بـ React للمتاجر وفرق التشغيل. يركز على المنتجات والموردين وحركة المخزون وطلبات البيع والتقارير.

يوضح الديمو كيف يمكن تنظيم إدارة المخزون داخل لوحة داخلية واضحة بدل الاعتماد على جداول وملاحظات منفصلة.

## لمن يفيد؟

يناسب المتاجر الصغيرة، فرق التجزئة، مسؤولي المخازن، الموردين، ومؤسسي المنتجات التي تعتمد على المخزون.

يفيد خصوصًا عندما يحتاج الفريق إلى رؤية واضحة للمخزون وتدفقات تشغيل متكررة.

## كيف يعمل؟

تقسم اللوحة العمل إلى المنتجات، الموردين، حركة المخزون، الطلبات، والتقارير. تساعد المستخدم على معرفة الموجود، وما يتحرك، وما يحتاج متابعة.

الديمو يدعم واجهة عربية وإنجليزية وبيانات قابلة للتعديل داخل جلسة الزائر.

## الفائدة العملية

إدارة المخزون تصبح صعبة عندما تكون الأرقام وبيانات الموردين والطلبات موزعة بين أدوات مختلفة. لوحة إدارة مخزون مخصصة تقلل الارتباك وتساعد على اتخاذ القرار.

## التقنيات المستخدمة

- React
- TypeScript
- Tailwind CSS
- Zustand
- Recharts
- Vite
- i18next

## الكلمات المفتاحية المستهدفة

inventory dashboard React، inventory management dashboard، نظام إدارة مخزون React، لوحة إدارة مخزون، stock management dashboard.

إذا كان فريقك يحتاج رؤية أفضل للمخزون، افتح ديمو StoreOps Inventory ثم أرسل سير العمل الذي تريد تنظيمه.`,
  },
  {
    id: 'blog-hireflow-ats-demo',
    title: 'HireFlow ATS: Applicant Tracking System Dashboard Built with React',
    titleAr: 'شرح HireFlow ATS: نظام تتبع متقدمين ولوحة توظيف مبنية بـ React',
    slug: 'hireflow-ats-applicant-tracking-dashboard',
    excerpt:
      'A practical explanation of the HireFlow ATS demo, including jobs, candidates, pipeline stages, interviews, evaluations, reports, target users, and technologies.',
    excerptAr:
      'شرح عملي لديمو HireFlow ATS بما يشمل الوظائف والمرشحين ومراحل التوظيف والمقابلات والتقييمات والتقارير والفئات المستهدفة.',
    category: 'Recruiting Dashboards',
    coverImage: '/demo-previews/hireflow-ats.png',
    tags: ['applicant tracking system dashboard', 'ATS dashboard React', 'recruiting dashboard', 'DnD Kit'],
    readTime: '8 min',
    featured: false,
    createdAt: { seconds: 1_777_752_000 },
    seo: {
      title: 'Applicant Tracking System Dashboard Demo - HireFlow ATS Explained',
      titleAr: 'شرح ديمو Applicant Tracking System Dashboard - HireFlow ATS',
      description:
        'Learn how the HireFlow ATS React dashboard demo handles jobs, candidates, draggable pipeline stages, interviews, evaluations, and reports.',
      descriptionAr:
        'تعرف على ديمو HireFlow ATS لإدارة الوظائف والمرشحين ومراحل التوظيف القابلة للسحب والمقابلات والتقييمات والتقارير.',
      image: '/demo-previews/hireflow-ats.png',
    },
    content: `## What this demo is

HireFlow ATS is an applicant tracking system dashboard built with React. It focuses on jobs, candidates, hiring pipeline stages, interviews, evaluations, and reporting.

The demo shows how recruiting work can be organized into a clear dashboard with pipeline movement and practical status tracking.

## Who it is useful for

This direction is useful for recruiters, HR teams, startup founders, hiring managers, and agencies that manage candidates across several open roles.

It is especially useful when the team needs more structure than a spreadsheet but does not want a heavy enterprise ATS.

## How it works

The dashboard organizes hiring into jobs, candidates, pipeline stages, interviews, evaluations, and reports. Candidate movement can be represented through draggable stages, which makes the recruiting process easier to scan.

The demo also includes bilingual settings and visitor-isolated data so it can be tested safely.

## Business value

Hiring workflows become messy when candidate status, interview notes, job openings, and reports live in separate tools.

An applicant tracking dashboard helps a team see where candidates are, what needs follow-up, and how the hiring pipeline is performing.

## Technologies used

- React
- TypeScript
- Tailwind CSS
- Zustand
- DnD Kit
- Recharts
- Vite
- i18next

## Search intent covered

This article supports searches around applicant tracking system dashboard, ATS dashboard React, recruiting dashboard, hiring pipeline dashboard, and candidate management dashboard.

## When to build something like this

Build this direction when hiring is active enough that spreadsheets and message threads no longer provide a reliable view of the pipeline.

If your team needs a practical recruiting dashboard, open the HireFlow ATS demo and share the hiring workflow you want to manage.`,
    contentAr: `## ما هو هذا الديمو؟

HireFlow ATS هو ديمو نظام تتبع متقدمين مبني بـ React. يركز على الوظائف والمرشحين ومراحل التوظيف والمقابلات والتقييمات والتقارير.

يوضح الديمو كيف يمكن تنظيم عملية التوظيف داخل لوحة واضحة فيها مراحل قابلة للحركة ومتابعة عملية للحالات.

## لمن يفيد؟

يناسب مسؤولي التوظيف، فرق الموارد البشرية، مؤسسي الشركات الناشئة، مديري التوظيف، والوكالات التي تدير مرشحين لعدة وظائف.

يفيد خصوصًا عندما يحتاج الفريق إلى تنظيم أكثر من الجداول، بدون نظام ATS ضخم ومعقد.

## كيف يعمل؟

تقسم اللوحة عملية التوظيف إلى الوظائف، المرشحين، مراحل التوظيف، المقابلات، التقييمات، والتقارير. يمكن تمثيل حركة المرشح عبر مراحل قابلة للسحب، مما يجعل المسار أسهل في القراءة.

يدعم الديمو إعدادات ثنائية اللغة وبيانات معزولة لكل زائر.

## الفائدة العملية

عملية التوظيف تصبح مربكة عندما تتوزع حالات المرشحين وملاحظات المقابلات والوظائف والتقارير بين أدوات كثيرة.

لوحة ATS تساعد الفريق على رؤية مكان كل مرشح، وما يحتاج متابعة، وأداء مسار التوظيف.

## التقنيات المستخدمة

- React
- TypeScript
- Tailwind CSS
- Zustand
- DnD Kit
- Recharts
- Vite
- i18next

## الكلمات المفتاحية المستهدفة

applicant tracking system dashboard، ATS dashboard React، نظام تتبع المتقدمين ATS، recruiting dashboard، candidate management dashboard.

إذا كان فريقك يحتاج لوحة توظيف عملية، افتح ديمو HireFlow ATS ثم أرسل سير العمل الذي تريد إدارته.`,
  },
];

function getBlogKey(post: BlogRecord) {
  return post.slug || post.id;
}

function getCreatedAtSeconds(post: BlogRecord) {
  return typeof post.createdAt?.seconds === 'number' ? post.createdAt.seconds : 0;
}

export function mergePublicBlogPosts(posts: BlogRecord[]) {
  const seen = new Set<string>();
  const mergedPosts: BlogRecord[] = [];

  [...posts, ...DEMO_BLOG_POSTS].forEach((post) => {
    const key = getBlogKey(post);

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    mergedPosts.push(post);
  });

  return mergedPosts.sort((left, right) => getCreatedAtSeconds(right) - getCreatedAtSeconds(left));
}
