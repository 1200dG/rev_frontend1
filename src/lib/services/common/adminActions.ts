import api from "../../axios";
import { routes } from "../../routes";
import {
  RiddleApiData,
  TournamentApiData,
  SeasonApiData,
  CreateRiddleRequest,
  UpdateRiddleRequest,
  CreateTournamentRequest,
  UpdateTournamentRequest,
  CreateSeasonRequest,
  ApiResponse,
  DailyRiddleApiData,
  Level,
  TournamentDetailsApiData,
  LeaderboardEntry,
  DistributePrizesResponse,
  CreatePrizeRequest,
  PrizeResponse,
  CustomPrizeResponse,
  RiddleListItem,
  UpdateSeasonRequest,
  UserApiData,
  ApiResponseUser,
  ImportRiddles,
  UpdateLevelsRequest,
  DailyRiddleData,
  DailyRiddlePayload,
  SeasonData,
} from "../../types/common/types";
import { Seasons } from "../../types/admin";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "@/lib/errorHandler";
import { SaveLevelsResponse } from "@/lib/types/admin/common";

export async function getAllDailyRiddles(): Promise<DailyRiddleApiData[]> {
  try {
    const response = await api.get<ApiResponse<DailyRiddleApiData[]>>("admin-panel/daily-riddles/");
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch daily riddles");
  } catch (error) {
    throw error;
  }
}

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
      formData.append(key, value.toString());
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
      toast.success("Riddle created successfully");
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to create riddle");
  } catch (error) {
    throw error;
  }
}

export async function importRiddles({ zip_file, accessToken }: ImportRiddles) {
  try {
    const formData = new FormData();
    formData.append("zip_file", zip_file);

    const response = await api.post(
      routes.api.admin.riddles.import,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
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
      toast.success("Riddle updated successfully");
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to update riddle");
  } catch (error) {
    throw error;
  }
}

export const saveRiddleOrder = async (id: number, updateList: UpdateLevelsRequest): Promise<SaveLevelsResponse> => {
    try {
        const response = await api.post<ApiResponse<SaveLevelsResponse>>(routes.api.admin.seasons.updateRiddleLevels(id), updateList);
        if (response.data && (response.data.status === 200 || response.data.status === 201)) {
            toast.success("Levels saved successfully");
            return response.data.data;
        }
        throw new Error(response.data?.message || "Failed to save riddle order");
    } catch (error: unknown) {
        console.error(" Error in saveRiddleOrder:", error);
        throw error;
    }
};

export const createDailyRiddle = async (daileRiddleList: DailyRiddlePayload): Promise<void> => {
  try {
    const response = await api.post<ApiResponse<void>>(
      routes.api.admin.dailyRiddles.create,
      daileRiddleList
    );
    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      toast.success("Levels saved successfully");
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to save riddle order");
  } catch (error: unknown) {
    console.error(" Error in saveRiddleOrder:", error);
    throw error;
  }
}

export const saveLevelOrder = async (id: number, updateList: UpdateLevelsRequest): Promise<SaveLevelsResponse> => {
    try {
        const response = await api.post<ApiResponse<SaveLevelsResponse>>(routes.api.admin.tournaments.updateRiddleLevels(id), updateList);
        if (response.data && (response.data.status === 200 || response.data.status === 201)) {
            toast.success("Levels saved successfully");
            return response.data.data;
        }
        throw new Error(response.data?.message || "Failed to save riddle order");
    } catch (error: unknown) {
        console.error(" Error in saveRiddleOrder:", error);
        throw error;
    }
};

export const handleDeleteRiddleFromDropdown1 = async (id?: number): Promise<void> => {
  try {
    const response = await api.delete(`/admin-panel/riddles/${id}/`);
    if (response.data && (response.data.status === 200 || response.data.status === 204)) {
      toast.success("Riddle deleted successfully");
      return;
    }
  } catch (error: unknown) {
    console.error("Failed to delete riddle:", error);
    throw error;
  }
};

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

export async function getAllTournaments(): Promise<TournamentApiData[]> {
  try {
    const response = await api.get<ApiResponse<TournamentApiData[]>>(routes.api.admin.tournaments.list);
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch tournaments");
  } catch (error) {
    throw error;
  }
}

export async function getTournamentLeaderboard(tournamentId: number): Promise<LeaderboardEntry[]> {
  try {
    const response = await api.get<ApiResponse<LeaderboardEntry[]>>(`leaderboard/${tournamentId}/`);
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch tournament leaderboard");
  } catch (error) {
    throw error;
  }
}




export async function getTournamentDataById(id: number | string): Promise<TournamentDetailsApiData> {
  try {
    const response = await api.get<ApiResponse<TournamentDetailsApiData>>(
      `/admin-panel/clash/${id}`
    );

    if (response.data && response.data.status === 200) {
      return response.data.data;
    }

    throw new Error(response.data?.message || `Failed to fetch tournament with ID ${id}`);
  } catch (error) {
    console.error("Error fetching tournament by ID:", error);
    throw error;
  }
}


export async function createTournament(tournamentData: CreateTournamentRequest): Promise<TournamentApiData> {
  try {
    const response = await api.post<ApiResponse<TournamentApiData>>(
      routes.api.admin.tournaments.create,
      tournamentData
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      toast.success("Tournament created successfully");
      return response.data.data;
    }
    const errmeesage = response.data?.message || "Failed to create tournament"
    throw new Error(response.data?.message || "Failed to create tournament");
  } catch (error) {
    throw error;
  }
}

export async function duplicateTournament(id: number): Promise<CreateTournamentRequest> {
  try {
    const res = await api.get<ApiResponseUser<CreateTournamentRequest>>(routes.api.admin.tournaments.duplicate(id))

    if (res.data && res.data.success) {
      return res.data.data
    }

    throw new Error("Failed to get duplicate ")
  } catch (error) {
    handleApiError(error, "Failed to duplicate Tournament");
    throw error;
  }
}

export async function updateTournament(tournamentId: string, tournamentData: UpdateTournamentRequest): Promise<TournamentApiData> {
  try {
    const response = await api.patch<ApiResponse<TournamentApiData>>(
      routes.api.admin.tournaments.update(tournamentId),
      tournamentData
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      toast.success("Tournament updated successfully");
      return response.data.data;
    }
    toast.error(response.data?.errors?.riddle[0] || "Failed to update tournament");
    throw new Error(response.data?.message || "Failed to update tournament");
  } catch (error) {
    throw error;
  }
}

export async function distributePrizes<T>(
  clashId: number,
): Promise<DistributePrizesResponse<T>> {
  try {
    const response = await api.post<DistributePrizesResponse<T>>(
      `/admin-panel/clash/${clashId}/distribute-prizes/`,
    );

    if (response.status === 200 || response.status === 201) {
      toast.success("Prizes distributed successfully");
      return response.data;
    }

    throw new Error(response.data?.message || "Failed to distribute prizes");
  }
  catch (error) {
    throw error;
  }
}

export async function getAddRiddleList(numericId: number): Promise<RiddleListItem[]> {
  try {
    const response = await api.get<ApiResponse<RiddleListItem[]>>(
      `/add-riddle-list?tournament_id=${numericId}`
    );

    if (response.data && response.data.status === 200) {
      return response.data.data;
    }

    throw new Error(response.data?.message || "Failed to fetch riddle list");
  } catch (error) {
    console.error("Error in getAddRiddleList:", error);
    throw error;
  }
}

export async function getSeasonRiddleList(numericId: number): Promise<RiddleListItem[]> {
  try {
    const response = await api.get<ApiResponse<RiddleListItem[]>>(
      `/add-riddle-list?season_id=${numericId}`
    );

    if (response.data && response.data.status === 200) {
      return response.data.data;
    }

    throw new Error(response.data?.message || "Failed to fetch riddle list");
  } catch (error) {
    console.error("Error in getAddRiddleList:", error);
    throw error;
  }
}

export async function addRiddlesToClash(
  clashId: number,
  riddleIds: number[]
): Promise<unknown> {
  try {
    const payload = { riddle_ids: riddleIds };

    const response = await api.patch(`/admin-panel/clash/${clashId}/`, payload);

    if (response.data && response.data.status === 200) {
      toast.success("Riddles added to clash successfully");
      return;
    }

    throw new Error(response.data?.message || "Failed to add riddles to clash");
  } catch (error) {
    console.error(" Error in addRiddlesToClash:", error);
    throw error;
  }
}


type ApiErrorResponse = { message?: string };

export async function createCustomPrize(
  clashId: number,
  payload: CreatePrizeRequest
): Promise<PrizeResponse> {
  try {
    const response = await api.post(`/admin-panel/clash/${clashId}/prizes/`, payload);
    const data = response.data;
    if (data && data.id) {
      return data as PrizeResponse;
    }

    if (data?.data && data.data.id) {
      return data.data as PrizeResponse;
    }
    throw new Error("Unexpected response format: missing prize details (id/start_rank/etc).");
  } catch (error: unknown) {
    console.error("Error creating prize:", error);

    handleApiError(error, "Failed to update prize. Please try again.");
    throw new Error("An unexpected error occurred while updating the prize.");
  }
}

export async function deleteTournamentLevel(
  tournamentId: number,
  levelId: number
): Promise<void> {
  try {
    const payload = { riddle_id: levelId };

    const response = await api.post(
      `/admin-panel/clash/${tournamentId}/remove-riddle/`,
      payload
    );

    if (response.status !== 200 && response.status !== 204) {
      const message =
        (response.data as { message?: string })?.message ||
        "Failed to delete tournament level";
      throw new Error(message);
    }
  } catch (error: unknown) {
    throw error;
  }
}

export async function getCustomPrizes(clashId: number): Promise<CustomPrizeResponse> {
  try {
    const response = await api.get(`/admin-panel/clash/${clashId}/prizes/`);

    const payload = response.data?.data || response.data;

    if (payload?.prizes) {
      return payload;
    }

    throw new Error("Unexpected response structure");
  } catch (error) {
    console.error("Error fetching custom prizes:", error);
    throw error;
  }
}

export async function deleteCustomPrize(
  tournamentId: number,
  prizeId: number
): Promise<void> {
  try {
    const response = await api.delete(
      `/admin-panel/clash/${tournamentId}/prizes/${prizeId}/`
    );

    if (response.status === 200 || response.status === 204) {
      toast.success("Prize deleted successfully");
      return;
    }

    console.error("Unexpected response while deleting prize:", response);
    throw new Error("Failed to delete prize");
  } catch (error: unknown) {
    console.error("Error fetching custom prizes:", (error as AxiosError)?.response || error);
    const axiosError = error as AxiosError;
    const data = axiosError?.response?.data;
    throw axiosError;
  }
}

export async function updateCustomPrize(
  clashId: number,
  prizeId: number,
  payload: CreatePrizeRequest
): Promise<PrizeResponse> {
  try {
    const response = await api.put<PrizeResponse>(
      `/admin-panel/clash/${clashId}/prizes/${prizeId}/`,
      payload
    );

    if (response.status === 200 || response.status === 204) {
      toast.success("Prize updated successfully");
      // Some APIs return data, some don't
      return response.data ?? {
        id: prizeId,
        start_rank: payload.start_rank,
        end_rank: payload.end_rank,
        cash_prize: payload.cash_prize.toString(),
      };
    }
    const errorData = response.data as unknown as { message?: string };
    throw new Error(errorData?.message || "Failed to update prize");
  } catch (error: unknown) {
    handleApiError(error, "Failed to update prize. Please try again.");
    throw new Error("An unexpected error occurred while updating the prize.");
  }
}

export async function deleteTournament(id: number): Promise<void> {
  try {
    const response = await api.delete<ApiResponse<null>>(routes.api.admin.tournaments.delete(id));
    if (response.data && response.data.status === 200) {
      toast.success("Tournament deleted successfully");
      return;
    }
    throw new Error(response.data?.message || "Failed to delete tournament");
  } catch (error) {
    throw error;
  }
}

export async function getTournamentById(tournamentId: string): Promise<TournamentApiData> {
  const numericId = parseInt(tournamentId.replace(/[^0-9]/g, '')) || parseInt(tournamentId);

  try {
    const response = await api.get<ApiResponse<TournamentApiData>>(
      routes.api.admin.tournaments.update(numericId.toString())
    );
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch tournament");
  } catch (error) {
    console.error('Error fetching tournament:', error);
    throw error;
  }
}

export async function updateTournamentStatus(tournamentId: string, status: string): Promise<TournamentApiData> {
  try {
    const numericId = parseInt(tournamentId.replace(/[^0-9]/g, '')) || parseInt(tournamentId);

    const response = await api.patch<ApiResponse<TournamentApiData>>(
      routes.api.admin.tournaments.update(numericId.toString()),
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      toast.success("Tournament status updated successfully");
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to update tournament status");
  } catch (error) {
    throw error;
  }
}

export async function getAllSeasons(): Promise<SeasonData[]> {
  try {
    const response = await api.get<ApiResponse<SeasonData[]>>(routes.api.admin.seasons.list);
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch seasons");
  } catch (error) {
    throw error;
  }
}

export async function createSeason(seasonData: CreateSeasonRequest): Promise<SeasonApiData> {
  try {
    const { status, ...createData } = seasonData;

    const response = await api.post<ApiResponse<SeasonApiData>>(
      routes.api.admin.seasons.create,
      createData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      toast.info("Season Created Successfuly!")
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to create season!");
  } catch (error) {
    throw error;
  }
}

export async function updateSeasonData(
  seasonId: number,
  seasonData: UpdateSeasonRequest
): Promise<SeasonApiData> {
  try {
    const { status, ...updateData } = seasonData;

    const response = await api.put<ApiResponse<SeasonApiData>>(
      routes.api.admin.seasons.update(seasonId),
      updateData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      toast.info("Season Data Updated Successfuly")
      return response.data.data;
    }

    throw new Error(response.data?.message || "Failed to update season");
  } catch (error) {
    throw error;
  }
}


export async function deleteSeason(id: number): Promise<void> {
  try {
    const response = await api.delete<ApiResponse<SeasonApiData>>(routes.api.admin.seasons.delete(id));

    if (response.status === 204 || (response.data && response.data.status === 200)) {
      toast.success("Season deleted successfully");
      return;
    }

    throw new Error(response.data?.message || "Failed to delete season");
  } catch (error) {
    throw error;
  }
}

export async function getSeasonById(id: number): Promise<SeasonData> {
  try {
    const response = await api.get<ApiResponse<SeasonData>>(routes.api.admin.seasons.update(id));
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch season");
  } catch (error) {
    throw error;
  }
}

export async function updateSeason(id: number, updateData: { status?: string; riddle_ids?: number[], force?: boolean }): Promise<SeasonApiData> {
  try {
    const response = await api.patch<ApiResponse<SeasonApiData>>(
      routes.api.admin.seasons.update(id),
      updateData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      toast.success("Season Data updated successfully");
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to update season");
  } catch (error) {
    throw error;
  }
}

export async function updateSeasonStatus(id: number, status: string, seasonData: Seasons): Promise<SeasonApiData> {
  try {
    const response = await api.put<ApiResponse<SeasonApiData>>(
      routes.api.admin.seasons.update(id),
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to update season status");
  } catch (error) {
    return {
      id: seasonData.id,
      title: seasonData.title,
      status: seasonData.status,
      start_date: seasonData.start_date,
      end_date: seasonData.end_date
    };
  }
}

export async function getAllUsers(status: string): Promise<UserApiData[]> {
  try {
    const response = await api.get<ApiResponseUser<UserApiData[]>>(routes.api.admin.users.list(status));

    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.detail || "Failed to fetch Users");

  } catch (error) {
    handleApiError(error, "Error in fetching users data");
    throw error;

  }
}

export async function updateUser(id: number, updateData: Partial<UserApiData>): Promise<UserApiData[]> {
  try {
    const response = await api.put<ApiResponseUser<UserApiData[]>>(routes.api.admin.users.update(id), updateData);

    if (response.data && response.data.success) {
      toast.success("User updated successfully");
      return response.data.data;
    }
    throw new Error(response.data?.detail || "Failed to fetch Users");
  } catch (error) {
    handleApiError(error, "Error in fetching users data");
    throw error;
  }
}

export async function deleteUserbyId(id: number): Promise<void> {
  try {
    const response = await api.delete(routes.api.admin.users.delete(id));

    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data?.detail || "Failed to Delete User");

  } catch (error) {
    handleApiError(error, "Error in deleting user data");
    throw error;

  }
}