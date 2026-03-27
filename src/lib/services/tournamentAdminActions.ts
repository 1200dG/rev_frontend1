import api from "../axios";
import { routes } from "../routes";
import { 
  TournamentApiData, 
  CreateTournamentRequest, 
  UpdateTournamentRequest, 
  ApiResponse 
} from "../types/common/types";

export async function getAllTournamentsAdmin(): Promise<TournamentApiData[]> {
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

export async function createTournament(tournamentData: CreateTournamentRequest): Promise<TournamentApiData> {
  try {
    const response = await api.post<ApiResponse<TournamentApiData>>(
      routes.api.admin.tournaments.create,
      tournamentData
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to create tournament");
  } catch (error) {
    throw error;
  }
}

export async function updateTournament(tournamentId: string, tournamentData: Omit<UpdateTournamentRequest, 'tournament_id'>): Promise<TournamentApiData> {
  try {
    const numericId = parseInt(tournamentId.replace(/[^0-9]/g, '')) || 1;
    const response = await api.put<ApiResponse<TournamentApiData>>(
      routes.api.admin.tournaments.update(numericId.toString()),
      { ...tournamentData, tournament_id: tournamentId }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to update tournament");
  } catch (error) {
    throw error;
  }
}

export async function deleteTournament(tournamentId: string): Promise<void> {
  try {
    const numericId = parseInt(tournamentId.replace(/[^0-9]/g, '')) || 1;
    const response = await api.delete<ApiResponse<null>>(routes.api.admin.tournaments.delete(numericId));
    if (response.data && response.data.status === 200) {
      return;
    }
    throw new Error(response.data?.message || "Failed to delete tournament");
  } catch (error) {
    throw error;
  }
}

export async function getTournamentById(tournamentId: string): Promise<TournamentApiData> {
  try {
    const numericId = parseInt(tournamentId.replace(/[^0-9]/g, '')) || 1;
    const response = await api.get<ApiResponse<TournamentApiData>>(routes.api.admin.tournaments.update(numericId.toString()));
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch tournament");
  } catch (error) {
    throw error;
  }
}

export async function updateTournamentStatus(tournamentId: string, status: string): Promise<TournamentApiData> {
  try {
    const numericId = parseInt(tournamentId.replace(/[^0-9]/g, '')) || 1;
    const response = await api.put<ApiResponse<TournamentApiData>>(
      routes.api.admin.tournaments.update(numericId.toString()),
      { status }
    );

    if (response.data && (response.data.status === 200 || response.data.status === 201)) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to update tournament status");
  } catch (error) {
    throw error;
  }
}
