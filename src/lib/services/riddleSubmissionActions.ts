import axios from "axios";
import {
  RiddleSubmissionRequest,
  RiddleSubmissionResponse,
  ApiResponse
} from "../types/common/types";

interface solution {
  answer: string
}

export async function submitRiddleSolution(
  riddleId: number,
  solution: solution,
  userId: string
): Promise<RiddleSubmissionResponse> {
  try {
    const submissionData: RiddleSubmissionRequest = {
      riddle_id: riddleId,
      solution: { answer: solution.answer.trim() },
      user_id: userId,
    };

    const response = await axios.post<ApiResponse<RiddleSubmissionResponse>>(
      "/api/riddles/submit",
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
    throw new Error(response.data?.message || "Failed to submit riddle solution");
  } catch (error) {
    throw error;
  }
}
