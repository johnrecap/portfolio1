import type { ProjectRecord } from './content-hub';

export const AGENCY_FLOW_CRM_PROJECT: ProjectRecord = {
  id: 'agency-flow-crm-demo',
  title: 'AgencyFlow CRM',
  titleAr: 'AgencyFlow CRM',
  slug: 'agency-flow-crm',
  description:
    'A working CRM dashboard demo for small agencies with leads, deals, clients, tasks, reports, and isolated editable visitor sessions.',
  descriptionAr:
    'ديمو عملي للوحة CRM موجهة للوكالات الصغيرة، يتضمن العملاء المحتملين والصفقات والعملاء والمهام والتقارير مع جلسات تعديل منفصلة لكل زائر.',
  category: 'React Dashboard',
  type: 'dashboard',
  color: 'bg-teal-500',
  tags: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Recharts', 'Vite'],
  image: '/demo-previews/agency-flow-crm.png',
  demoUrl: '/demos/agency-flow-crm/',
  githubUrl: '',
  featured: true,
  featuredOrder: 1,
  highlightLabel: 'Private editable demo session',
  highlightLabelAr: 'جلسة ديمو قابلة للتعديل بشكل خاص',
  problem:
    'Portfolio demos often show screenshots only, or let public visitors share the same mutable sample data.',
  problemAr:
    'كثير من الديموهات في البورتفوليو تكتفي بالصور فقط، أو تجعل كل الزوار يستخدمون نفس بيانات التجربة القابلة للتعديل.',
  solution:
    'The demo runs as a standalone React dashboard with session-scoped mock data, so each visitor can safely test workflows without affecting anyone else.',
  solutionAr:
    'الديمو يعمل كتطبيق React مستقل ببيانات وهمية مرتبطة بجلسة كل زائر، حتى يستطيع تجربة التدفقات بدون التأثير على أي شخص آخر.',
  projectRole: 'Frontend engineering, dashboard UX, state management, session isolation',
  projectRoleAr: 'هندسة الواجهة، تجربة لوحة التحكم، إدارة الحالة، وعزل الجلسات',
  result:
    'A live dashboard proof-of-work that can be opened from the portfolio and reset to clean demo data for every visitor.',
  resultAr:
    'دليل عملي مباشر داخل البورتفوليو يمكن فتحه وتجربته، مع رجوع البيانات الافتراضية لكل زائر جديد.',
  seo: {
    title: 'AgencyFlow CRM Demo',
    titleAr: 'ديمو AgencyFlow CRM',
    description:
      'A React CRM dashboard demo with isolated editable visitor sessions.',
    descriptionAr:
      'ديمو لوحة CRM مبنية بـ React مع جلسات تعديل منفصلة لكل زائر.',
  },
  createdAt: { seconds: 1_774_419_200 },
};

export const CLINIC_FLOW_MANAGER_PROJECT: ProjectRecord = {
  id: 'clinic-flow-manager-demo',
  title: 'ClinicFlow Manager',
  titleAr: 'ClinicFlow Manager',
  slug: 'clinic-flow-manager',
  description:
    'A working clinic operations dashboard demo with appointments, patients, doctors, billing, reports, and isolated editable visitor sessions.',
  descriptionAr:
    'ديمو عملي للوحة إدارة عيادة طبية تشمل المواعيد والمرضى والأطباء والفواتير والتقارير، مع جلسة تعديل منفصلة لكل زائر.',
  category: 'Healthcare Dashboard',
  type: 'dashboard',
  color: 'bg-cyan-500',
  tags: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Recharts', 'Vite', 'i18next'],
  image: '/demo-previews/clinic-flow-manager.png',
  demoUrl: '/demos/clinic-flow-manager/',
  githubUrl: '',
  featured: true,
  featuredOrder: 0,
  highlightLabel: 'Session-isolated clinic operations demo',
  highlightLabelAr: 'ديمو إدارة عيادة بجلسات معزولة لكل زائر',
  problem:
    'Clinic teams need a clear operational workspace for appointments, patient records, billing, and performance reporting without mixing visitor demo data.',
  problemAr:
    'فرق العيادات تحتاج مساحة تشغيل واضحة للمواعيد وملفات المرضى والفواتير والتقارير بدون خلط بيانات تجربة الزوار.',
  solution:
    'The demo provides a standalone React dashboard with editable session-scoped mock data, bilingual UI, RTL support, and practical clinic workflows.',
  solutionAr:
    'الديمو يقدم لوحة React مستقلة ببيانات وهمية قابلة للتعديل داخل جلسة الزائر، مع واجهة عربية وإنجليزية ودعم RTL وتدفقات عمل عملية للعيادة.',
  projectRole: 'Frontend engineering, healthcare dashboard UX, local state architecture, bilingual product UI',
  projectRoleAr: 'هندسة الواجهة، تجربة لوحة طبية، بناء الحالة المحلية، وواجهة منتج ثنائية اللغة',
  result:
    'A live proof-of-work for a healthcare operations panel that visitors can test safely and reset at any time.',
  resultAr:
    'دليل عملي مباشر للوحة تشغيل طبية يمكن للزائر تجربتها بأمان وإرجاع بياناتها الأصلية في أي وقت.',
  seo: {
    title: 'ClinicFlow Manager Demo',
    titleAr: 'ديمو ClinicFlow Manager',
    description:
      'A React clinic management dashboard demo with isolated editable visitor sessions.',
    descriptionAr:
      'ديمو لوحة إدارة عيادة مبنية بـ React مع جلسات تعديل منفصلة لكل زائر.',
  },
  createdAt: { seconds: 1_774_505_600 },
};

export const STOREOPS_INVENTORY_PROJECT: ProjectRecord = {
  id: 'storeops-inventory-demo',
  title: 'StoreOps Inventory',
  titleAr: 'StoreOps Inventory',
  slug: 'storeops-inventory',
  description:
    'A working inventory operations dashboard demo with products, suppliers, stock movements, sales orders, reports, and bilingual settings.',
  descriptionAr:
    'ديمو عملي للوحة تشغيل مخزون تشمل المنتجات والموردين وحركات المخزون وطلبات البيع والتقارير وإعدادات ثنائية اللغة.',
  category: 'Inventory Dashboard',
  type: 'dashboard',
  color: 'bg-emerald-500',
  tags: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Recharts', 'Vite', 'i18next'],
  image: '/demo-previews/StoreOps-Inventory.png',
  demoUrl: '/demos/storeops-inventory/',
  githubUrl: '',
  featured: true,
  featuredOrder: 2,
  highlightLabel: 'Editable inventory operations demo',
  highlightLabelAr: 'ديمو تشغيل مخزون قابل للتعديل',
  problem:
    'Inventory tools need clear stock visibility, simple adjustment flows, and operational reporting without turning the demo into static screenshots.',
  problemAr:
    'أدوات المخزون تحتاج رؤية واضحة للمخزون وتدفقات تعديل بسيطة وتقارير تشغيلية بدون تحويل الديمو إلى صور ثابتة فقط.',
  solution:
    'The demo provides a standalone React dashboard with mock inventory data, working CRUD flows, stock adjustment logic, reports, and Arabic/English localization.',
  solutionAr:
    'الديمو يقدم لوحة React مستقلة ببيانات مخزون وهمية وتدفقات CRUD فعالة ومنطق تعديل مخزون وتقارير ودعم عربي وإنجليزي.',
  projectRole: 'Frontend engineering, inventory dashboard UX, local state architecture, bilingual product UI',
  projectRoleAr: 'هندسة الواجهة، تجربة لوحة مخزون، بناء الحالة المحلية، وواجهة منتج ثنائية اللغة',
  result:
    'A live proof-of-work for retail inventory operations that visitors can open, edit, reset, and inspect from the portfolio.',
  resultAr:
    'دليل عملي مباشر لتشغيل مخزون المتاجر يمكن للزائر فتحه وتعديله وإرجاع بياناته وفحصه من البورتفوليو.',
  seo: {
    title: 'StoreOps Inventory Demo',
    titleAr: 'ديمو StoreOps Inventory',
    description:
      'A React inventory operations dashboard demo with products, suppliers, stock movements, sales orders, and reports.',
    descriptionAr:
      'ديمو لوحة تشغيل مخزون مبنية بـ React تشمل المنتجات والموردين وحركات المخزون وطلبات البيع والتقارير.',
  },
  createdAt: { seconds: 1_777_237_200 },
};

export const HIREFLOW_ATS_PROJECT: ProjectRecord = {
  id: 'hireflow-ats-demo',
  title: 'HireFlow ATS',
  titleAr: 'HireFlow ATS',
  slug: 'hireflow-ats',
  description:
    'A working applicant tracking dashboard demo with jobs, candidates, hiring pipeline stages, interviews, evaluations, reports, and bilingual settings.',
  descriptionAr:
    'ديمو عملي للوحة تتبع المتقدمين تشمل الوظائف والمرشحين ومراحل التوظيف والمقابلات والتقييمات والتقارير وإعدادات ثنائية اللغة.',
  category: 'Recruiting Dashboard',
  type: 'dashboard',
  color: 'bg-indigo-500',
  tags: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'DnD Kit', 'Recharts', 'Vite', 'i18next'],
  image: '/demo-previews/hireflow-ats.png',
  demoUrl: '/demos/hireflow-ats/',
  githubUrl: '',
  featured: true,
  featuredOrder: 3,
  highlightLabel: 'Applicant tracking workflow demo',
  highlightLabelAr: 'ديمو سير عمل لتتبع المتقدمين',
  problem:
    'Recruiting teams need a compact workspace for requisitions, candidates, pipeline movement, interviews, and reporting without relying on static portfolio screenshots.',
  problemAr:
    'فرق التوظيف تحتاج مساحة عمل واضحة للوظائف والمرشحين وتحريك مراحل التوظيف والمقابلات والتقارير بدون الاعتماد على صور ثابتة في البورتفوليو.',
  solution:
    'The demo ships a standalone React ATS with draggable pipeline stages, candidate and job management, recruitment analytics, theme controls, and Arabic/English localization.',
  solutionAr:
    'الديمو يقدم نظام ATS مستقل مبني بـ React مع مراحل توظيف قابلة للسحب وإدارة المرشحين والوظائف وتحليلات التوظيف والتحكم في الثيم ودعم عربي وإنجليزي.',
  projectRole: 'Frontend engineering, recruiting dashboard UX, drag-and-drop workflow, bilingual product UI',
  projectRoleAr: 'هندسة الواجهة، تجربة لوحة توظيف، سير عمل بالسحب والإفلات، وواجهة منتج ثنائية اللغة',
  result:
    'A live recruiting operations proof-of-work that visitors can open from the portfolio and test across pipeline, candidate, job, and reporting views.',
  resultAr:
    'دليل عملي مباشر لتشغيل التوظيف يمكن للزائر فتحه من البورتفوليو وتجربته عبر مسارات المرشحين والوظائف والتقارير.',
  seo: {
    title: 'HireFlow ATS Demo',
    titleAr: 'ديمو HireFlow ATS',
    description:
      'A React applicant tracking dashboard demo with jobs, candidates, draggable pipeline stages, interviews, evaluations, and reports.',
    descriptionAr:
      'ديمو لوحة تتبع متقدمين مبنية بـ React تشمل الوظائف والمرشحين ومراحل توظيف قابلة للسحب والمقابلات والتقييمات والتقارير.',
  },
  createdAt: { seconds: 1_777_276_800 },
};

export const DEMO_PROJECTS: ProjectRecord[] = [
  CLINIC_FLOW_MANAGER_PROJECT,
  AGENCY_FLOW_CRM_PROJECT,
  STOREOPS_INVENTORY_PROJECT,
  HIREFLOW_ATS_PROJECT,
];

export function getDemoProjectBySlug(slug: string | undefined) {
  return DEMO_PROJECTS.find((project) => project.slug === slug);
}
