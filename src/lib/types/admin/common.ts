export interface AdminTableProps {
  onDataChange?: () => void;
  isLoading?: boolean;
}

interface solution {
  answer: string
}

export interface RiddleEditData {
  id?: number;
  level_id: string;
  title: string;
  solution: solution;
  hint1: string;
  hint2: string;
  hint3: string;
  files?: string[];
}

export interface SaveLevelsResponse {
    detail: string;
}

export interface TournamentEditData {
  id: string;
  numericId?: number;
  title: string;
  paid: string;
  status: string;
  description?: string;
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

export interface FileUpload {
  id: string;
  name: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  onDelete?: (id: string) => void;
}

export interface RiddleModalProps extends ModalProps {
  editData?: RiddleEditData | null;
  mode?: 'create' | 'edit';
}

import { RiddleApiData } from "../common/types";

export interface TournamentModalProps extends ModalProps {
  editData?: TournamentEditData | null;
  mode?: 'create' | 'edit';
  riddles?: RiddleApiData[];
}

export interface DropdownActionHandler {
  (action: string, item: Record<string, unknown>): void;
}

export interface StatusUpdateHandler {
  (id: string, status: string): void;
}

export interface DeleteHandler {
  (id: string): void;
}

export interface AdminFormData {
  title: string;
  [key: string]: string | number | boolean | solution | undefined;
}

export interface RiddleFormData extends AdminFormData {
  solution: string | solution;
  hint1: string;
  hint2: string;
  hint3: string;
}

export interface TournamentFormData extends AdminFormData {
  price: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface AdminApiResponse<T> {
  status: number;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface FilterProps {
  filters: Record<string, string | number | boolean>;
  onFilterChange: (filters: Record<string, string | number | boolean>) => void;
}

export interface SortProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface TableRow {
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface AdminTableConfig {
  columns: TableColumn[];
  actions?: string[];
  searchable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
}
