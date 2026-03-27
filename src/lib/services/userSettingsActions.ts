import api from "../axios";
import { routes } from "../routes";
import { SignUpFormData, UserProfileData } from "../types/common/types";

export async function updateUserAction(data: SignUpFormData) {
  try {
    const { username, password, confirm_password } = data;
    const response = await api.put(routes.api.settings.updateUser, {
      username: username,
      password: password,
      confirm_password: confirm_password,
    });
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

export async function checkUserNameAction(username: string) {
  try {
    const response = await api.post(routes.api.settings.checkUserName, {
      username: username,
    });
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

export async function getSettingsAction() {
  try {
    const response = await api.get(routes.api.settings.getSettings);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

export async function getProfileAction() {
  try {
    const response = await api.get(routes.api.profile.getProfile);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

export async function updateProfileAction(data: UserProfileData) {
  try {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('description', data.description);
    formData.append('country', data.country);
    formData.append('display_on_profile', data.display_on_profile.toString());
    formData.append('instagram', data.instagram);
    formData.append('tiktok', data.tiktok);
    formData.append('facebook', data.facebook);
    formData.append('twitter', data.twitter);
    formData.append("username_color", data.username_color);
    formData.append("description_color", data.description_color);

    if (data.background) {
      formData.append('background', data.background);
    }
    const response = await api.patch(routes.api.profile.updateProfile, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}
