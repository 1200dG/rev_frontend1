import { toast } from "react-toastify";
import api from "../axios";
import { routes } from "../routes";
import { TournamentDetail } from "@/lib/types/common/types";

export async function getAllTournaments() {
  try {
    const response = await api.get(routes.api.tournaments.allTournaments);
    if (response.data) {
      return response.data.data;
    }
  } catch (error) {
    return error;
  }
}

export async function gettournamentDetail(id: string): Promise<TournamentDetail | null> {
  try {
    const response = await api.get(routes.api.tournaments.tournamentDetail(id));
    if (response.data.status === 200) {
      return response.data.data as TournamentDetail;
    } else {
      toast.error("API returned error status:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching tournament detail:", error);
    toast.error("Error fetching tournament details.");
    return null;
  }
}
