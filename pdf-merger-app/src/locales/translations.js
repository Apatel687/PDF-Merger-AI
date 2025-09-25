export const translations = {
  en: {
    home: 'Home',
    about: 'About',
    faq: 'FAQ',
    back: '← Back',
    appTitle: 'PDF Merger AI',
    subtitle: 'Next-Gen PDF Processing powered by AI',
    heroTitle: 'Best Free PDF Merger with AI',
    heroDescription: 'Browser-based PDF tool (offline support): merge, split, compress, convert Office ⇆ PDF, and summarize with AI. Free unlimited PDF tools, privacy-first, no uploads.',
    merge: 'Merge PDFs',
    split: 'Split PDF',
    compress: 'Compress PDF',
    summarize: 'Summarize PDF',
    askPdf: 'Ask your PDF',
    uploadTitle: 'Drag & Drop PDF Files',
    uploadSubtitle: 'or click to browse your files',
    browseFiles: 'Browse Files',
    uploadInfo: 'Supports PDF files only • Max file size: 500MB',
    addMorePdfs: 'Add more PDFs',
    keywords: [
      'Free PDF tools online', 'Merge PDF free online', 'Split PDF instantly', 'Compress PDF online free',
      'Convert PDF to Word free', 'AI PDF summarizer free', 'Chat with PDF online', 'Privacy-first PDF editor',
      'SmallPDF alternative free', 'ILovePDF alternative', 'PDF merger for business', 'Student PDF tools'
    ]
  },
  
  es: {
    home: 'Inicio',
    about: 'Acerca de',
    faq: 'Preguntas',
    back: '← Atrás',
    appTitle: 'PDF Merger AI',
    subtitle: 'Procesamiento de PDF de próxima generación con IA',
    heroTitle: 'Mejor Fusionador de PDF Gratis con IA',
    heroDescription: 'Herramienta PDF basada en navegador (soporte offline): fusionar, dividir, comprimir, convertir Office ⇆ PDF, y resumir con IA. Herramientas PDF gratuitas ilimitadas, privacidad primero.',
    merge: 'Fusionar PDFs',
    split: 'Dividir PDF',
    compress: 'Comprimir PDF',
    summarize: 'Resumir PDF',
    askPdf: 'Pregunta a tu PDF',
    uploadTitle: 'Arrastra y Suelta Archivos PDF',
    uploadSubtitle: 'o haz clic para explorar tus archivos',
    browseFiles: 'Explorar Archivos',
    uploadInfo: 'Solo archivos PDF • Tamaño máximo: 500MB',
    addMorePdfs: 'Agregar más PDFs',
    keywords: [
      'Herramientas PDF gratis online', 'Fusionar PDF gratis online', 'Dividir PDF instantáneo', 'Comprimir PDF online gratis',
      'Convertir PDF a Word gratis', 'Resumidor PDF IA gratis', 'Chat con PDF online', 'Editor PDF privacidad primero',
      'Alternativa SmallPDF gratis', 'Alternativa ILovePDF', 'Fusionador PDF para empresas', 'Herramientas PDF estudiantes'
    ]
  },
  
  fr: {
    home: 'Accueil',
    about: 'À propos',
    faq: 'FAQ',
    back: '← Retour',
    appTitle: 'PDF Merger AI',
    subtitle: 'Traitement PDF nouvelle génération avec IA',
    heroTitle: 'Meilleur Fusionneur PDF Gratuit avec IA',
    heroDescription: 'Outil PDF basé navigateur (support hors ligne): fusionner, diviser, compresser, convertir Office ⇆ PDF, et résumer avec IA. Outils PDF gratuits illimités, confidentialité d\'abord.',
    merge: 'Fusionner PDFs',
    split: 'Diviser PDF',
    compress: 'Compresser PDF',
    summarize: 'Résumer PDF',
    askPdf: 'Demandez à votre PDF',
    uploadTitle: 'Glisser-Déposer Fichiers PDF',
    uploadSubtitle: 'ou cliquez pour parcourir vos fichiers',
    browseFiles: 'Parcourir Fichiers',
    uploadInfo: 'Fichiers PDF uniquement • Taille max: 500MB',
    addMorePdfs: 'Ajouter plus de PDFs',
    keywords: [
      'Outils PDF gratuits en ligne', 'Fusionner PDF gratuit en ligne', 'Diviser PDF instantané', 'Compresser PDF en ligne gratuit',
      'Convertir PDF en Word gratuit', 'Résumeur PDF IA gratuit', 'Chat avec PDF en ligne', 'Éditeur PDF confidentialité d\'abord',
      'Alternative SmallPDF gratuite', 'Alternative ILovePDF', 'Fusionneur PDF pour entreprises', 'Outils PDF étudiants'
    ]
  },
  
  de: {
    home: 'Startseite',
    about: 'Über uns',
    faq: 'FAQ',
    back: '← Zurück',
    appTitle: 'PDF Merger AI',
    subtitle: 'PDF-Verarbeitung der nächsten Generation mit KI',
    heroTitle: 'Bester Kostenloser PDF-Merger mit KI',
    heroDescription: 'Browser-basiertes PDF-Tool (Offline-Unterstützung): zusammenführen, teilen, komprimieren, Office ⇆ PDF konvertieren und mit KI zusammenfassen. Kostenlose unbegrenzte PDF-Tools, Datenschutz zuerst.',
    merge: 'PDFs Zusammenführen',
    split: 'PDF Teilen',
    compress: 'PDF Komprimieren',
    summarize: 'PDF Zusammenfassen',
    askPdf: 'Fragen Sie Ihr PDF',
    uploadTitle: 'PDF-Dateien Ziehen & Ablegen',
    uploadSubtitle: 'oder klicken Sie, um Ihre Dateien zu durchsuchen',
    browseFiles: 'Dateien Durchsuchen',
    uploadInfo: 'Nur PDF-Dateien • Max. Dateigröße: 500MB',
    addMorePdfs: 'Weitere PDFs hinzufügen',
    keywords: [
      'Kostenlose PDF-Tools online', 'PDF kostenlos online zusammenführen', 'PDF sofort teilen', 'PDF online kostenlos komprimieren',
      'PDF zu Word kostenlos konvertieren', 'KI PDF-Zusammenfasser kostenlos', 'Chat mit PDF online', 'Datenschutz-erster PDF-Editor',
      'SmallPDF Alternative kostenlos', 'ILovePDF Alternative', 'PDF-Merger für Unternehmen', 'PDF-Tools für Studenten'
    ]
  }
}

export const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations.en[key] || key
}

export const getKeywords = (language) => {
  return translations[language]?.keywords || translations.en.keywords
}