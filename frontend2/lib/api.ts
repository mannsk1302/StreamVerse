// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function isFormData(body: any): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    ...(options.body && !isFormData(options.body)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);

    // 🧠 Try to parse JSON safely
    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = { message: "Invalid JSON response", raw: null };
    }

    // 🧠 Log actual request info for debugging
    console.log("🔹 API Request:", url, response.status);

    // 🧠 Handle non-OK responses gracefully
    if (!response.ok) {
      const msg =
        data?.message ||
        `Request failed (${response.status}) from ${url}`;
      console.error("❌ API ERROR:", url, response.status, msg);
      return { success: false, data: null, message: msg };
    }

    return { success: true, data: data?.data || data, message: data?.message || "OK" };
  } catch (err: any) {
    console.error("💥 Fetch error:", err.message);
    return { success: false, data: null, message: err.message || "Network error" };
  }
}




// ✅ User API
export const userAPI = {
  register: (data: FormData) =>
    apiRequest("/users/register", {
      method: "POST",
      headers: {},
      body: data,
    }),

  login: (email: string, password: string) =>
    apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => apiRequest("/users/logout", { method: "POST" }),

  getCurrentUser: () => apiRequest("/users/current-user"),

  refreshToken: () => apiRequest("/users/refresh-token", { method: "POST" }),

  updatePassword: (oldPassword: string, newPassword: string) =>
    apiRequest("/users/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  updateProfile: (data: { fullName: string; email: string }) =>
    apiRequest("/users/update-account", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  updateAvatar: (avatar: FormData) =>
    apiRequest("/users/avatar", {
      method: "PATCH",
      headers: {},
      body: avatar,
    }),

  updateCoverImage: (coverImage: FormData) =>
    apiRequest("/users/cover-image", {
      method: "PATCH",
      headers: {},
      body: coverImage,
    }),

  getUserProfile: (username: string) => apiRequest(`/users/c/${username}`),

  getWatchHistory: () => apiRequest("/users/history"),
};
// ✅ Video API
export const videoAPI = {
  getAllVideos: (params?: {
    page?: number;
    limit?: number;
    query?: string;
    sortBy?: string;
    sortType?: string;
  }) => {
    const queryString = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 10),
      ...(params.query ? { query: params.query } : {}),
    }).toString();
    return apiRequest(`/videos?${queryString}`, { method: "GET" });
  },

  getVideoById: (id: string) => apiRequest(`/videos/${id}`, { method: "GET" }),
  getChannelVideos: () => apiRequest(`/videos/channel`, { method: "GET" }),
};

// ✅ Dashboard API
export const dashboardAPI = {
  // ✅ Correct: Matches backend
  getChannelStats: () =>
    apiRequest(`/dashboard/stats`, { method: "GET" }),

  // ✅ Fix: Requires channelId param
  getChannelVideos: (channelId: string) =>
    apiRequest(`/dashboard/videos/${channelId}`, { method: "GET" }),
};

// ✅ SUBSCRIPTION API
export const subscriptionAPI = {
  toggleSubscription: (channelId: string) =>
    apiRequest(`/subscriptions/toggle/${channelId}`, {
      method: "POST",
    }),

  getUserSubscriptions: () => apiRequest("/subscriptions"),
};

// ✅ LIKE API
//
export const likeAPI = {
  toggleVideoLike: (videoId: string) =>
    apiRequest(`/likes/toggle/v/${videoId}`, { method: "POST" }),

  toggleCommentLike: (commentId: string) =>
    apiRequest(`/likes/toggle/c/${commentId}`, { method: "POST" }),
};

// ✅ COMMENT API
//
export const commentAPI = {
  // sab comments of ek video
  getVideoComments: (videoId: string) => apiRequest(`/comments/${videoId}`),

  // new comment add karna
  addComment: (videoId: string, content: string) =>
    apiRequest(`/comments/${videoId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  // comment update karna
  updateComment: (commentId: string, content: string) =>
    apiRequest(`/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    }),

  // comment delete karna
  deleteComment: (commentId: string) =>
    apiRequest(`/comments/${commentId}`, { method: "DELETE" }),
};
