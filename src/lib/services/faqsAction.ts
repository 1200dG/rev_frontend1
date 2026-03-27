import { toast } from "react-toastify";
import api from "../axios";
import { handleApiError } from "../errorHandler";
import { routes } from "../routes";
import { FaqsData } from "../types/common/types";

export const getFaqs = async () => {
  try {
    const response = await api.get(routes.api.faqs.list);
    if (response.data) {
      return response.data.data;
    }
  } catch (error) {
    return error;
  }
};

export async function addFaqs(faqData: FaqsData): Promise<void> {
  try {
    const response = await api.post(routes.api.faqs.create, faqData);
    if (response.data) {
      toast.success("Faq Created Successfully")
      return response.data.data;
    }
    throw new Error("Unexpected response format: missing faqs input (question/answer/isActive).");

  } catch (error) {
    console.error("Error adding Faqs:", error);
    throw new Error("An unexpected error occurred while adding the faqs.");
  }

}

export async function updateFaqs(id: number, faqData: FaqsData): Promise<void> {
  try {
    const response = await api.patch(routes.api.faqs.update(id), faqData);
    if (response.data) {
      toast.success("Faq Updated Successfully");
      return response.data.data;
    }
    throw new Error("Unexpected response format: missing faqs input (question/answer/isActive).");

  } catch (error) {

    console.error("Error updating Faqs:", error);
    throw new Error("An unexpected error occurred while updating the faqs.");
  }

}

export async function deleteFaqs(id: number): Promise<void> {
  try {
    const response = await api.delete(routes.api.faqs.delete(id));
    if (response.data) {
      toast.success("FAQ Deleted Successfully");
      return response.data.data;
    }
    throw new Error("Unexpected response format: missing faqs input (question/answer/isActive).");

  } catch (error) {

    console.error("Error deleting Faqs:", error);
    throw new Error("An unexpected error occurred while deleting the faqs.");
  }

}