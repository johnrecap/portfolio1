import { motion } from "motion/react";
import { Terminal, Download, Mail, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/hooks/useProfile";

export const CTASection = () => {
  const { t } = useTranslation();
  const { profile } = useProfile();

  const handleDownloadCV = () => {
    // In a real scenario, link to an actual PDF
    window.open('/', '_blank');
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 font-mono text-sm md:text-base relative w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        dir="ltr"
      >
        <div className="bg-[#1e1e1e] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-[#2d2d2d] border-b border-slate-800 px-4 py-3 flex items-center gap-2 select-none">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="mx-auto flex items-center gap-2 text-slate-400 text-xs">
              <Terminal className="w-4 h-4" /> root@portfolio:~
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 text-slate-300 mb-4 whitespace-nowrap">
              <span className="text-green-500">visitor@web</span>
              <span className="text-slate-500">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-slate-500">$</span>
              <span className="font-semibold text-slate-100">contact --status</span>
            </div>
            
            <div className="mb-8 ml-0 md:ml-4 border-l-2 border-slate-800 pl-4 py-2 space-y-2">
               <div className="text-teal-400 font-bold mb-2">
                 {t("ctaSection.systemOnline")}
               </div>
               <div className="text-slate-400 max-w-2xl">
                 {t("cta.description", { defaultValue: "Let's build something extraordinary together. My inbox is always open whether you have a question or just want to say hi." })}
               </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300 mb-6 whitespace-nowrap">
              <span className="text-green-500">visitor@web</span>
              <span className="text-slate-500">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-slate-500">$</span>
              <span className="font-semibold text-slate-100">ls -la /connect</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
               <a 
                  href={`mailto:hello@example.com`}
                  className="flex flex-col items-center justify-center gap-3 bg-slate-900 border border-slate-700 hover:border-teal-500/50 hover:bg-teal-500/10 text-slate-300 font-medium p-6 rounded-lg transition-all group"
               >
                 <Mail className="w-8 h-8 text-slate-400 group-hover:text-teal-400 transition-colors" />
                 <span>{t("ctaSection.emailMe")}</span>
               </a>
               
               <a 
                  href={`https://wa.me/201012345678`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-3 bg-slate-900 border border-slate-700 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 text-slate-300 font-medium p-6 rounded-lg transition-all group"
               >
                 <MessageCircle className="w-8 h-8 text-slate-400 group-hover:text-[#25D366] transition-colors" />
                 <span>{t("ctaSection.whatsapp")}</span>
               </a>

               <button 
                  onClick={handleDownloadCV}
                  className="flex flex-col items-center justify-center gap-3 bg-slate-900 border border-slate-700 hover:border-primary/50 hover:bg-primary/10 text-slate-300 font-medium p-6 rounded-lg transition-all group"
               >
                 <Download className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                 <span>{t("ctaSection.resumePdf")}</span>
               </button>
            </div>

            <div className="flex items-center gap-2 text-slate-300 mt-8">
              <span className="text-green-500">visitor@web</span>
              <span className="text-slate-500">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-slate-500">$</span>
              <span className="animate-pulse w-2.5 h-4 bg-slate-400 block"></span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
