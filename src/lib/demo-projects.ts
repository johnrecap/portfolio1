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

export function mergeDemoProjects<T extends ProjectRecord>(projects: T[]) {
  const hasAgencyFlow = projects.some(
    (project) => project.slug === AGENCY_FLOW_CRM_PROJECT.slug || project.id === AGENCY_FLOW_CRM_PROJECT.id,
  );

  return hasAgencyFlow ? projects : ([AGENCY_FLOW_CRM_PROJECT, ...projects] as Array<T | ProjectRecord>);
}

