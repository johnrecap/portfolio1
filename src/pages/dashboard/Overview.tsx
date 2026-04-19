import { motion } from 'motion/react';
import { 
  Briefcase, 
  Eye, 
  GitCommit, 
  Mail, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  GitBranch, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from 'react-i18next';

export const DashboardOverview = () => {
  const { profile } = useProfile();
  const { t, i18n } = useTranslation();
  const kpis = [
    {
      title: t('dashboardOverview.totalProjects'),
      value: '42',
      trend: '+12%',
      trendUp: true,
      icon: Briefcase,
      subtitle: t('dashboardOverview.activeInProd')
    },
    {
      title: t('dashboardOverview.siteVisits'),
      value: '18.4K',
      trend: '+24%',
      trendUp: true,
      icon: Eye,
      subtitle: t('dashboardOverview.uniqueVisitors')
    },
    {
      title: t('dashboardOverview.githubCommits'),
      value: '342',
      trend: '-5%',
      trendUp: false,
      icon: GitCommit,
      subtitle: t('dashboardOverview.thisMonth')
    },
    {
      title: t('dashboardOverview.unreadMessages'),
      value: '8',
      trend: '0%',
      trendUp: null, // neutral
      icon: Mail,
      subtitle: t('dashboardOverview.awaitingResponse')
    }
  ];

  return (
    <div className="w-full flex-1 flex flex-col pt-10 px-6">
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-heading font-bold text-foreground tracking-tight mb-2">{t('dashboardOverview.overview')}</h2>
          <p className="text-muted-foreground font-body">{t('dashboardOverview.welcomeBack')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 font-semibold">
            <Mail className="w-4 h-4" />
            {t('dashboardOverview.viewMessages')}
          </Button>
          <Button className="flex items-center gap-2 font-semibold shadow-sm">
            <span className="text-lg leading-none">+</span>
            {t('dashboardOverview.addProject')}
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card p-6 rounded-[1rem] shadow-sm hover:shadow-lg border border-border relative overflow-hidden group transition-all hover:-translate-y-1"
          >
            <div className={`absolute top-0 ${i18n.language === 'ar' ? 'left-0' : 'right-0'} p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
              <kpi.icon className="w-16 h-16 text-primary" />
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <p className="text-sm font-label font-medium text-muted-foreground">{kpi.title}</p>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                kpi.trendUp === true ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400' :
                kpi.trendUp === false ? 'bg-destructive/20 text-destructive' :
                'bg-muted text-muted-foreground'
              }`}>
                {kpi.trendUp === true && <TrendingUp className="w-3 h-3" />}
                {kpi.trendUp === false && <TrendingDown className="w-3 h-3" />}
                {kpi.trendUp === null && <Minus className="w-3 h-3" />}
                {kpi.trend}
              </span>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-heading font-bold text-foreground">{kpi.value}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-body">{kpi.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Main Chart (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-card rounded-xl p-8 shadow-sm border border-border flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-heading font-bold text-foreground">{t('dashboardOverview.trafficOverview')}</h3>
            <select className="bg-muted border-none text-sm font-label text-muted-foreground rounded focus:ring-primary outline-none py-1.5 px-3">
              <option>{t('dashboardOverview.last7Months')}</option>
              <option>{t('dashboardOverview.lastYear')}</option>
            </select>
          </div>
          
          {/* Simplified Chart Representation matching prompt exact visual blocks */}
          <div className="flex-1 relative flex items-end justify-between gap-2 px-4 pb-8">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`border-t w-full h-0 ${i === 4 ? 'border-border/60' : 'border-border/30'}`}></div>
              ))}
            </div>
            
            {/* Bars */}
            <div className="w-full flex justify-between items-end h-full z-10 px-2 gap-4">
              {[30, 45, 35, 60, 85, 50, 70].map((h, i) => (
                <div key={i} className={`w-[10%] rounded-t-sm h-[${h}%] relative group cursor-pointer transition-colors ${i === 4 ? 'bg-primary shadow-[0_0_15px_rgba(53,37,205,0.3)]' : 'bg-muted hover:bg-primary/60'}`} style={{ height: `${h}%` }}>
                  <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded pointer-events-none transition-opacity ${i === 4 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {[1.2, 2.4, 1.8, 3.6, 5.2, 2.8, 4.1][i]}K
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* X-Axis Labels */}
          <div className="flex justify-between px-6 text-xs font-label text-muted-foreground mt-2" style={{flexDirection: i18n.language === 'ar' ? 'row-reverse' : 'row'}}>
            <span>{t('dashboardOverview.months.jan')}</span><span>{t('dashboardOverview.months.feb')}</span><span>{t('dashboardOverview.months.mar')}</span><span>{t('dashboardOverview.months.apr')}</span>
            <span className="text-primary font-bold">{t('dashboardOverview.months.may')}</span>
            <span>{t('dashboardOverview.months.jun')}</span><span>{t('dashboardOverview.months.jul')}</span>
          </div>
        </div>

        {/* Donut Chart & Tech Stack */}
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border flex flex-col h-[400px]">
          <h3 className="text-xl font-heading font-bold text-foreground mb-6">{t('dashboardOverview.techStackUsage')}</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            
            <div className="relative w-40 h-40 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#3525cd 0% 45%, #14b8a6 45% 75%, #c3c0ff 75% 90%, #e2e7ff 90% 100%)' }}>
              <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center flex-col shadow-inner">
                <span className="text-2xl font-heading font-bold text-foreground">4</span>
                <span className="text-[10px] font-label text-muted-foreground uppercase tracking-wider">{t('dashboardOverview.langs')}</span>
              </div>
            </div>
            
            <div className="w-full mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary shrink-0"></div>
                  <span className="text-sm font-label text-muted-foreground truncate">TypeScript / JS</span>
                </div>
                <span className="text-sm font-semibold text-foreground shrink-0">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-500 shrink-0"></div>
                  <span className="text-sm font-label text-muted-foreground truncate">Python</span>
                </div>
                <span className="text-sm font-semibold text-foreground shrink-0">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/40 shrink-0"></div>
                  <span className="text-sm font-label text-muted-foreground truncate">HTML/CSS</span>
                </div>
                <span className="text-sm font-semibold text-foreground shrink-0">15%</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        
        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-8 border border-border">
          <h3 className="text-xl font-heading font-bold text-foreground mb-6">{t('dashboardOverview.recentActivity')}</h3>
          <div className={`relative ${i18n.language === 'ar' ? 'border-r mr-3 space-y-8 pr-4' : 'border-l ml-3 space-y-8 pl-4'} pb-4 border-border`}>
            
            <div className={`relative ${i18n.language === 'ar' ? 'pr-6' : 'pl-6'}`}>
              <div className={`absolute ${i18n.language === 'ar' ? '-right-[27px]' : '-left-[27px]'} top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-[3px] border-card`}></div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-label font-semibold text-foreground">Project "Neo" Deployed</h4>
                <span className="text-xs text-muted-foreground font-label">2 hrs ago</span>
              </div>
              <p className="text-sm text-muted-foreground font-body">Successfully deployed to production server via Vercel.</p>
            </div>
            
            <div className={`relative ${i18n.language === 'ar' ? 'pr-6' : 'pl-6'}`}>
              <div className={`absolute ${i18n.language === 'ar' ? '-right-[27px]' : '-left-[27px]'} top-1.5 w-3.5 h-3.5 rounded-full bg-muted-foreground border-[3px] border-card`}></div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-label font-semibold text-foreground">New Message Received</h4>
                <span className="text-xs text-muted-foreground font-label">5 hrs ago</span>
              </div>
              <p className="text-sm text-muted-foreground font-body">Client inquiry regarding freelance contract details.</p>
            </div>
            
            <div className={`relative ${i18n.language === 'ar' ? 'pr-6' : 'pl-6'}`}>
              <div className={`absolute ${i18n.language === 'ar' ? '-right-[27px]' : '-left-[27px]'} top-1.5 w-3.5 h-3.5 rounded-full bg-muted-foreground border-[3px] border-card`}></div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-label font-semibold text-foreground">Database Backup</h4>
                <span className="text-xs text-muted-foreground font-label">1 day ago</span>
              </div>
              <p className="text-sm text-muted-foreground font-body">Automated backup completed successfully.</p>
            </div>
            
          </div>
          <Button variant="ghost" className="w-full mt-6 text-primary hover:text-primary/80">
            {t('dashboardOverview.viewAllActivity')}
          </Button>
        </div>

        {/* GitHub Sync */}
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-white overflow-hidden relative group">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <GitBranch className="w-8 h-8 text-white shrink-0" />
                <h3 className="text-xl font-heading font-bold text-white leading-tight">{t('dashboardOverview.githubSyncStatus')}</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-semibold border border-teal-500/30 shrink-0">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div> {t('dashboardOverview.live')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                <p className="text-xs text-slate-400 font-label mb-1 truncate">{t('dashboardOverview.latestCommit')}</p>
                <p className="text-sm font-medium text-white font-mono truncate" dir="ltr">#a8f93c2</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                <p className="text-xs text-slate-400 font-label mb-1 truncate">{t('dashboardOverview.branch')}</p>
                <p className="text-sm font-medium text-white flex items-center gap-2 truncate">
                  <GitBranch className="w-4 h-4 shrink-0" /> <span dir="ltr">main</span>
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-slate-700 bg-background object-cover shrink-0" 
                  src={profile.profileImage || undefined} 
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{profile.displayName}</p>
                  <p className="text-xs text-slate-400 truncate" dir="ltr">Pushed to portfolio/main</p>
                </div>
              </div>
              <p className={`text-sm text-slate-300 font-body ${i18n.language === 'ar' ? 'pr-11' : 'pl-11'}`}>"Refactor dashboard UI components for better responsive rendering and updated token mapping."</p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <a href="#" className="text-sm font-label font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group/link">
                {t('dashboardOverview.openInGithub')} <ExternalLink className={`w-4 h-4 ${i18n.language === 'ar' ? '-scale-x-100 group-hover/link:-translate-x-0.5 group-hover/link:-translate-y-0.5' : 'group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5'} transition-transform`} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
