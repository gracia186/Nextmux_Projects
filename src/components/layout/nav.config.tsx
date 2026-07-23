import {
  LayoutDashboard, BarChart3, Users, GraduationCap, Building2, Network,
  FileText, ShieldCheck, Settings, ClipboardList, CalendarCheck, FolderKanban,
   FileUp, UserCircle, Megaphone, Star, FileSignature,
} from 'lucide-react'; // j'ai enlevé MessageSquare,
import type { ReactNode } from 'react';
import type { Role } from '../../types';

export interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  badge?: string;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

const icon = (Icon: typeof LayoutDashboard) => <Icon size={18} strokeWidth={2} />;

export const NAV_BY_ROLE: Record<Role, NavGroup[]> = {
  admin: [
    {
      label: "Vue d'ensemble",
      items: [
        { label: 'Dashboard', to: '/admin', icon: icon(LayoutDashboard) },
        { label: 'Analytiques', to: '/admin/analytiques', icon: icon(BarChart3) },
      ],
    },
    {
      label: 'Gestion',
      items: [
        { label: 'Stagiaires', to: '/admin/stagiaires', icon: icon(GraduationCap) },
        { label: 'Mentors', to: '/admin/mentors', icon: icon(Users) },
        { label: 'Départements', to: '/admin/departements', icon: icon(Network) },
        { label: 'Entreprises', to: '/admin/entreprises', icon: icon(Building2) },
        { label: 'Soutenances', to: '/admin/soutenances', icon: icon(GraduationCap) },
        { label: 'Demandes de documents', to: '/admin/demandes-documents', icon: icon(FileSignature) },
        { label: 'Publications', to: '/admin/publications', icon: icon(Megaphone) },
      ],
    },
    {
      label: 'Système',
      items: [
        { label: 'Utilisateurs', to: '/admin/utilisateurs', icon: icon(ShieldCheck) },
        { label: 'Paramètres', to: '/admin/parametres', icon: icon(Settings) },
      ],
    },
  ],
  mentor: [
    {
      label: "Vue d'ensemble",
      items: [{ label: 'Dashboard', to: '/mentor', icon: icon(LayoutDashboard) }],
    },
    {
      label: 'Suivi',
      items: [
        { label: 'Mes stagiaires', to: '/mentor/stagiaires', icon: icon(GraduationCap) },
        { label: 'Présences', to: '/mentor/presences', icon: icon(CalendarCheck) },
        { label: 'Projets', to: '/mentor/projets', icon: icon(FolderKanban) },
        { label: 'Rapports', to: '/mentor/rapports', icon: icon(FileText) },
        { label: 'Demandes de documents', to: '/mentor/demandes-documents', icon: icon(FileSignature) },
        { label: 'Avis de stage', to: '/mentor/avis', icon: icon(Star) },
        { label: 'Annonces', to: '/mentor/annonces', icon: icon(Megaphone) },
        //{ label: 'Messagerie', to: '/mentor/messagerie', icon: icon(MessageSquare) },
      ],
    },
    {
      label: 'Compte',
      items: [
        { label: 'Profil', to: '/mentor/profil', icon: icon(UserCircle) },
        { label: 'Paramètres', to: '/mentor/parametres', icon: icon(Settings) },
      ],
    },
  ],
  stagiaire: [
    {
      label: "Vue d'ensemble",
      items: [{ label: 'Dashboard', to: '/stagiaire', icon: icon(LayoutDashboard) }],
    },
    {
      label: 'Mon stage',
      items: [
        { label: 'Présences', to: '/stagiaire/presences', icon: icon(CalendarCheck) },
        { label: 'Projets', to: '/stagiaire/projets', icon: icon(FolderKanban) },
        { label: 'Tâches', to: '/stagiaire/taches', icon: icon(ClipboardList) },
        { label: 'Rapports', to: '/stagiaire/rapports', icon: icon(FileText) },
        { label: 'Documents', to: '/stagiaire/documents', icon: icon(FileUp) },
        { label: 'Avis & Soutenance', to: '/stagiaire/avis', icon: icon(Star) },
        { label: 'Annonces', to: '/stagiaire/annonces', icon: icon(Megaphone) },
        //{ label: 'Messagerie', to: '/stagiaire/messagerie', icon: icon(MessageSquare) },
      ],
    },
    {
      label: 'Compte',
      items: [
        { label: 'Profil', to: '/stagiaire/profil', icon: icon(UserCircle) },
        { label: 'Paramètres', to: '/stagiaire/parametres', icon: icon(Settings) },
      ],
    },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Administrateur',
  mentor: 'Mentor',
  stagiaire: 'Stagiaire',
};
