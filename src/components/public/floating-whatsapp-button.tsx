import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PUBLIC_WHATSAPP_PHONE, PUBLIC_WHATSAPP_URL } from '@/lib/admin/defaults';

export const FloatingWhatsAppButton = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const label = isArabic ? '\u062a\u0648\u0627\u0635\u0644 \u0648\u0627\u062a\u0633\u0627\u0628' : 'WhatsApp';
  const ariaLabel = isArabic
    ? `\u062a\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628 \u0639\u0644\u0649 \u0631\u0642\u0645 ${PUBLIC_WHATSAPP_PHONE}`
    : `Contact on WhatsApp at ${PUBLIC_WHATSAPP_PHONE}`;

  return (
    <a
      href={PUBLIC_WHATSAPP_URL}
      aria-label={ariaLabel}
      className="whatsapp-float-button group fixed bottom-4 end-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#18bf63] text-white shadow-[0_18px_40px_rgba(24,191,99,0.34)] outline-none transition-[width,transform,box-shadow,background-color] duration-300 hover:w-[9.75rem] hover:-translate-y-1 hover:bg-[#12a955] hover:shadow-[0_22px_48px_rgba(24,191,99,0.42)] focus-visible:ring-4 focus-visible:ring-[#18bf63]/35 sm:bottom-6 sm:end-6 sm:h-[3.25rem] sm:w-[3.25rem]"
    >
      <span className="whatsapp-float-ring absolute inset-0 rounded-full border border-white/45" aria-hidden="true" />
      <span className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.24),rgba(255,255,255,0)_52%)]" aria-hidden="true" />
      <span className="relative flex items-center justify-center gap-2 overflow-hidden px-3">
        <MessageCircle className="h-6 w-6 shrink-0" strokeWidth={2.4} aria-hidden="true" />
        <span className="max-w-0 whitespace-nowrap text-sm font-bold opacity-0 transition-[max-width,opacity] duration-300 group-hover:max-w-24 group-hover:opacity-100">
          {label}
        </span>
      </span>
    </a>
  );
};
