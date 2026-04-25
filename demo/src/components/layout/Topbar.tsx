import { Bell, Search, Menu } from "lucide-react";
import { useCRMStore } from "../../store/crmStore";
import { getInitials } from "../../utils/formatters";
import { useTranslation } from "react-i18next";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const currentUser = useCRMStore((s) => s.currentUser);
  const { t } = useTranslation();

  return (
    <header className="flex justify-between items-center px-6 w-full h-[72px] border-b border-[#E2E8F0] bg-white z-10 shrink-0 sticky top-0">
      {/* Mobile Title / Logo */}
      <div className="flex items-center md:hidden gap-4">
        <Menu className="w-5 h-5 text-slate-900 cursor-pointer" />
        <span className="text-xl font-bold text-slate-900">{t('topbar.logo')}</span>
      </div>

      {/* Desktop Title */}
      <div className="hidden md:flex flex-1">
        <h1 className="font-page-title text-page-title text-primary capitalize">{title}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
          <input
            type="text"
            className="ltr:pl-9 rtl:pr-9 ltr:pr-4 rtl:pl-4 py-2 bg-slate-50 border-none rounded-lg text-[14px] focus:ring-2 focus:ring-primary/20 focus:outline-none w-64 transition-all"
            placeholder={t('topbar.search')}
          />
        </div>
        
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors cursor-pointer relative">
          <Bell className="w-[20px] h-[20px]" />
          <span className="absolute top-2 ltr:right-2 rtl:left-2 w-2 h-2 bg-error rounded-full" />
        </button>
        
        <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs cursor-pointer ltr:ml-2 rtl:mr-2">
          {currentUser ? getInitials(currentUser.name) : "U"}
        </div>
      </div>
    </header>
  );
}
