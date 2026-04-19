import { motion } from "motion/react";
import { useProfile } from "@/hooks/useProfile";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { useCollection } from "@/hooks/useFirestore";
import {
  FileJson,
  FileCode2,
  TerminalIcon,
  Layout,
  Database,
  Smartphone,
  Cloud,
  Download,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const About = () => {
  const { profile } = useProfile();
  const { data: projects } = useCollection("projects");
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<"about" | "experience" | "skills">(
    "about",
  );

  const displayName =
    i18n.language === "ar"
      ? profile.displayNameAr || profile.displayName
      : profile.displayName;
  const bio =
    (i18n.language === "ar" ? profile.bioAr || profile.bio : profile.bio) || "";

  const renderAboutContent = () => (
    <div className="text-sm md:text-base font-mono">
      <div className="text-slate-500 mb-4">
        /**
        <br />* {t("about.subtitle")}
        <br />
        */
      </div>
      <div>
        <span className="text-[#c678dd]">class</span>{" "}
        <span className="text-[#e5c07b]">Developer</span>{" "}
        <span className="text-[#c678dd]">extends</span>{" "}
        <span className="text-[#e5c07b]">Human</span>{" "}
        <span className="text-[#abb2bf]">{`{`}</span>
      </div>
      <div className="pl-4 md:pl-8 mt-2 space-y-2">
        <div>
          <span className="text-[#c678dd]">constructor</span>
          <span className="text-[#abb2bf]">() {`{`}</span>
        </div>
        <div className="pl-4 md:pl-8">
          <span className="text-[#c678dd]">super</span>
          <span className="text-[#abb2bf]">();</span>
          <br />
          <span className="text-[#e06c75]">this</span>.
          <span className="text-[#abb2bf]">name</span>{" "}
          <span className="text-[#abb2bf]">=</span>{" "}
          <span className="text-[#98c379]">"{displayName}"</span>;<br />
          <span className="text-[#e06c75]">this</span>.
          <span className="text-[#abb2bf]">role</span>{" "}
          <span className="text-[#abb2bf]">=</span>{" "}
          <span className="text-[#98c379]">"{profile.title}"</span>;<br />
          <span className="text-[#e06c75]">this</span>.
          <span className="text-[#abb2bf]">base</span>{" "}
          <span className="text-[#abb2bf]">=</span>{" "}
          <span className="text-[#98c379]">"{t("about.basedIn")}"</span>;<br />
        </div>
        <div>
          <span className="text-[#abb2bf]">{`}`}</span>
        </div>
        <br />
        <div>
          <span className="text-[#61afef]">getBio</span>
          <span className="text-[#abb2bf]">() {`{`}</span>
        </div>
        <div className="pl-4 md:pl-8">
          <span className="text-[#c678dd]">return</span>{" "}
          <span className="text-[#98c379]">
            "{bio.split('\n')[0]}"
          </span>
          {bio.split('\n').length > 1 && (
            <span className="text-[#98c379]">
              {bio.split('\n').slice(1).map((line, i) => (
                <div key={i} className="pl-6">"{line}"</div>
              ))}
            </span>
          )};
        </div>
        <div>
          <span className="text-[#abb2bf]">{`}`}</span>
        </div>
        <br />
        <div>
          <span className="text-[#61afef]">getAvailability</span>
          <span className="text-[#abb2bf]">() {`{`}</span>
        </div>
        <div className="pl-4 md:pl-8">
          <span className="text-[#c678dd]">return</span>{" "}
          <span className="text-[#abb2bf]">[</span>
          <br />
          <span className="pl-4 text-[#98c379]">
            "{t("about.basedInSub")}"
          </span>
          ,<br />
          <span className="pl-4 text-[#98c379]">"{t("about.remoteSub")}"</span>
          <br />
          <span className="text-[#abb2bf]">]</span>;
        </div>
        <div>
          <span className="text-[#abb2bf]">{`}`}</span>
        </div>
      </div>
      <div>
        <span className="text-[#abb2bf]">{`}`}</span>
      </div>
    </div>
  );

  const renderExperienceContent = () => (
    <div className="text-sm md:text-base font-mono">
      <div>
        <span className="text-[#c678dd]">const</span>{" "}
        <span className="text-[#e5c07b]">experience</span>{" "}
        <span className="text-[#abb2bf]">=</span>{" "}
        <span className="text-[#abb2bf]">[</span>
      </div>
      <div className="pl-4 md:pl-8 space-y-4 py-2">
        {/* Senior */}
        <div>
          <span className="text-[#abb2bf]">{`{`}</span>
          <br />
          <span className="pl-4 text-[#e06c75]">year:</span>{" "}
          <span className="text-[#d19a66]">2026</span>,<br />
          <span className="pl-4 text-[#e06c75]">role:</span>{" "}
          <span className="text-[#98c379]">"{t("about.senior")}"</span>,<br />
          <span className="pl-4 text-[#e06c75]">description:</span>{" "}
          <span className="text-[#98c379]">"{t("about.seniorDesc")}"</span>
          <br />
          <span className="text-[#abb2bf]">{`}`}</span>,
        </div>
        {/* Mid */}
        <div>
          <span className="text-[#abb2bf]">{`{`}</span>
          <br />
          <span className="pl-4 text-[#e06c75]">year:</span>{" "}
          <span className="text-[#d19a66]">2020</span>,<br />
          <span className="pl-4 text-[#e06c75]">role:</span>{" "}
          <span className="text-[#98c379]">"{t("about.midLevel")}"</span>,
          <br />
          <span className="pl-4 text-[#e06c75]">description:</span>{" "}
          <span className="text-[#98c379]">"{t("about.midLevelDesc")}"</span>
          <br />
          <span className="text-[#abb2bf]">{`}`}</span>,
        </div>
        {/* Junior */}
        <div>
          <span className="text-[#abb2bf]">{`{`}</span>
          <br />
          <span className="pl-4 text-[#e06c75]">year:</span>{" "}
          <span className="text-[#d19a66]">2015</span>,<br />
          <span className="pl-4 text-[#e06c75]">role:</span>{" "}
          <span className="text-[#98c379]">"{t("about.junior")}"</span>,<br />
          <span className="pl-4 text-[#e06c75]">description:</span>{" "}
          <span className="text-[#98c379]">"{t("about.juniorDesc")}"</span>
          <br />
          <span className="text-[#abb2bf]">{`}`}</span>
        </div>
      </div>
      <div>
        <span className="text-[#abb2bf]">]</span>;
      </div>
    </div>
  );

  const renderSkillsContent = () => (
    <div className="text-sm md:text-base font-mono">
      <div className="text-[#c678dd] mb-2">
        <span className="text-[#c678dd]">export const</span>{" "}
        <span className="text-[#e5c07b]">techArsenal</span>{" "}
        <span className="text-[#abb2bf]">=</span>{" "}
        <span className="text-[#abb2bf]">{`{`}</span>
      </div>

      <div className="pl-4 md:pl-8 space-y-4">
        <div>
          <span className="text-[#e06c75]">frontend:</span>{" "}
          <span className="text-[#abb2bf]">[</span>
          <span className="text-[#98c379]">"React"</span>,{" "}
          <span className="text-[#98c379]">"Next.js"</span>,{" "}
          <span className="text-[#98c379]">"Tailwind CSS"</span>,{" "}
          <span className="text-[#98c379]">"TypeScript"</span>
          <span className="text-[#abb2bf]">]</span>,
        </div>

        <div>
          <span className="text-[#e06c75]">backend:</span>{" "}
          <span className="text-[#abb2bf]">[</span>
          <span className="text-[#98c379]">"Node.js"</span>,{" "}
          <span className="text-[#98c379]">"Express"</span>,{" "}
          <span className="text-[#98c379]">"PostgreSQL"</span>,{" "}
          <span className="text-[#98c379]">"MongoDB"</span>
          <span className="text-[#abb2bf]">]</span>,
        </div>

        <div>
          <span className="text-[#e06c75]">mobile:</span>{" "}
          <span className="text-[#abb2bf]">[</span>
          <span className="text-[#98c379]">"React Native"</span>,{" "}
          <span className="text-[#98c379]">"Expo"</span>
          <span className="text-[#abb2bf]">]</span>,
        </div>

        <div>
          <span className="text-[#e06c75]">devops:</span>{" "}
          <span className="text-[#abb2bf]">[</span>
          <span className="text-[#98c379]">"Docker"</span>,{" "}
          <span className="text-[#98c379]">"AWS"</span>,{" "}
          <span className="text-[#98c379]">"CI/CD"</span>,{" "}
          <span className="text-[#98c379]">"Vercel"</span>
          <span className="text-[#abb2bf]">]</span>
        </div>
      </div>

      <div className="text-[#abb2bf] mt-2">{`};`}</div>
    </div>
  );

  return (
    <div className="w-full flex-1 pt-8 pb-16 relative z-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
        {/* Right side (or Left in LTR): Text Content */}
        <motion.div
          initial={{ opacity: 0, x: i18n.language === "ar" ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-base text-teal-400 font-bold uppercase tracking-wider font-heading">
              {t("about.title")}
            </h2>
            <h3 className="text-4xl md:text-5xl font-heading font-black text-foreground leading-[1.1]">
              {t("about.subtitle")}
            </h3>
          </div>

          <div className="text-base md:text-lg text-slate-400 leading-relaxed font-body">
            {i18n.language === "ar"
              ? profile.bioAr || profile.bio
              : profile.bio}
          </div>

          <ul className="space-y-3 pt-2">
            {[t("about.bullet1"), t("about.bullet2"), t("about.bullet3")].map(
              (bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200 font-medium font-body">{bullet}</span>
                </li>
              )
            )}
          </ul>

          <div className="flex flex-wrap gap-4 pt-6">
            <a
              href="#"
              className={buttonVariants({
                size: "lg",
                className: "h-12 px-8 font-bold font-body",
              })}
              onClick={(e) => {
                e.preventDefault();
                alert("CV Download functionality to be implemented.");
              }}
            >
              <Download
                className={`w-4 h-4 ${
                  i18n.language === "ar" ? "ml-2" : "mr-2"
                }`}
              />
              {t("about.downloadResume")}
            </a>
            <Link
              to="/contact"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "h-12 px-8 font-bold border-slate-700 hover:bg-slate-800 text-slate-200 font-body",
              })}
            >
              {t("nav.contact")}
              <ArrowRight
                className={`w-4 h-4 ${
                  i18n.language === "ar" ? "mr-2 rotate-180" : "ml-2"
                }`}
              />
            </Link>
          </div>
        </motion.div>

        {/* Left side (or Right in LTR): VS Code Block */}
        <motion.div
          initial={{ opacity: 0, x: i18n.language === "ar" ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-[#1e1e1e] font-mono flex flex-col h-[380px] w-full max-w-lg mx-auto lg:ml-auto lg:mr-0 select-none group"
          dir="ltr"
        >
          {/* Editor Header / Title Bar */}
          <div className="bg-[#1e1e1e] flex items-center px-4 py-2.5 border-b border-slate-800">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="mx-auto text-xs text-slate-400 font-sans">
              portfolio — VS Code
            </div>
          </div>

          {/* Editor Tabs bar */}
          <div className="flex overflow-x-auto bg-[#252526] border-b border-slate-800 scrollbar-hide select-none transition-colors">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center gap-2 px-4 py-2 border-t-2 text-xs md:text-sm whitespace-nowrap transition-colors outline-none ${
                activeTab === "about"
                  ? "bg-[#1e1e1e] border-primary text-slate-200"
                  : "border-transparent text-slate-500 hover:bg-[#2d2d2d]"
              }`}
            >
              <FileCode2 className="w-4 h-4 text-blue-400 shrink-0" />
              about.ts
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`flex items-center gap-2 px-4 py-2 border-t-2 text-xs md:text-sm whitespace-nowrap transition-colors outline-none ${
                activeTab === "experience"
                  ? "bg-[#1e1e1e] border-primary text-slate-200"
                  : "border-transparent text-slate-500 hover:bg-[#2d2d2d]"
              }`}
            >
              <FileJson className="w-4 h-4 text-yellow-400 shrink-0" />
              history.json
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`flex items-center gap-2 px-4 py-2 border-t-2 text-xs md:text-sm whitespace-nowrap transition-colors outline-none ${
                activeTab === "skills"
                  ? "bg-[#1e1e1e] border-primary text-slate-200"
                  : "border-transparent text-slate-500 hover:bg-[#2d2d2d]"
              }`}
            >
              <FileCode2 className="w-4 h-4 text-blue-400 shrink-0" />
              skills.ts
            </button>
          </div>

          {/* Editor Body */}
          <div className="flex flex-1 bg-[#1e1e1e] overflow-hidden relative">
            {/* Line Numbers */}
            <div className="w-10 md:w-12 shrink-0 py-4 font-mono text-[10px] md:text-xs text-slate-600 text-right pr-3 select-none border-r border-[#333]">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="leading-[1.4] md:leading-[1.5]">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Content */}
            <div className="flex-1 px-4 py-3 h-full overflow-y-auto overflow-x-hidden font-mono text-[10px] md:text-[13px] text-slate-300 relative leading-[1.4] md:leading-[1.5] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {activeTab === "about" && renderAboutContent()}
              {activeTab === "experience" && renderExperienceContent()}
              {activeTab === "skills" && renderSkillsContent()}

              {/* Blinking cursor */}
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 md:w-2 h-3 md:h-[1rem] bg-slate-400 ml-1 align-middle translate-y-[-1px] md:translate-y-[-2px]"
              />
            </div>
          </div>

          {/* Editor Footer */}
          <div className="bg-[#007acc] text-white px-3 py-1 flex justify-between items-center text-[10px] md:text-xs font-mono select-none">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
                <TerminalIcon className="w-3 h-3" /> main*
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
                0 errors, 0 warnings
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
                UTF-8
              </span>
              <span className="hidden sm:inline cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
                {activeTab === "experience" ? "JSON" : "TypeScript"}
              </span>
              <span className="cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
                Prettier: <span className="text-green-300">✓</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3 Small Stat Cards under the Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
      >
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center hover:bg-slate-800/80 transition-colors shadow-sm">
          <div className="text-3xl lg:text-4xl font-heading font-black text-primary mb-2">
            {t("stats.valYearsExp", { defaultValue: "+5" })}
          </div>
          <div className="text-xs lg:text-sm font-medium text-slate-400 font-sans uppercase tracking-wider">
            {t("stats.yearsExp")}
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center hover:bg-slate-800/80 transition-colors shadow-sm">
          <div className="text-3xl lg:text-4xl font-heading font-black text-primary mb-2">
            +{projects && projects.length > 0 ? projects.length : 20}
          </div>
          <div className="text-xs lg:text-sm font-medium text-slate-400 font-sans uppercase tracking-wider">
            {t("stats.projectsDelivered")}
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center hover:bg-slate-800/80 transition-colors shadow-sm">
          <div className="text-3xl lg:text-4xl font-heading font-black text-primary mb-2">
            3
          </div>
          <div className="text-xs lg:text-sm font-medium text-slate-400 font-sans uppercase tracking-wider">
            {i18n.language === "ar"
              ? "مجالات تخصص"
              : "Core Disciplines"}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
