import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const cleanBaseURL = baseURL?.endsWith('/') ? baseURL.slice(0, -1) : baseURL;

const api = axios.create({
  baseURL: cleanBaseURL,
  timeout: 15000,
});

const publicEndpoints = ["signup/", "login/", "guest-login/"];

const getAccessToken = async () => {
  const session = await getSession();
  if (session?.user?.access_token) {
    return session.user.access_token;
  }

  if (typeof window !== 'undefined') {
    try {
      const guestSessionCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('guest_session='));

      if (guestSessionCookie) {
        const guestSessionValue = guestSessionCookie.split('=')[1];
        const guestSession = JSON.parse(decodeURIComponent(guestSessionValue));
        return guestSession.access_token;
      }
    } catch (error) {
      console.error("Failed to parse guest session from cookie:", error);
    }
  }
  return null;
};

api.interceptors.request.use(
  async (config) => {
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint),
    );

    if (config.url?.includes("admin-panel/") || config.url?.includes("product/") || config.url?.includes("stripe/")) {
      const session = await getSession();

      if (!session || !session.user?.access_token) {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }
        return Promise.reject(new Error('Authentication required'));
      }

      config.headers.Authorization = `Bearer ${session.user.access_token}`;
      config.headers["Accept"] = "application/json";

      const isFormData = config.data instanceof FormData;
      if (!isFormData && !config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      } else if (isFormData) {
        delete config.headers["Content-Type"];
      }
    } else if (!isPublicEndpoint) {
      const accessToken = await getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        await signOut({ redirect: false });
        try {
          document.cookie = 'guest_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        } catch (e) {
          console.error('Failed to clear guest session cookie:', e);
        }
        window.location.href = '/auth/sign-in';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
