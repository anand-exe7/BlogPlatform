import { AxiosError } from "axios";
import apiClient from "./api-client";

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  domain?: string;
  reg_no?: string;
  year?: string;
  status?: string;
  created_at?: string;
  is_super_admin?: boolean;
}

export interface AuthResponse {
  token?: string;
  user: User;
  message?: string;
  success?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  blog_id: string;
  user_id: string;
  parent_id?: string;
  created_at: string;
  user: {
    id: string;
    name: string;
  };
  replies?: Comment[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  links?: string;
  status: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  subtitle?: string;
  coverImage?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  userLiked?: boolean;
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const respData = error.response?.data as any;

    if (respData?.error) {
      const err = respData.error;
      if (typeof err === "string") return err;

      if (err.fieldErrors && typeof err.fieldErrors === "object") {
        const messages = Object.values(err.fieldErrors).flat().filter(Boolean);
        if (messages.length) return messages.join("; ");
      }

      if (Array.isArray(err)) return err.join("; ");
      if (err.message) return String(err.message);

      return JSON.stringify(err);
    }

    return respData?.message || error.message || "An error occurred";
  }
  return "An unexpected error occurred";
};

export const authApi = {
  signup: async (data: {
    name: string;
    email: string;
    password: string;
    regNo: string;
    department: string;
    year: number;
    username: string;
  }): Promise<AuthResponse> => {
    const mappedData = {
      name: data.name,
      email: data.email,
      password: data.password,
      reg_no: data.regNo,
      domain: data.department,
      year: data.year.toString(),
    };
    const response = await apiClient.post("/users/register", mappedData);
    return response.data?.data || response.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data?.data || response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get("/auth/me");
    return response.data?.data?.user || response.data?.user || response.data;
  },

  changePassword: async (data: any): Promise<any> => {
    const response = await apiClient.post("/auth/change-password", data);
    return response.data?.data || response.data;
  },
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await apiClient.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data?.url || response.data?.url;
};

export const blogApi = {
  getAllPosts: async (page?: number, limit?: number): Promise<Post[]> => {
    const response = await apiClient.get("/blogs/public", {
      params: { page, limit },
    });
    return response.data?.data?.blogs || response.data?.blogs || [];
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await apiClient.get(`/blogs/public/${id}`);
    return response.data?.data || response.data;
  },

  createPost: async (data: {
    title: string;
    content: string;
    image?: string;
    coverImage?: string;
    links?: string;
    slug?: string;
    excerpt?: string;
    tagSlugs?: string[];
  }): Promise<Post> => {
    const mappedData = {
      title: data.title,
      content: data.content,
      image: data.image || data.coverImage,
      links: data.links || data.slug,
    };
    const response = await apiClient.post("/blogs", mappedData);
    return response.data?.data || response.data;
  },

  updatePost: async (
    id: string,
    data: Partial<Post & { coverImage?: string; excerpt?: string }>,
  ): Promise<Post> => {
    const mappedData = {
      ...data,
      image: data.image || data.coverImage,
    };
    const response = await apiClient.patch(`/blogs/${id}`, mappedData);
    return response.data?.data || response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete(`/blogs/${id}`);
  },

  getMyPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get("/blogs/my");
    return response.data?.data || response.data?.blogs || response.data || [];
  },

  submitPost: async (id: string): Promise<void> => {
    await apiClient.post(`/blogs/${id}/submit`);
  },
};

export const interactionApi = {
  getLikes: async (
    blogId: string,
  ): Promise<{ count: number; userLiked: boolean }> => {
    const response = await apiClient.get(`/likes/${blogId}`);
    return response.data?.data || response.data;
  },

  toggleLike: async (
    blogId: string,
  ): Promise<{ liked: boolean; count: number }> => {
    const response = await apiClient.post(`/like/${blogId}`);
    return response.data?.data || response.data;
  },

  getComments: async (blogId: string): Promise<Comment[]> => {
    const response = await apiClient.get(`/comments/${blogId}`);
    return response.data?.data?.comments || response.data?.comments || [];
  },

  addComment: async (
    blogId: string,
    content: string,
    parentId?: string,
  ): Promise<Comment> => {
    const response = await apiClient.post(`/comment/${blogId}`, {
      content,
      parentId,
    });
    return response.data?.data?.comment || response.data?.comment;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(`/comment/${commentId}`);
  },
};

export const searchApi = {
  searchPosts: async (query: string): Promise<Post[]> => {
    const response = await apiClient.get("/search", {
      params: { q: query },
    });
    return response.data?.results || response.data;
  },
};

export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await apiClient.get("/health");
    return response.data;
  },
};

export const devApi = {
  getAllUsers: async (): Promise<any[]> => {
    const response = await apiClient.get("/dev/users");
    return response.data?.data || [];
  },
  updateUserStatus: async (id: string, status: string): Promise<any> => {
    const response = await apiClient.patch(`/dev/users/${id}/status`, { status });
    return response.data?.data;
  },
};

export const adminApi = {
  getStats: async (): Promise<{
    totalUsers: number;
    pendingUsers: number;
    approvedUsers: number;
    totalBlogs: number;
    pendingBlogs: number;
    totalLikes: number;
    totalComments: number;
  }> => {
    const response = await apiClient.get("/admin/stats");
    return response.data?.data || response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get("/admin/users/all");
    return response.data?.data?.users || response.data?.users || [];
  },

  getPendingUsers: async (): Promise<User[]> => {
    const response = await apiClient.get("/admin/users/pending");
    return response.data?.data?.users || response.data?.users || [];
  },

  approveUser: async (id: string): Promise<any> => {
    const response = await apiClient.patch(`/admin/users/${id}/approve`);
    return response.data?.data || response.data;
  },

  promoteUser: async (id: string): Promise<any> => {
    const response = await apiClient.patch(`/admin/users/${id}/promote`);
    return response.data?.data || response.data;
  },

  demoteUser: async (id: string): Promise<any> => {
    const response = await apiClient.patch(`/admin/users/${id}/demote`);
    return response.data?.data || response.data;
  },

  getBlogs: async (status?: string): Promise<Post[]> => {
    const response = await apiClient.get("/admin/blogs", {
      params: { status },
    });
    return response.data?.data?.blogs || response.data?.blogs || [];
  },

  approveBlog: async (id: string): Promise<any> => {
    const response = await apiClient.patch(`/admin/blogs/${id}/approve`);
    return response.data?.data || response.data;
  },

  rejectBlog: async (id: string, reason: string): Promise<any> => {
    const response = await apiClient.patch(`/admin/blogs/${id}/reject`, {
      reason,
    });
    return response.data?.data || response.data;
  },
};

export const api = apiClient;

export default apiClient;
