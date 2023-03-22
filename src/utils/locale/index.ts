import { locale_en } from './en';

export interface LocaleStrings {
  CheckWallet: string;
  TransactionPending: string;
}

export type LocaleStringKeys = keyof LocaleStrings;

export const locale = (k: LocaleStringKeys): string => {
  return locales.en[k];
};
export const locales = {
  en: locale_en,
};
