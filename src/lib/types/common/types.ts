import type React from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { UseFormRegister, UseFormRegisterReturn } from "react-hook-form";
import { RiddlesProps } from "../admin";

export type Tab = "gameplay" | "about";

export interface DropdownProps {
  options: string[];
  placeholder?: string;
  onChange?: (selected: string | null) => void;
  value: string | null;
  status?: string;
}

export interface CountryDropdownProps {
  value: string;
  onChange: (countryCode: string) => void;
  placeholder?: string;
}
export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  privacy_terms: boolean;
}

export interface ForgotPassword {
  detail: string;

}

export interface ProfileSearch {
  id: number;
  username: string;
}

export interface ResetPassword {
  password: string;
  confirm_password: string;
}

export interface InputFieldProps {
  name?: string;
  register?: UseFormRegisterReturn;
  label?: string;
  type?: string;
  value?: string | number | undefined;
  placeholder?: string;
  customClass?: string;
  labelClass?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setHide?: (value: boolean) => void;
  hide?: boolean;
  showEyeIcon?: boolean;
  disabled?: boolean;
  accept?: string;
  icon?: ReactNode;
  autoComplete?: string;
  mode?: string;
  maxLength?: number;
}

export interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  customStyle?: React.CSSProperties;
  customClass?: string;
}

export interface EmailStatus {
  status: string;
  message: string;
}
export interface SignInFormData {
  email: string;
  password: string;
}

export interface SocialSignInData {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface UserProfileData {
  username: string;
  image?: string;
  background?: File;
  country: string;
  description: string;
  display_on_profile: boolean;
  tiktok: string;
  facebook: string;
  instagram: string;
  twitter: string;
  username_color: string;
  description_color: string;
}

export interface UserSettingsData {
  username: string;
  email: string;
  account_id: string;
}

export interface ProfileDesignData {
  username: string;
  description: string;
  country: string;
  background: string | null;
  display_on_profile: boolean;
  instagram: string;
  tiktok: string;
  facebook: string;
  twitter: string;
  username_color: string | null;
  description_color: string | null;
}

export interface UserLayoutProps {
  children: ReactNode;
}

export interface SocialLoginProps {
  mode?: "login" | "signup";
}

export interface AppProviderProps {
  children: ReactNode;
}

export interface AuthProps {
  children: ReactNode;
}

export interface ModalProps {
  type?: string;
  children: ReactNode;
  isOpen?: boolean;
  title?: string;
  onClose?: () => void;
  setIsOpen?: (value: boolean) => void;
}

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  mode?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

export interface CustomPrizeResponse {
  is_distributed: boolean;
  prizes: {
    id: number;
    start_rank: number;
    end_rank: number;
    cash_prize: string;
  }[];
}

export interface PrizeTable {
  data?: [];
  columns?: PrizeColumns[];
}

export interface PrizeColumns {
  header: string;
}

export interface ModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  header?: ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export interface TournamentLeaderboardColumns {
  rank: string;
  user_id?: string;
  username: string;
  totalPoints: string;
  level: string;
}

export interface LeaderBoardColumns {
  user_id?: string;
  rank: string;
  username: string;
  totalPoints: string;
  wins: string;
  streak: string;
  badge?: string;
}

export interface PrizeApiResponse {
  id: number;
  start_rank: number;
  end_rank: number;
  points: number;
  cash_prize: string;
  user: string;
}

export interface PrizeTableColumns {
  rank: string;
  leaderboardPoints: string;
  cashPrize: string;
  badge?: string;
  username: string;
}
export interface GradiantCardProps {
  children?: ReactNode;
  customClass?: string;
}

export interface CardHeaderProps {
  children?: ReactNode;
  customClass?: string;
}

export interface TournamentsType {
  tournament_id: string;
  title: string;
  description: string;
  price: string;
  type: string;
  status: string;
  start_date?: string;
  end_date?: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface FAQS {
  active: boolean;
  id: string;
  question: string;
  answer: string;
}

export interface TournamentDetail {
  id: number;
  status: string;
  tournament_id: string;
  title: string;
  description: string;
  details: string;
  type: string;
  start_date: string;
  end_date: string;
  price: string;
  creator: number;
  riddles: number;
  prizes: PrizeApiResponse[];
  prize_money: number;
  users: number;
  user_has_joined: boolean;
  user_has_completed: boolean;
  level_number: number;
}

export interface CheckoutPageProps {
  onBack: () => void;
  selectedProduct: StripeProduct;
}

export interface PaymentModalProps {
  onBack: () => void;
  success?: boolean;
}
export interface Prizes {
  rank: number;
  user: string;
  points: number;
  cash_prize: number;
}

export interface TournamentDetailProps {
  tournamentDetail: TournamentDetail | null;
}

export interface StatisticsCardProps {
  children: ReactNode;
}

export type FormFields = {
  level_id: string;
  title: string;
  solution: solution;
  hint1: string;
  hint2: string;
  hint3: string;
  type: string;
};

export interface AllRiddlesSeason {
  id: number;
  level_id: string;
  title: string;
  riddle_id: number;
}

export type InputProps = {
  label: string;
  placeholder: string;
  name: keyof FormFields | `solution.${keyof solution}`;
  register: UseFormRegister<FormFields>;
};

export type TextAreaProps = {
  placeholder: string;
  name: keyof FormFields;
  register: UseFormRegister<FormFields>;
};

export type FormData = Record<string, never>;

interface solution {
  answer: string;
}

export interface RiddleData {
  id: number;
  level_id: string;
  levelNumber: number;
  title: string;
  solution: solution;
  hint1: string;
  hint2: string;
  hint3: string;
  files?: string[];
}

export type SelectRiddleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  riddles?: RiddleApiData[];
  onRiddlesAdded?: (riddleIds: string[], seasonId?: number) => void;
  isLoading?: boolean;
  seasonId?: number;
  seasonDataa?: SeasonData | null;
  dailyRiddles?: DailyRiddleApiData[];
  onDataChange?: () => void;
};

export type RiddlesTableProps = {
  riddles?: RiddleData[];
  viewMode?: "full" | "simple";
  onDataChange?: () => void;
  onRiddlesAdded?: (riddleIds: string[], seasonId?: number) => void;
  allRiddles?: RiddleApiData[];
  isLoading?: boolean;
  itemsPerPage?: number;
  selectedSeasonId?: number;
  onSeasonSelect?: (seasonId: number) => void;
  seasons?: SeasonData[];
  onShowAllRiddles?: (seasonData: SeasonData | null) => void;
  handleSetSeasonRiddle?: (seasonRiddle: AllRiddlesSeason[]) => void;
};

export interface ImportRiddlesProps {
  onClose: () => void;
  onDataChange?: () => void;
}
export interface DotsLoaderProps {
  message?: string;
  className?: string;
}

export interface CreateSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  mode?: string;
  seasonData?: {
    id: number;
    title: string | undefined;
    number?: number | undefined;
    status?: string;
    start_date?: string;
    end_date?: string;
  } | null | undefined;
  onDataChange?: () => void;
}

export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  selectedUserData?: UserApiData;
  fetchUsers: () => Awaited<void>;
}

export interface EditUserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: "ADMIN" | "CREATOR" | "USER";
  active: boolean;
  lives: number;
  credits: number;
  totalXPEarned: number;
  Account_id: number;
}

export type DashboardResponse = {
  total_profits: { current: number; difference: string };
  hints: { current: number; difference: string };
  lives: { current: number; difference: string };
  tournament: { current: number; difference: string };
  transactions: FinanceApiResponse[];
  chart: {
    labels: string[];
    values: number[];
    unit: string;
  };
};

export interface TransactionModalProps {
  onClose: () => void;
  transactionData: TransactionApiResponse[];
}

export interface TransactionApiResponse {
  id: number,
  amount: string,
  payment_gateway: string,
  currency: string,
  account: { id: number, name: string },
  created_at: string,
  status: string,
  item_purchased: string,
}

export interface FinanceData {
  orderId: string | number;
  accountId: string;
  value: string;
  date: string;
  product: string;
}

export interface FinanceApiResponse {
  id: number;
  account: {
    id: number;
    name: string;
  };
  payment_gateway: string;
  currency: string;
  amount: string;
  created_at: string;
  status: string;
  item_purchased: string;
}

export interface SeasonFormData {
  seasonName: string;
  startDate: string;
  endDate: string;
}

export interface SeasonLevel {
  id: number;
  season: number;
  riddle: number;
  level_number: number;
  riddle_title: string;

}

export interface SeasonLevelProgress {
  level: number;
  id: number;
  title: string;
  status: "completed" | "not_completed";
  hints: number;
  lives: number;
}

export interface SeasonLevelsResponse {
  season_id: number;
  detail: SeasonLevelProgress[];
  average_time: string;
  points: number;
  ranking: number;
  season_title: string;
}

export interface AutoCompleteProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  customClass?: string;
  labelClass?: string;
  errorMessage?: string;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  value?: string;
  onChange?: (value: string) => void;
  isSimpleDropdown?: boolean;
};

export interface SeasonApiData {
  id: number;
  title: string;
  status: string;
  start_date: string;
  end_date: string;
  levels?: SeasonLevel[];
}

export interface UserApiData {
  id: number;
  total_xp_earned: number;
  email: string;
  username: string;
  lives: number | undefined;
  role: string;
  is_active: boolean;
  credits: number;
  account_id: number;
};

export interface UsersTableProps {
  user: UserApiData[];
  isLoading: boolean;
  fetchUsers: () => Awaited<void>;
  setStatus?: Dispatch<SetStateAction<'active' | 'inactive'>>;
  status?: 'active' | 'inactive';
}

export interface CreateSeasonFormData {
  id: number;

  level_id: number;
  title: string

}
export interface CreateSeasonRequest {
  title: string;
  start_date: string;
  end_date: string;
  riddle_ids: number[];
  status?: string;
}

export interface UpdateSeasonRequest {
  title: string;
  start_date: string;
  end_date: string;
  status?: string;
}
export interface CreateTournamentsProps extends RiddlesProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface RiddleGameLayoutProps {
  children: ReactNode;
  lives?: number;
  currentLevel?: number;
  profileInitials?: string;
  balance?: number;
  currency?: string;
  helpers?: string[];
  levelDescription?: string;
  onSubmit?: (solution: string, riddleId: number) => void;
  isLoading?: boolean;
  placeholder?: string;
  riddleId?: number;
  riddleData?: RiddleApiData | null;
  onHintUsed?: (hintType: 'general' | 'intermediate' | 'final') => void;
  gameMode?: 'DAILY' | 'SEASON' | 'TOURNAMENT' | 'OTHER';
  success?: BottomSolveSuccess;
  modeId?: number | null;
  accountId?: string;
  onBalanceUpdate?: (newBalance: number) => void;
}

export interface CommonPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: (() => void) | null;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: (() => void) | null;
}

export interface LevelSuccessProps {
  isOpen: boolean;
  level: number | null;
  onButtonClick: (() => void) | null;
  bottomSolveArea?: React.ReactNode;
}

export interface PopupState {
  isOpen: boolean;
  type: 'hint' | 'correct' | 'incorrect' | 'finish' | null;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: (() => void) | null;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: (() => void) | null;

}

interface DailyRiddleResponseData {
  riddle?: RiddleApiData;
  user?: {
    lives: number;
    credits: number;
  };
  prev_answers: string[];
  id?: number;
  detail?: string;
}

export interface DailyRiddleResponse {
  status: number;
  message: string;
  data: DailyRiddleResponseData | null;
  errors?: string[] | null;
}

export interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
};

export interface RiddlePageProps {
  profileInitials?: string;
  currency?: string;
}

export interface RiddleLoaderProps {
  riddleId: number;
  riddleData?: RiddleApiData | null;
  handleSolutionSubmit?: (solution: string | null, riddle_id: number, isClickable?: boolean) => unknown;
}

export interface RiddleFiles {
  id: number;
  file: string;
}

export interface RiddleFileContents {
  htmlContent: string | null;
  cssContent: string | null;
  jsContent: string | null;
  backgroundSvgUrl: string | null;
  backgroundPngUrl: string | null;
  backgroundMp4Url: string | null;
  mobileSvgUrl: string | null;
  mobilePngUrl: string | null;
  mobileMp4Url: string | null;
}
export interface SolveFormData {
  solution: string;
}

export interface RiddleSubmissionRequest {
  riddle_id: number;
  solution: solution;
  user_id: string;
}

export interface RiddleSubmissionResponse {
  correct: boolean;
  message: string;
  score?: number;
  lives_remaining?: number;
}

export interface GuestSessionResponse {
  account_id: string;
  access_token: string;
  refresh_token: string;
  credits?: number;
  lives?: number;
}

export interface GuestSessionData {
  account_id: string;
  access_token: string;
  refresh_token: string;
  credits?: number;
  lives?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  isGuest: boolean;
}

export interface ProfileDropdownProps {
  profileInitials: string;
}

export interface PortalProps {
  children: React.ReactNode;
}



export interface UseGuestSessionReturn {
  guestSession: GuestSessionData | null;
  isLoading: boolean;
  hasGuestSession: boolean;
  getGuestInitials: () => string;
}



export interface GuestPlaySubmissionRequest {
  account_id: string;
  riddle_id: number;
  solution?: string;
  started_at: string;
  completed_at: string;
  credits_used: number;
  season?: string;
  tournament?: string;
  other?: boolean | string;
  daily_riddle?: boolean | string,
  mode_id?: number | null;
  queryParam?: string;
  type?: string;
}

export interface URlRiddleData {
  type?: string;
  riddle_id: number;
  started_at: string;
  url: string;
}

export interface GuestPlaySubmissionResponse {
  solved: boolean;
  user?: UserGameData;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}

export interface ApiResponseUser<T> {
  status: number;
  message: string;
  data: T;
  detail: string;
  success: boolean;
  errors: Record<string, string[]> | null;
}

export interface DailyRiddleApiData {
  id: number;
  date: string;
  title: string;
  riddle: number;
  level_id: number;
  assigned_by: number;
}

export interface RiddleApiData {
  id: number;
  level_id?: number;
  level_number?: number;
  title: string;
  solution: solution;
  general_hint: string;
  type?: string;
  intermediate_hint: string;
  final_hint: string;
  files?: Array<{
    id: number;
    file: string;
  }>;
}

export interface UserGameData {
  lives: number;
  credits: number;
}

export interface HintError {
  errors: Record<string, string[]>
  message: string;

}

export interface GuestPlayRiddleResponse {
  riddle: RiddleApiData;
  user: UserGameData;
}

export interface HintDeductionRequest {
  account_id: string;
  riddle?: number;
  mode?: string;
  mode_id?: number | null;
}

export interface AddLivesPayload {
  lives: number;
  credits: number;
}

export interface HintHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintData: HintDeductionResponse | null;
  account_id?: string;
  riddle?: number | null;
  mode?: string;
  mode_id?: number | null;
  lives: number;
  onUpdateLives: (newLives: number, newCredits: number) => void;
}

export interface HintDeductionResponse {
  message?: string;
  hint_type: string;
  price: number;
}

export interface HintData {
  hint_key: string;
  hint: string;
  message?: string;
  user: UserGameData;
}

export interface AddLivesResponse {
  detail: string;
  user: {
    lives: number;
    credits: number;
  }
}

export interface StripeProduct {
  id: number;
  name: string;
  description: string;
  type: string;
  quantity: number;
  price: string;
};

export interface PayPalProduct {
  id: number;
  name: string;
  description: string;
  type: string;
  quantity: number;
  price: string;
}

export interface PayPalCapture {
  order_id: string;
}

export interface PayPalCaptureResponse {
  details: string;
}
export interface StripeCheckoutRequest {
  product_id: number;
  success_url: string;
  cancel_url: string;
  email?: string;
}

export interface StripeCheckoutResponse {
  status: number;
  message: string;
  data: {
    session_id: string;
  };
  errors: null;
}

export interface PayPalCheckoutRequest {
  product_id: number;
  success_url: string;
  cancel_url: string;
}

export interface PayPalCheckoutResponse {
  data: {
    order_id: string;
    approval_url: string;
  }
}

export interface PayPalCaptureResponse {
  data: {
    detail: string;
  }
}

export interface ProductsApiResponse {
  status: number;
  message: string;
  data: StripeProduct[];
  errors: null;
}

export interface ProductCardProps {
  product: StripeProduct;
  isSelected: boolean;
  onSelect: (product: StripeProduct) => void;
}



export interface TournamentPlayRiddleResponse {
  riddle: RiddleApiData;
  user: UserGameData;
  tournament: {
    id: string;
    title: string;
    total_riddles: number;
    current_position: number;
  };
}

export interface TournamentPlaySubmissionRequest {
  account_id: string;
  riddle_id: number;
  solution?: string;
  started_at: string;
  completed_at: string;
  credits_used: number;
  tournament: string;
  mode_id: number;
  extra_param?: string;
}

export interface TournamentPlaySubmissionResponse {
  solved: boolean;
  user?: UserGameData;
  tournament_completed?: boolean;
}

export interface CreateRiddleRequest {
  level_id: number;
  title: string;
  solution: string;
  general_hint: string;
  intermediate_hint: string;
  final_hint: string;
  type: string;
}

export interface UpdateRiddleRequest extends CreateRiddleRequest {
  id: number;
}

export interface ImportRiddles {
  zip_file: File;
  accessToken: string;
}


export interface TournamentLevel {
  id: number;
  tournament: number;
  riddle: number;
  level_number: number;
}

export interface Faqs {
  id: number,
  question: string,
  answer: string,
  active: boolean,
}

export interface FaqsData {
  question: string,
  answer: string,
  active: boolean,
}

export interface FaqTableProps {
  faqs: Faqs[];
  isLoading: boolean;
  fetchFaqs: () => Promise<void>;
}

export interface AddFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: { question: string; answer: string; active: boolean }) => void;
  isSubmitting: boolean;
  selectedFaq: Faqs | null;
}

export interface Level {
  level_number: number,
  id: number,
  riddle_title: string,
  riddle_level_id: number
}

export interface TournamentDetailsApiData {
  id: number,
  levels: Level[]
  prizes: {
    id: number;
    start_rank: number;
    end_rank: number;
    cash_prize: string;
  }[];
}

export interface UpdateLevelsRequest {
  levels_list: {
    riddle_id: number;
    level_number: number
  }[];
}

export interface DailyRiddleData {
  riddle: string,
  date: string,
}

export type DailyRiddlePayload = {
  all_daily_riddles: DailyRiddleData[];
};


export interface User {
  name: string
}
export interface LeaderboardEntry {
  rank: number;
  id: number;
  user: User;
  total_points: number;
  time_played: string;
}

export interface TournamentApiData {
  id: number;
  tournament_id: string;
  title: string;
  paid: string;
  status: string;
  result_status?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  price?: string;
  details?: string;
  levels?: TournamentLevel[];
}

export interface CreateTournamentRequest {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  details: string;
  price: number;
  riddle_ids: number[];
}

export interface UpdateTournamentRequest {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  detail?: string;
  riddle_ids?: number[];
  status?: string | null;
}

export type BottomSolveSuccess = 'True' | 'False' | 'Other'

export interface BottomSolveAreaProps {
  currentLevel?: number | null;
  levelDescription?: string;
  onSubmit?: (solution: string, riddleId: number) => void;
  isLoading?: boolean;
  placeholder?: string;
  riddleId?: number | null;
  riddleData?: RiddleApiData | null;
  success?: BottomSolveSuccess;
  gameMode?: 'DAILY' | 'SEASON' | 'TOURNAMENT' | 'OTHER';
}

export interface CreatePrizeRequest {
  tournament: number;
  start_rank: number;
  end_rank: number;
  cash_prize: number;
}

export interface PrizeResponse {
  id: number;
  start_rank: number;
  end_rank: number;
  cash_prize: string;
}



export interface ApiErrorDetail {
  detail?: string;
  [key: string]: unknown;
}
export interface DistributePrizesResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
  errors?: ApiErrorDetail;
}

export interface RiddleListItem {
  id: number;
  level_id: number;
  title: string;
}

export interface TournamentFormValues {
  title: string;
  description: string;
  price: string;
  startDate: string;
  details: string;
  endDate: string;
}

export interface TournamentInputProps {
  label: string;
  placeholder: string;
  name: keyof TournamentFormValues;
  register: UseFormRegister<TournamentFormValues>;
}

export interface TransformedSeason {
  id: number;
  number: number;
  title: string;
  status: string;
  start_date: string;
  end_date: string;
  levels?: SeasonLevel[];
}

export interface SeasonLevelItem {
  id: number;
  level_number: number;
  riddle_level_id?: number;
  riddle_title?: string;
}

export interface SeasonData {
  id: number;
  title: string;
  status: string;
  start_date: string;
  end_date: string;
  levels?: SeasonLevelItem[];
}

export interface SeasonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface TransformedRiddle {
  id: number;
  level_id: string;
  levelNumber: number;
  title: string;
  solution: solution;
  hint1: string;
  hint2: string;
  hint3: string;
}

export interface RightSidebarProps {
  balance?: number;
  currency?: string;
  helpers?: string[];
  riddleData?: RiddleApiData | null;
  onHintUsed?: (hintType: 'general' | 'intermediate' | 'final') => void;
  gameMode?: 'DAILY' | 'SEASON' | 'TOURNAMENT' | 'OTHER';
  modeId?: number | null;
  accountId?: string;
  tabIndex?: number | null;
  setTabIndex?: Dispatch<SetStateAction<0 | 1 | null>>;
  onBalanceUpdate?: (newBalance: number) => void;
  lives: number;
  onUpdateLives: (newLives: number, newCredits: number) => void;
}

export interface GameCardProps {
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  imageClassName: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface ChoosePathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAsGuest: () => void;
  onPlayAsRegistered: () => void;
}

export interface HeaderProps {
  showGameElements?: boolean;
  lives?: number;
  profileInitials?: string;
  showBorder?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface AdminTableCardProps {
  title: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

export interface SeasonRiddle {
  level: string;
  title: string;
  lives: string;
  hints: string;
  status: string;
  riddleId?: number;
}

export interface SeasonDetailProps {
  seasonId: string;
}

export interface SeasonPlayRequest {
  account_id: string;
  season_id: number;
  level_number?: number;
  current_level_number?: number | null;
}

export interface SeasonPlayResponse {
  riddle: RiddleApiData;
  user: {
    lives: number;
    credits: number;
  };
  prev_answers: string[];
  detail?: string;
}

export interface TourPlayRequest {
  account_id: string;
  tour_id: number;
}

export interface TourPlayResponse {
  riddle: RiddleApiData;
  user: {
    lives: number;
    credits: number;
  };
  prev_answers: string[];
  detail?: string;
}

export interface SeasonPlayPageProps {
  params: Promise<{
    id: string;
  }>;
}