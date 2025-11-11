const API_BASE_URL = "https://streamverse-xd5s.onrender.com/api/v1"

function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

async function apiCall(
  endpoint: string,
  options: { method?: string; body?: any; headers?: Record<string, string> } = {},
) {
  const { method = "GET", body, headers = {} } = options
  const token = getAuthToken()

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API Error: ${response.statusText}`)
  }

  return response.json()
}

// Videos
export const getVideos = () => apiCall("/videos")
export const getVideoById = (id: string) => apiCall(`/videos/${id}`)

export const uploadVideo = (data: FormData) => {
  const token = getAuthToken()
  return fetch(`${API_BASE_URL}/videos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  }).then((r) => (r.ok ? r.json() : Promise.reject(r)))
}

// Users
export const registerUser = (userData: {
  username: string
  email: string
  password: string
  avatar?: File
}) => {
  const formData = new FormData()
  formData.append("username", userData.username)
  formData.append("email", userData.email)
  formData.append("password", userData.password)
  if (userData.avatar) {
    formData.append("avatar", userData.avatar)
  }

  return fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    body: formData,
  }).then((r) => r.json())
}

export const loginUser = (email: string, password: string) =>
  apiCall("/users/login", {
    method: "POST",
    body: { email, password },
  })

export const getCurrentUser = () => apiCall("/users/current-user")
export const logoutUser = () => apiCall("/users/logout", { method: "POST" })
export const getUserHistory = () => apiCall("/users/history")

// Likes
export const toggleVideoLike = (videoId: string) => apiCall(`/likes/video/${videoId}`, { method: "PATCH" })

export const toggleCommentLike = (commentId: string) => apiCall(`/likes/comment/${commentId}`, { method: "PATCH" })

export const toggleTweetLike = (tweetId: string) => apiCall(`/likes/tweet/${tweetId}`, { method: "PATCH" })

// Comments
export const getComments = (videoId: string) => apiCall(`/comments/${videoId}`)

export const addComment = (videoId: string, content: string) =>
  apiCall(`/comments/${videoId}`, {
    method: "POST",
    body: { content },
  })

export const updateComment = (commentId: string, content: string) =>
  apiCall(`/comments/${commentId}`, {
    method: "PATCH",
    body: { content },
  })

export const deleteComment = (commentId: string) => apiCall(`/comments/${commentId}`, { method: "DELETE" })

// Playlists
export const getPlaylists = () => apiCall("/playlists")
export const getPlaylistById = (playlistId: string) => apiCall(`/playlists/${playlistId}`)

export const createPlaylist = (name: string, description?: string) =>
  apiCall("/playlists", {
    method: "POST",
    body: { name, description },
  })

export const addVideoToPlaylist = (playlistId: string, videoId: string) =>
  apiCall(`/playlists/${playlistId}/video/${videoId}`, {
    method: "POST",
  })

export const removeVideoFromPlaylist = (playlistId: string, videoId: string) =>
  apiCall(`/playlists/${playlistId}/video/${videoId}`, {
    method: "DELETE",
  })

// Subscriptions
export const getSubscriptions = () => apiCall("/subscriptions/subscribed")

export const toggleSubscription = (channelId: string) =>
  apiCall(`/subscriptions/toggle/${channelId}`, {
    method: "PATCH",
  })

// Tweets
export const getTweets = (userId: string) => apiCall(`/tweets/${userId}`)

export const createTweet = (content: string) =>
  apiCall("/tweets", {
    method: "POST",
    body: { content },
  })

export const updateTweet = (tweetId: string, content: string) =>
  apiCall(`/tweets/t/${tweetId}`, {
    method: "PATCH",
    body: { content },
  })

export const deleteTweet = (tweetId: string) => apiCall(`/tweets/t/${tweetId}`, { method: "DELETE" })

// Dashboard
export const getDashboardStats = () => apiCall("/dashboard/stats")

export const getDashboardVideos = (channelId: string) => apiCall(`/dashboard/videos/${channelId}`)

// Health
export const checkHealth = () => apiCall("/healthcheck")

// Legacy exports
export const login = (email: string, password: string) => loginUser(email, password)

export const register = (username: string, email: string, password: string) =>
  fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  }).then((r) => {
    if (!r.ok) throw new Error("Registration failed")
    return r.json()
  })

export const getUserProfile = () => getCurrentUser()
