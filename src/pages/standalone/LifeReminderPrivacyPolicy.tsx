import { Helmet } from 'react-helmet-async';
import {
  Bell,
  BrainCircuit,
  CreditCard,
  Database,
  FileDown,
  LockKeyhole,
  Mail,
  Megaphone,
  Mic,
  Trash2,
} from 'lucide-react';

const lastUpdated = 'May 14, 2026';

const policySections = [
  {
    title: 'Data Stored On Your Device',
    icon: Database,
    body: [
      'The app stores reminder information on your device, including reminder titles, categories, due dates, alert times, repeat settings, notes, completion status, app settings, and notification rules.',
      'Core reminder management is designed to work offline.',
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    body: [
      'Life Reminder Pro uses local notifications to alert you about reminders you create. Notification permission is requested so the app can remind you before selected due dates.',
    ],
  },
  {
    title: 'Backup And Restore',
    icon: FileDown,
    body: [
      'The app may let you export a backup file. Backup files can include reminders, categories, notes, notification rules, and settings. You choose where to save or share backup files. Treat backup files as private.',
    ],
  },
  {
    title: 'Purchases And Premium',
    icon: CreditCard,
    body: [
      'Premium purchases and subscription status are handled through Google Play and RevenueCat. Life Reminder Pro does not collect or store payment card details.',
      'Purchase status may be used to unlock Premium features, remove ads, or raise app limits.',
    ],
  },
  {
    title: 'Ads',
    icon: Megaphone,
    body: [
      'The app may show ads to free users through Google AdMob. Ads may use device or advertising identifiers depending on user settings, region, and Google services. Premium users may have ads removed.',
    ],
  },
  {
    title: 'Analytics',
    icon: LockKeyhole,
    body: [
      'The app may use Firebase Analytics to understand app usage, improve reliability, and measure feature performance. Analytics should not be used to store reminder content.',
    ],
  },
  {
    title: 'Voice Input',
    icon: Mic,
    body: [
      'If you use voice input, the app may request microphone permission to convert your speech into text. Microphone access is used only when you choose to use the voice feature.',
    ],
  },
  {
    title: 'AI Reminder Drafts',
    icon: BrainCircuit,
    body: [
      'If AI reminder drafting is enabled, the text you enter or dictate may be sent to the configured AI backend to suggest reminder fields. AI provider secret keys are kept outside the mobile app.',
      'You can review the draft before saving a reminder.',
    ],
  },
  {
    title: 'Data Deletion',
    icon: Trash2,
    body: [
      'You can delete reminders inside the app. You can also remove locally stored app data by uninstalling the app or clearing app data from your device settings.',
      'If you export backup files, you control where those files are stored and deleted.',
    ],
  },
  {
    title: 'Contact',
    icon: Mail,
    body: ['For privacy questions, contact the support email listed on the Google Play store page.'],
  },
];

export function LifeReminderPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <Helmet>
        <title>Privacy Policy | Life Reminder Pro</title>
        <meta
          name="description"
          content="Privacy Policy for Life Reminder Pro, including reminders, notifications, backups, purchases, ads, analytics, voice input, AI drafts, and data deletion."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main className="mx-auto flex w-full max-w-5xl flex-col px-5 py-8 sm:px-8 lg:py-12">
        <section className="border-b border-slate-200 pb-8 sm:pb-10">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Life Reminder Pro
              </p>
              <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                Privacy Policy
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
                Life Reminder Pro helps users create and manage reminders for important life deadlines such as bills,
                renewals, warranties, subscriptions, documents, contracts, car renewals, and memberships.
              </p>
            </div>

            <div className="border-l-4 border-teal-500 bg-white px-5 py-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Last updated</p>
              <p className="mt-1 text-xl font-bold text-slate-950">{lastUpdated}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-b border-slate-200 py-7 text-sm font-medium text-slate-700 sm:grid-cols-3">
          <div>
            <span className="block text-slate-950">Offline first</span>
            Core reminder management works on your device.
          </div>
          <div>
            <span className="block text-slate-950">User controlled</span>
            You choose what to create, export, save, or delete.
          </div>
          <div>
            <span className="block text-slate-950">No card storage</span>
            Payments are handled by Google Play and RevenueCat.
          </div>
        </section>

        <section className="divide-y divide-slate-200">
          {policySections.map((section) => {
            const Icon = section.icon;

            return (
              <article key={section.title} className="grid gap-4 py-7 sm:grid-cols-[220px_1fr] sm:gap-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-heading text-lg font-semibold text-slate-950">{section.title}</h2>
                </div>
                <div className="space-y-3 text-base leading-8 text-slate-700">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
