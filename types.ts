
export enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  DE = 'de'
}

export interface TranslationContent {
  nav: {
    home: string;
    features: string;
    about: string;
    contact: string;
    progress: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  features: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  contact: {
    title: string;
    name: string;
    email: string;
    message: string;
    submit: string;
  };
  footer: {
    rights: string;
    language: string;
  };
}

export type Translations = Record<Language, TranslationContent>;
