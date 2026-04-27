import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';

export function formatDate(dateString: string, localeStr: string = 'en'): string {
  const date = parseISO(dateString);
  const locale = localeStr === 'ar' ? ar : enUS;
  return format(date, 'MMM d, yyyy', { locale });
}

export function formatDateTime(dateString: string, localeStr: string = 'en'): string {
  const date = parseISO(dateString);
  const locale = localeStr === 'ar' ? ar : enUS;
  return format(date, 'MMM d, yyyy HH:mm', { locale });
}

export function formatRelativeTime(dateString: string, localeStr: string = 'en'): string {
  const date = parseISO(dateString);
  const locale = localeStr === 'ar' ? ar : enUS;
  return formatDistanceToNow(date, { addSuffix: true, locale });
}
