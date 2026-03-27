import { ReactNode } from "react";

export interface AdminLayoutProps {
  children: ReactNode;
}

export interface HeaderProps {
  pageTitle: string;
}

export interface SidebarProps {
  pageTitle: string;
}

export interface DashboardCardProps {
  title: string;
  percentage: string;
  value: string;
}

export interface RecentTransactionsProps {
  transactions: Finance[];
  onDataChange?: () => void;
  isLoading?: boolean;
}

export interface Seasons {
  id: number;
  number: number;
  status: string;
  title: string;
  start_date: string;
  end_date: string;
}

export interface SeasonsProps {
  seasons: SeasonData[];
  onDataChange?: () => void;
  isLoading?: boolean;
}

export interface Tournament {
  id: string;
  numericId: number;
  title: string;
  paid: string;
  status: string;
  result_status?: string;
  start_date?: string,
  end_date?: string,
  price?: string,
  description?: string,
}

export interface TournamentsProps {
  tournaments: Tournament[];
  onDataChange?: () => void;
  isLoading?: boolean;
}

import { ModalLayoutProps, RiddleData, SeasonData } from "../common/types";

export interface RiddlesProps {
  isOpen: boolean;
  onClose: () => void;
  riddles: RiddleData[];
}

interface Finance {
  orderId: string | number;
  accountId: string;
  value: string;
  date: string;
  product: string;
}

export interface FinanceProps {
  finance: Finance[];
  onDataChange?: () => void;
  isLoading?: boolean;
  period: string;
  onChangePeriod: (value: string) => void;
}

export interface FileUpload {
  id: string;
  name: string;
}

interface solution {
  answer: string
}

export interface RiddleEditData {
  id?: number;
  level_id: string;
  title: string;
  solution: solution;
  riddle_id?: number;
  hint1: string;
  hint2: string;
  hint3: string;
  files?: string[];
  type?: string;
}

export interface DailyRiddleFormData {
  date: string;
  riddle: number | null;
}

export interface TournamentEditData {
  id: string;
  numericId?: number;
  title: string;
  description?: string;
  details?: string;
  paid: string;
  status: string;
  start_date?: string;
  end_date?: string;
  price?: string;
  levels?: Array<{
    id: number;
    tournament: number;
    riddle: number;
    level_number: number;
  }>;
}

export interface RiddleModalProps extends RiddlesProps {
  editData?: RiddleEditData | null;
  mode?: 'create' | 'edit';
  onSave?: () => void;
  onDelete?: (level_id: string) => void;
}

export interface TournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: TournamentEditData | null;
  mode?: 'create' | 'edit' | 'duplicate';
  onSave?: () => void;
  onDelete?: () => void;
}

export interface ConfirmationModalProps
  extends Pick<ModalLayoutProps, "isOpen" | "onClose"> {
  onConfirm: () => Promise<boolean> | boolean;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  mode?: "Edit" | "Delete";
}