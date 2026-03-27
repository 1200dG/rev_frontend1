import api from "../axios";
import { SeasonPlayRequest, SeasonPlayResponse, SeasonLevelsResponse } from "../types/common/types";
import { GamehubResponseData, ApiResponse } from "../types/gamehub";

export async function fetchGamehubData(
  state: "active" | "archive" = "active"
): Promise<GamehubResponseData> {
  try {
    const res = await api.get<ApiResponse<GamehubResponseData>>(`gamehub/?state=${state}`);

    if (res.data.status === 200) {
      return res.data.data;
    }

    throw new Error(res.data.message || "Failed to load gamehub data");
  } catch (error) {
    console.error("Error fetching gamehub data:", error);
    throw error;
  }
}

export async function getActiveSeasonLevels(): Promise<SeasonLevelsResponse> {
  try {
    const response = await api.get<ApiResponse<SeasonLevelsResponse>>("season/levels/");
    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to fetch active season levels");
  } catch (error) {
    console.error("Error fetching active season levels:", error);
    throw error;
  }
}

export async function playSeasonRiddle(seasonPlayData: SeasonPlayRequest): Promise<SeasonPlayResponse> {
  try {
    const response = await api.post<ApiResponse<SeasonPlayResponse>>(
      "season-play/",
      seasonPlayData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && response.data.status === 200) {
      return response.data.data;
    }
    throw new Error(response.data?.message || "Failed to start season play");
  } catch (error) {
    console.error("Error starting season play:", error);
    throw error;
  }
}
