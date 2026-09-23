import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'de_CH';

interface TranslationKeys {
  products: string;
  inventory: string;
  users: string;
  logout: string;
  language: string;
  brandSubtitle: string;
  role: string;
  searchPlaceholder: string;
  searchUsersPlaceholder: string;
  noProductsFound: string;
  noUsersFound: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  totalSold: string;
  actions: string;
  edit: string;
  delete: string;
  confirmDelete: string;
  save: string;
  cancel: string;
  lowStock: string;
  outOfStock: string;
  signIn: string;
  register: string;
  email: string;
  password: string;
  accessAccount: string;
  createAccount: string;
  signingIn: string;
  invalidCredentials: string;
  creatingAccount: string;
  accountError: string;
  alreadyHaveAccount: string;
  profile: string;
  profileError: string;
  username: string;
  overview: string;
  welcomeBack: string;
  totalProducts: string;
  items: string;
  stockThreshold: string;
  activeTracking: string;
  bestSellingProducts: string;
  topFiveSales: string;
  bestSellingError: string;
  accessError: string;
  readyToManageCatalog: string;
  catalogDescription: string;
  goTo: string;
  sortBy: string;
  sortNameAsc: string;
  sortNameDesc: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  defaultSort: string;
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    products: 'Products',
    inventory: 'Inventory',
    users: 'Users Management',
    logout: 'Logout',
    language: 'Language',
    brandSubtitle: 'Food Waste Solutions',
    role: 'Role',
    searchPlaceholder: 'Search products...',
    searchUsersPlaceholder: 'Search users...',
    noProductsFound: 'No products found',
    noUsersFound: 'No users found',
    name: 'Name',
    category: 'Category',
    price: 'Price',
    stock: 'Stock',
    totalSold: 'Total Sold',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this item?',
    save: 'Save',
    cancel: 'Cancel',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    signIn: 'Sign in',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    accessAccount: 'Access your account.',
    createAccount: 'Create an account',
    signingIn: 'Signing in...',
    invalidCredentials: 'Invalid email or password.',
    creatingAccount: 'Creating account...',
    accountError: 'Unable to create the account. Check the details and try again.',
    alreadyHaveAccount: 'Already have an account?',
    profile: 'Profile',
    profileError: 'Unable to load your profile.',
    username: 'Username',
    overview: 'Overview',
    welcomeBack: 'Welcome back to the Food Waste Management System',
    totalProducts: 'Total products',
    items: 'Items',
    stockThreshold: 'Stock <= 5',
    activeTracking: 'Active Tracking',
    bestSellingProducts: 'Best-selling products',
    topFiveSales: 'Top 5 products by total sales',
    bestSellingError: 'Unable to load best-selling products. Please try again.',
    accessError: 'Unable to access the system. Please try again.',
    readyToManageCatalog: 'Ready to manage your catalog?',
    catalogDescription: 'Filter products, monitor low-stock items, edit records, or delete obsolete entries.',
    goTo: 'Go to',
    sortBy: 'Sort by',
    defaultSort: 'Default order',
    sortNameAsc: 'Name (A-Z)',
    sortNameDesc: 'Name (Z-A)',
    sortPriceAsc: 'Price (Lowest first)',
    sortPriceDesc: 'Price (Highest first)',
  },
  de_CH: {
    products: 'Produkte',
    inventory: 'Inventar',
    users: 'Benutzerverwaltung',
    logout: 'Abmelden',
    language: 'Sprache',
    brandSubtitle: 'Lebensmittelabfall-Lösungen',
    role: 'Rolle',
    searchPlaceholder: 'Produkte suchen...',
    searchUsersPlaceholder: 'Benutzer suchen...',
    noProductsFound: 'Keine Produkte gefunden',
    noUsersFound: 'Keine Benutzer gefunden',
    name: 'Name',
    category: 'Kategorie',
    price: 'Preis',
    stock: 'Bestand',
    totalSold: 'Verkauft Total',
    actions: 'Aktionen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    confirmDelete: 'Möchten Sie diesen Eintrag wirklich löschen?',
    save: 'Speichern',
    cancel: 'Abbrechen',
    lowStock: 'Geringer Bestand',
    outOfStock: 'Nicht an Lager',
    signIn: 'Anmelden',
    register: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    accessAccount: 'Greifen Sie auf Ihr Konto zu.',
    createAccount: 'Konto erstellen',
    signingIn: 'Anmeldung...',
    invalidCredentials: 'Ungültige E-Mail oder ungültiges Passwort.',
    creatingAccount: 'Konto wird erstellt...',
    accountError: 'Konto konnte nicht erstellt werden. Bitte prüfen Sie Ihre Angaben.',
    alreadyHaveAccount: 'Sie haben bereits ein Konto?',
    profile: 'Profil',
    profileError: 'Ihr Profil konnte nicht geladen werden.',
    username: 'Benutzername',
    overview: 'Übersicht',
    welcomeBack: 'Willkommen zurück beim Lebensmittelabfallmanagementsystem',
    totalProducts: 'Produkte insgesamt',
    items: 'Artikel',
    stockThreshold: 'Bestand <= 5',
    activeTracking: 'Aktive Erfassung',
    bestSellingProducts: 'Meistverkaufte Produkte',
    topFiveSales: 'Top 5 Produkte nach Gesamtverkäufen',
    bestSellingError: 'Meistverkaufte Produkte konnten nicht geladen werden. Bitte versuchen Sie es erneut.',
    accessError: 'Zugriff auf das System nicht möglich. Bitte versuchen Sie es erneut.',
    readyToManageCatalog: 'Bereit, Ihren Katalog zu verwalten?',
    catalogDescription: 'Produkte filtern, Artikel mit geringem Bestand überwachen, Einträge bearbeiten oder veraltete Einträge löschen.',
    goTo: 'Zu',
    sortBy: 'Sortieren nach',
    defaultSort: 'Standardreihenfolge',
    sortNameAsc: 'Name (A-Z)',
    sortNameDesc: 'Name (Z-A)',
    sortPriceAsc: 'Preis (Aufsteigend)',
    sortPriceDesc: 'Preis (Absteigend)',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};