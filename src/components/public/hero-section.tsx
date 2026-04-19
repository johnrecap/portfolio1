import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useTranslation } from "react-i18next";
import { Terminal, ArrowRight, Copy, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Typewriter = ({
  text,
  delay = 0.05,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) => {
  const chars = Array.from(text);

  return (
    <span className={className} key={text}>
      {chars.map((char, index) => (
        <motion.span
          key={`${index}-${char}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: index * delay }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block translate-y-[4px] mx-1 w-[4px] h-[0.9em] bg-primary"
      />
    </span>
  );
};

export const HeroSection = () => {
  const { profile, loading } = useProfile();
  const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(
      `npm install @${profile.displayName.toLowerCase().replace(/\s+/g, "")}/core`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName =
    i18n.language === "ar"
      ? profile.displayNameAr || profile.displayName
      : profile.displayName;
  const title =
    i18n.language === "ar" ? profile.titleAr || profile.title : profile.title;
  const bio =
    i18n.language === "ar" ? profile.bioAr || profile.bio : profile.bio;

  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-24 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 px-4 sm:px-6">
        
        {/* Left/Right Text Content (Depends on RTL) */}
        <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-start z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary font-mono text-xs md:text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t("contact.availableForWork")}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[1.2] mb-4 text-foreground min-h-[4rem] sm:min-h-[5rem] lg:min-h-[6rem]">
              {!loading && <Typewriter text={`${t("hero.hello")} ${displayName}`} delay={0.06} />}
              <br />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400 leading-normal"
              >
                {title}
              </motion.span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              {bio}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="pt-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-6">
              <Link 
                to="/projects" 
                className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-12 px-8 rounded-md font-bold shadow-lg shadow-primary/25" })}
              >
                {t("nav.projects")} <ArrowRight className={`${i18n.language === "ar" ? "mr-2 rotate-180" : "ml-2"} h-4 w-4`} />
              </Link>
              <Link 
                to="/contact" 
                className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto h-12 px-8 rounded-md font-bold border-slate-700 bg-slate-900/50 hover:bg-slate-800 backdrop-blur-sm" })}
              >
                {t("nav.contact")}
              </Link>
            </div>
            
            {/* Install Command */}
            <div 
              onClick={handleCopyInstall}
              className="inline-flex items-center justify-between gap-4 bg-[#1e1e1e] border border-slate-800 hover:border-slate-600 transition-colors px-4 py-2.5 rounded-md cursor-pointer text-slate-300 w-full sm:w-auto overflow-hidden group shadow-sm font-mono text-xs sm:text-sm"
              dir="ltr"
            >
              <span className="text-teal-400 select-none">$</span>
              <code className="text-slate-300 truncate">
                npm i @{profile.displayName.toLowerCase().replace(/\s+/g, "")}/core
              </code>
              {copied ? (
                <Check className="w-4 h-4 text-green-500 shrink-0" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0 transition-colors" />
              )}
            </div>
          </motion.div>
        </div>

        {/* Floating Minimal Code Block */}
        <motion.div 
          className="flex-1 w-full max-w-lg mx-auto relative z-10 hidden md:block"
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring", bounce: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-teal-400/20 rounded-2xl blur-2xl -z-10 transform rotate-[-2deg]" />
          
          <div className="bg-[#1e1e1e] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative font-mono text-xs sm:text-sm" dir="ltr">
            <div className="bg-[#2d2d2d] px-4 py-2.5 flex items-center gap-2 border-b border-slate-800">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="mx-auto text-slate-400 flex items-center gap-2 text-xs">
                <Terminal className="w-3 h-3" /> config.ts
              </div>
            </div>
            <div className="p-5 md:p-6 text-slate-300 overflow-x-auto leading-loose">
              <div className="mb-2"><span className="text-[#c678dd]">{t('heroCode.const')}</span> <span className="text-[#e5c07b]">developer</span> <span className="text-[#abb2bf]">=</span> <span className="text-[#abb2bf]">{`{`}</span></div>
              <div className="pl-6 space-y-1">
                <div><span className="text-[#e06c75]">{t('heroCode.name')}</span><span className="text-[#abb2bf]">:</span> <span className="text-[#98c379]">"{displayName}"</span><span className="text-[#abb2bf]">,</span></div>
                <div><span className="text-[#e06c75]">{t('heroCode.role')}</span><span className="text-[#abb2bf]">:</span> <span className="text-[#98c379]">"{title.split(' ')[0]}"</span><span className="text-[#abb2bf]">,</span></div>
                <div><span className="text-[#e06c75]">passion</span><span className="text-[#abb2bf]">:</span> <span className="text-[#98c379]">"{t('heroCode.passion')}"</span><span className="text-[#abb2bf]">,</span></div>
                <div className="pt-2"><span className="text-[#5c6370] italic">{t('heroCode.coreTech')}</span></div>
                <div><span className="text-[#e06c75]">stack</span><span className="text-[#abb2bf]">:</span> <span className="text-[#abb2bf]">[</span></div>
                <div className="pl-6 text-[#98c379]">
                  "React", "TypeScript", "Node.js", "TailwindCSS"
                </div>
                <div><span className="text-[#abb2bf]">],</span></div>
                <div className="pt-2">
                  <span className="text-[#61afef]">connect</span><span className="text-[#abb2bf]">()</span> <span className="text-[#abb2bf]">{`{`}</span>
                </div>
                <div className="pl-6">
                  <span className="text-[#c678dd]">return</span> <Link to="/contact" className="text-[#56b6c2] hover:underline hover:text-teal-300">"mailto:hello@{displayName.toLowerCase().replace(/\s+/g, '')}.dev"</Link><span className="text-[#abb2bf]">;</span>
                </div>
                <div><span className="text-[#abb2bf]">{`}`}</span></div>
              </div>
              <div className="mt-2"><span className="text-[#abb2bf]">{`};`}</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
