import api from "../axios";
import { routes } from "../routes";
import {
  RiddleApiData,
  CreateRiddleRequest,
  UpdateRiddleRequest,
  ApiResponse,
  GuestPlaySubmissionRequest,
  GuestPlayRiddleResponse,
  HintDeductionRequest,
  HintDeductionResponse,
  TournamentPlayRiddleResponse,
  TournamentPlaySubmissionRequest,
  TournamentPlaySubmissionResponse,
  TourPlayRequest,
  TourPlayResponse,
  DailyRiddleResponse,
  HintData,
  AddLivesPayload,
  AddLivesResponse
} from "../types/common/types";

export async function getAllRiddles(): Promise<RiddleApiData[]> {
  try {
    const response = await api.get<ApiResponse<RiddleApiData[]>>(routes.api.admin.riddles.list);
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch riddles");
  } catch (error) {
    throw error;
  }
}

export async function createRiddle(riddleData: CreateRiddleRequest, files?: File[]): Promise<RiddleApiData> {
  try {
    const formData = new FormData();
    Object.entries(riddleData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append(`files`, file);
      });
    }

    const response = await api.post<ApiResponse<RiddleApiData>>(
      routes.api.admin.riddles.create,
      formData
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to create riddle");
  } catch (error) {
    throw error;
  }
}

export async function updateRiddle(id: number, riddleData: Omit<UpdateRiddleRequest, 'id'>, files?: File[]): Promise<RiddleApiData> {
  try {
    const formData = new FormData();
    const fullData = { ...riddleData, id };
    Object.entries(fullData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append(`files`, file);
      });
    }

    const response = await api.put<ApiResponse<RiddleApiData>>(
      routes.api.admin.riddles.update(id),
      formData
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to update riddle");
  } catch (error) {
    throw error;
  }
}

export async function deleteRiddle(id: number): Promise<void> {
  try {
    const response = await api.delete<ApiResponse<null>>(routes.api.admin.riddles.delete(id));
    if (response.data && response.data.status === 200) {
      return;
    }
    throw new Error(response.data?.message || "Failed to delete riddle");
  } catch (error) {
    throw error;
  }
}

export async function getRiddleById(id: number): Promise<RiddleApiData> {
  try {
    const response = await api.get<ApiResponse<RiddleApiData>>(routes.api.admin.riddles.update(id));
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch riddle");
  } catch (error) {
    throw error;
  }
}



export async function getUserPlayRiddle(accountId: string): Promise<GuestPlayRiddleResponse> {
  try {
    const response = await api.get<ApiResponse<GuestPlayRiddleResponse>>(routes.api.riddles.userPlay(accountId));
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch user play riddle");
  } catch (error) {
    throw error;
  }
}

export async function getDailyRiddle(): Promise<DailyRiddleResponse> {
  try {
    const response = await api.get("/daily-riddle-play/");

    if (response.data) {
      return response.data as DailyRiddleResponse;
    }

    return {
      status: response.status,
      message: response.statusText || "Failed to fetch daily riddle",
      data: null,
      errors: [],
    };
  } catch (error: unknown) {
    type AxiosErrorLike = {
      response?: {
        data?: Partial<DailyRiddleResponse>;
        status?: number;
        statusText?: string;
      };
    };

    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as AxiosErrorLike;
      return {
        status: axiosError.response?.status ?? 500,
        message: axiosError.response?.data?.message ?? axiosError.response?.statusText ?? "Network error",
        data: axiosError.response?.data?.data ?? null,
        errors: axiosError.response?.data?.errors ?? [],
      };
    }

    return {
      status: 500,
      message: error instanceof Error ? error.message : "Unknown error",
      data: null,
      errors: [],
    };
  }
}

export async function submitUserPlaySolution(submissionData: GuestPlaySubmissionRequest) {
  try {
    const response = await api.post(
      routes.api.riddles.userPlaySubmit,
      submissionData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to submit user play solution");
  } catch (error: unknown) {
    
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export async function deductCreditsForHint(deductionData: HintDeductionRequest): Promise<HintDeductionResponse> {
  try {
    const response = await api.post<ApiResponse<HintDeductionResponse>>(
      routes.api.riddles.deductCredits,
      deductionData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to deduct credits for hint");
  } catch (error) {
    throw error;
  }
}

export async function getHintData(payload: HintDeductionRequest): Promise<HintData> {
  try {
    const response = await api.post<ApiResponse<HintData>>(
      routes.api.riddles.getHintData,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch hint data");
  } catch (error) {
    throw error;
  } 
}

export async function addLives(payload: AddLivesPayload): Promise<AddLivesResponse> {
  try {
    const response = await api.post<ApiResponse<AddLivesResponse>>(
      routes.api.riddles.addLives,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch hint data");
  } catch (error) {
    throw error;
  } 
}

export async function getTournamentPlayRiddle(accountId: string, tournamentId: string): Promise<TournamentPlayRiddleResponse> {
  try {
    const response = await api.get<ApiResponse<TournamentPlayRiddleResponse>>(routes.api.tournaments.tournamentPlay(accountId, tournamentId));
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch tournament play riddle");
  } catch (error) {
    throw error;
  }
}

export async function getTourPlayRiddle(tourPlayData: TourPlayRequest): Promise<TourPlayResponse> {
  try {
    const response = await api.post<ApiResponse<TourPlayResponse>>(
      routes.api.tournaments.tourPlay,
      tourPlayData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 202)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch tournament play riddle");
  } catch (error) {
    throw error;
  }
}

export async function submitTournamentPlaySolution(submissionData: TournamentPlaySubmissionRequest): Promise<TournamentPlaySubmissionResponse> {
  try {
    const response = await api.post<ApiResponse<TournamentPlaySubmissionResponse>>(
      routes.api.riddles.userPlaySubmit,
      submissionData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to submit tournament solution");
  } catch (error) {
    throw error;
  }
}
