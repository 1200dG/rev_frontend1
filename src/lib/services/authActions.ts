import api from "@/lib/axios";
import { routes } from "../routes";
import { ApiResponseUser, ForgotPassword, ResetPassword, SignInFormData, SignUpFormData, SocialSignInData } from "../types/common/types";
import { handleApiError } from "../errorHandler";

export async function signUp(data: SignUpFormData) {
  try {
    const response = await api.post(routes.api.auth.signUp, data);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

export async function verifyEmailAction(token: string) {
  try {
    const response = await api.get(
      `${routes.api.auth.verifyEmail}?token=${token}`,
    );
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

export async function forgotPassword(email: string):Promise<ForgotPassword>{
  try{

    const res = await api.post<ApiResponseUser<ForgotPassword>>(routes.api.auth.forget, {email})
    if (res.data && res.data.success){
      return res.data.data;
    }
    throw new Error ("Error in sending email. PLease try again later!")
  }catch(error){
    throw error;
  }
}

export async function resetPassword(data:ResetPassword, token: string):Promise<ForgotPassword>{
  try{

    const res = await api.post<ApiResponseUser<ForgotPassword>>(
      `${routes.api.auth.resetPassword}?token=${token}`,
      data
    );
    if (res.data && res.data.success){
      return res.data.data;
    }
    throw new Error ("Error in sending email. PLease try again later!")
  }catch(error){
    throw error;
  }
}

export async function signInAction(data: SignInFormData) {
  try {
    const response = await api.post(routes.api.auth.logIn, {
      email_or_username: data.email,
      password: data.password,
    });
    if (response.data) {
      return response;
    }
  } catch (error) {
    handleApiError(error, "Invalid email or password. Please try again.");
    throw error;
  }
}

export async function socialLoginAction(data: SocialSignInData) {
  try {
    const { email, name } = data;
    const response = await api.post(routes.api.auth.socialLogin, {
      email: email,
      name: name,
    });
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
}
export function decodeJWT<T extends Record<string, unknown> = Record<string, unknown>>(token: string): T | null {
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const decoded = atob(payloadBase64);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    handleApiError(error);
    return null;
  }
}

export async function playAsGuestUser() {
  try {
    const response = await api.get(routes.api.auth.guest);
    if (response.data) return response;
  } catch (error) {
    throw error;
  }
}
