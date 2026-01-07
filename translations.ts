
import { Translations, Language } from './types';

export const translations: Translations = {
  [Language.EN]: {
    nav: { home: 'Home', features: 'Features', about: 'About', contact: 'Contact' },
    hero: {
      title: 'Build Faster, Reach Further',
      subtitle: 'A modern, multilingual static site template powered by React and Tailwind CSS. Perfect for global reach.',
      cta: 'Vision Span'
    },
    features: {
      title: 'Our Core Features',
      items: [
        { title: 'Vision Span', description: 'Interactive eye-tracking and peripheral vision exercises.', icon: '👁️' },
        { title: 'Multilang Ready', description: 'Seamlessly switch between languages with zero page reloads.', icon: '🌐' },
        { title: 'Optimized SEO', description: 'Built with static performance in mind for search engine visibility.', icon: '🚀' }
      ]
    },
    contact: {
      title: 'Get in Touch',
      name: 'Full Name',
      email: 'Email Address',
      message: 'Your Message',
      submit: 'Send Message'
    },
    footer: { rights: 'All rights reserved.', language: 'Language' }
  },
  [Language.ES]: {
    nav: { home: 'Inicio', features: 'Características', about: 'Nosotros', contact: 'Contacto' },
    hero: {
      title: 'Construye Rápido, Llega Lejos',
      subtitle: 'Una plantilla de sitio estático moderna y multilingüe impulsada por React y Tailwind CSS. Ideal para alcance global.',
      cta: 'Empezar ahora'
    },
    features: {
      title: 'Nuestras Características',
      items: [
        { title: 'Vision Span', description: 'Ejercicios interactivos de seguimiento ocular y visión periférica.', icon: '👁️' },
        { title: 'Listo para Varios Idiomas', description: 'Cambia entre idiomas sin recargar la página.', icon: '🌐' },
        { title: 'SEO Optimizado', description: 'Construido pensando en el rendimiento para visibilidad en buscadores.', icon: '🚀' }
      ]
    },
    contact: {
      title: 'Contactar',
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      message: 'Tu Message',
      submit: 'Enviar Mensaje'
    },
    footer: { rights: 'Todos los derechos reservados.', language: 'Idioma' }
  },
  [Language.FR]: {
    nav: { home: 'Accueil', features: 'Fonctionnalités', about: 'À Propos', contact: 'Contact' },
    hero: {
      title: 'Construisez Vite, Allez Loin',
      subtitle: 'Un modèle de site statique moderne et multilingue propulsé par React et Tailwind CSS. Parfait pour un rayonnement mondial.',
      cta: 'Commencer'
    },
    features: {
      title: 'Nos Fonctionnalités',
      items: [
        { title: 'Vision Span', description: 'Exercices interactifs de poursuite oculaire et de vision périphérique.', icon: '👁️' },
        { title: 'Prêt pour le Multilingue', description: 'Changez de langue sans recharger la page.', icon: '🌐' },
        { title: 'SEO Optimisé', description: 'Conçu pour la performance et la visibilité sur les moteurs de recherche.', icon: '🚀' }
      ]
    },
    contact: {
      title: 'Contactez-nous',
      name: 'Nom complet',
      email: 'Adresse e-mail',
      message: 'Votre message',
      submit: 'Envoyer'
    },
    footer: { rights: 'Tous droits réservés.', language: 'Langue' }
  },
  [Language.DE]: {
    nav: { home: 'Startseite', features: 'Funktionen', about: 'Über uns', contact: 'Kontakt' },
    hero: {
      title: 'Schneller bauen, weiter kommen',
      subtitle: 'Eine moderne, mehrsprachige statische Seitenvorlage auf Basis von React und Tailwind CSS.',
      cta: 'Jetzt loslegen'
    },
    features: {
      title: 'Unsere Funktionen',
      items: [
        { title: 'Vision Span', description: 'Interaktive Augen-Tracking- und Peripheriesicht-Übungen.', icon: '👁️' },
        { title: 'Mehrsprachigkeit', description: 'Nahtloser Sprachwechsel ohne Neuladen der Seite.', icon: '🌐' },
        { title: 'SEO Optimiert', description: 'Optimiert für Suchmaschinen-Sichtbarkeit.', icon: '🚀' }
      ]
    },
    contact: {
      title: 'Kontakt Aufnehmen',
      name: 'Name',
      email: 'E-Mail-Adresse',
      message: 'Nachricht',
      submit: 'Nachricht Senden'
    },
    footer: { rights: 'Alle Rechte vorbehalten.', language: 'Sprache' }
  }
};
