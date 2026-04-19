import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Clock, MapPin, Mail, ExternalLink, Code, MessageCircle, Send, LogIn } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const ContactForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { profile } = useProfile();
  const { t } = useTranslation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      if (u) {
        form.setValue("name", u.displayName || "");
        form.setValue("email", u.email || "");
      }
      setIsAuthChecking(false);
    });
    return () => unsub();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      budget: "",
      message: "",
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to sign in.");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user && (!values.whatsapp || values.whatsapp.length < 5)) {
      form.setError("whatsapp", { type: "manual", message: t('contact.whatsappReqGuest', "Contact number / WhatsApp is required for guests.") });
      return;
    }
    try {
      await addDoc(collection(db, 'messages'), {
        ...values,
        userId: user ? user.uid : 'guest',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      toast.success(t('contact.successTitle'));
      form.reset({ name: user?.displayName || "", email: user?.email || "", whatsapp: "", budget: "", message: "" });
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }
  }

  return (
    <div className="flex flex-col flex-grow py-8 relative">
      {/* Header */}
      <header className="mb-16 md:mb-24 text-center md:text-start relative z-10">
        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-3xl leading-[1.1]">
          {t('contact.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">{t('contact.usefulTogether')}</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mx-auto md:mx-0">
          {t('contact.subtitle')}
        </p>
      </header>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 flex-grow relative z-10">
        
        {/* Left: Contact Form */}
        <section className="lg:col-span-7 flex flex-col gap-8 order-2 lg:order-1">
          
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start shadow-sm"
              >
                <CheckCircle className="text-primary w-5 h-5 mt-0.5" />
                <div>
                  <h4 className="font-heading font-semibold text-foreground text-base mb-1">{t('contact.successTitle')}</h4>
                  <p className="text-sm text-muted-foreground">{t('contact.successMsg')}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isAuthChecking ? (
            <div className="flex items-center justify-center h-[400px] bg-card rounded-[2rem] border border-border">
              <span className="text-muted-foreground">{t('contact.checking')}</span>
            </div>
          ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 bg-card p-8 md:p-10 rounded-[2rem] shadow-xl border border-border relative z-10 hover:shadow-2xl transition-shadow duration-500 group">
              {user ? (
                <div className="px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                  <span className="text-sm text-foreground">{t('contact.signedInAs')} <strong>{user.email}</strong></span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => auth.signOut()} className="h-auto py-1 px-3 text-xs">{t('contact.signOut')}</Button>
                </div>
              ) : (
                <div className="px-4 py-3 bg-muted/50 border border-border rounded-xl flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('contact.signInPrefill')}</span>
                  <Button type="button" variant="outline" size="sm" onClick={handleGoogleLogin} className="h-auto py-1 px-3 text-xs gap-2">
                    <LogIn className="w-3 h-3 rtl:scale-x-[-1]" />
                    {t('contact.signIn')}
                  </Button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">{t('contact.name')}</FormLabel>
                      <FormControl>
                        <div className="relative group/input">
                          <Input 
                            className="bg-muted/50 border-0 focus-visible:ring-0 focus-visible:bg-muted rounded-xl px-4 py-6 text-base transition-colors duration-300 peer shadow-none" 
                            placeholder={t('contact.namePlaceholder')} 
                            {...field} 
                          />
                          <div className="absolute bottom-0 left-0 rtl:right-0 rtl:left-auto h-[2px] w-0 bg-primary transition-all duration-300 peer-focus-visible:w-full rounded-b-xl"></div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">{t('contact.email')}</FormLabel>
                      <FormControl>
                        <div className="relative group/input">
                          <Input 
                            className="bg-muted/50 border-0 focus-visible:ring-0 focus-visible:bg-muted rounded-xl px-4 py-6 text-base transition-colors duration-300 peer shadow-none" 
                            placeholder={t('contact.emailPlaceholder')} 
                            type="email" 
                            {...field} 
                          />
                          <div className="absolute bottom-0 left-0 rtl:right-0 rtl:left-auto h-[2px] w-0 bg-primary transition-all duration-300 peer-focus-visible:w-full rounded-b-xl"></div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">{t('contact.budget')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <div className="relative group/input">
                            <SelectTrigger dir="ltr" className="w-full bg-muted/50 border-0 focus:ring-0 focus-visible:ring-0 focus:bg-muted rounded-xl px-4 py-6 text-base transition-colors duration-300 peer shadow-none rtl:text-right">
                              <SelectValue placeholder={t('contact.selectRange')} />
                            </SelectTrigger>
                            <div className="absolute bottom-0 left-0 rtl:right-0 rtl:left-auto h-[2px] w-full bg-transparent">
                              <div className="h-full bg-primary w-0 transition-all duration-300 peer-focus-visible:w-full group-focus-within/input:w-full rounded-b-xl rtl:float-right"></div>
                            </div>
                          </div>
                        </FormControl>
                        <SelectContent dir="ltr">
                          <SelectItem value="under_5k">{t('contact.under5k')}</SelectItem>
                          <SelectItem value="5k_10k">{t('contact.5kTo10k')}</SelectItem>
                          <SelectItem value="10k_plus">{t('contact.10kPlus')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        {t('contact.whatsapp')} {!user && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <div className="relative group/input">
                          <Input 
                            className="bg-muted/50 border-0 focus-visible:ring-0 focus-visible:bg-muted rounded-xl px-4 py-6 text-base transition-colors duration-300 peer shadow-none ltr:text-left rtl:text-right" 
                            dir="ltr"
                            placeholder={t('contact.whatsappPlaceholder')} 
                            {...field} 
                          />
                          <div className="absolute bottom-0 left-0 rtl:right-0 rtl:left-auto h-[2px] w-0 bg-primary transition-all duration-300 peer-focus-visible:w-full rounded-b-xl"></div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-grow flex flex-col">
                    <FormLabel className="font-semibold">{t('contact.message')}</FormLabel>
                    <FormControl>
                      <div className="relative group/input h-full flex flex-col flex-1">
                        <Textarea
                          className="w-full bg-muted/50 border-0 focus-visible:ring-0 focus-visible:bg-muted rounded-xl px-4 py-4 text-base resize-none transition-colors duration-300 peer shadow-none min-h-[150px] flex-1"
                          placeholder={t('contact.messagePlaceholder')}
                          {...field}
                        />
                        <div className="absolute bottom-1 left-0 rtl:right-0 rtl:left-auto h-[2px] w-0 bg-primary transition-all duration-300 peer-focus-visible:w-full rounded-b-xl"></div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="mt-4 px-8 py-6 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 w-full md:w-auto self-start" 
                disabled={form.formState.isSubmitting}
              >
                <span>{form.formState.isSubmitting ? t('contact.sending') : t('contact.send')}</span>
                <Send className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
              </Button>
            </form>
          </Form>
          )}
        </section>

        {/* Right: Details Panel */}
        <aside className="lg:col-span-5 flex flex-col gap-10 order-1 lg:order-2">
          
          {/* Availability Card */}
          <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 flex flex-col gap-4 relative overflow-hidden group hover:bg-primary/10 transition-colors duration-500">
            <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <Clock className="w-32 h-32 text-primary" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)] animate-pulse shrink-0"></div>
              <h3 className="font-heading font-bold text-xl tracking-tight relative z-10">{t('contact.availableForWork')}</h3>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed relative z-10">
              {t('contact.availableDesc')}
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-6 pl-6 rtl:pr-6 rtl:pl-0 border-l-2 rtl:border-r-2 rtl:border-l-0 border-border py-2">
            {(profile as any).email && (
              <div className="flex items-start gap-4">
                <Mail className="text-primary w-5 h-5 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">{t('contact.email')}</p>
                  <a href={`mailto:${(profile as any).email}`} className="text-lg font-semibold hover:text-primary transition-colors text-left" dir="ltr">
                    {(profile as any).email}
                  </a>
                </div>
              </div>
            )}
            <div className="flex items-start gap-4">
              <MapPin className="text-primary w-5 h-5 mt-1 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-medium">{t('contact.location')}</p>
                <p className="text-lg font-semibold">{t('contact.remote')}</p>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="font-heading font-semibold text-lg">{t('contact.connect')}</h3>
            <div className="flex flex-wrap gap-3">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="bg-card hover:bg-muted/50 border border-border text-sm font-medium px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  LinkedIn
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="bg-card hover:bg-muted/50 border border-border text-sm font-medium px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                  <Code className="w-4 h-4 shrink-0" />
                  GitHub
                </a>
              )}
              {profile.websiteUrl && (
                <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="bg-card hover:bg-muted/50 border border-border text-sm font-medium px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  Website
                </a>
              )}
            </div>
          </div>

          {/* FAQs Snippet */}
          <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm mt-auto">
            <h3 className="font-heading font-semibold text-lg mb-6">{t('contact.quickFAQ')}</h3>
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="font-semibold text-sm mb-1.5">{t('contact.workingHoursQ')}</h4>
                <p className="text-sm text-muted-foreground">{t('contact.workingHoursA')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1.5">{t('contact.agenciesQ')}</h4>
                <p className="text-sm text-muted-foreground">{t('contact.agenciesA')}</p>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
};
