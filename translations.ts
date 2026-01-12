
import { Translations, Language } from './types';

export const translations: Translations = {
  [Language.EN]: {
    nav: { home: 'Home', features: 'Features', about: 'About', contact: 'Contact' },
    hero: {
      title: 'Read Faster and Better',
      subtitle: 'Improve your reading speed and retention with these daily exercises',
      cta: 'Vision Span'
    },
    features: {
      title: 'Our Core Features',
      items: [
        { title: 'Vision Span', description: 'Interactive eye-tracking and peripheral vision exercises.', icon: '👁️' },
        { title: 'Read Drills', description: 'Practice reading efficiently with guided drills.', icon: '🌐' },
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
      title: 'Lee más rápido y mejor',
      subtitle: 'Mejora tu velocidad de lectura y retención con estos ejercicios diarios',
      cta: 'Vision Span'
    },
    features: {
      title: 'Nuestras Características',
      items: [
        { title: 'Vision Span', description: 'Ejercicios interactivos de seguimiento ocular y visión periférica.', icon: '👁️' },
        { title: 'Ejercicios de Lectura', description: 'Practica la lectura eficiente con ejercicios guiados.', icon: '🌐' },
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
      title: 'Lisez plus vite et mieux',
      subtitle: 'Améliorez votre vitesse de lecture et votre mémorisation grâce à ces exercices quotidiens',
      cta: 'Commencer'
    },
    features: {
      title: 'Nos Fonctionnalités',
      items: [
        { title: 'Vision Span', description: 'Exercices interactifs de poursuite oculaire et de vision périphérique.', icon: '👁️' },
        { title: 'Exercices de Lecture', description: 'Entraînez-vous à lire efficacement avec des exercices guidés.', icon: '🌐' },
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
      title: 'Schneller und besser lesen',
      subtitle: 'Verbessern Sie Ihre Lesegeschwindigkeit und Ihr Gedächtnis mit diesen täglichen Übungen',
      cta: 'Jetzt loslegen'
    },
    features: {
      title: 'Unsere Funktionen',
      items: [
        { title: 'Vision Span', description: 'Interaktive Augen-Tracking- und Peripheriesicht-Übungen.', icon: '👁️' },
        { title: 'Leseübungen', description: 'Üben Sie effizientes Lesen mit angeleiteten Übungen.', icon: '🌐' },
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
