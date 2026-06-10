import prisma from "../db/db.js";
import { AppError } from "../utils/AppError.js";

export async function toggleLike(blogId, userId) {
  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  if (blog.status !== "published") throw new AppError("Blog not available", 400, "BAD_REQUEST");

  const existingLike = await prisma.like.findUnique({
    where: {
      blog_id_user_id: {
        blog_id: blogId,
        user_id: userId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
    const count = await prisma.like.count({ where: { blog_id: blogId } });
    return { liked: false, count };
  } else {
    await prisma.like.create({
      data: { blog_id: blogId, user_id: userId },
    });
    const count = await prisma.like.count({ where: { blog_id: blogId } });
    return { liked: true, count };
  }
}

export async function getBlogLikes(blogId, userId = null) {
  const count = await prisma.like.count({ where: { blog_id: blogId } });
  let userLiked = false;
  
  if (userId) {
    const like = await prisma.like.findUnique({
      where: {
        blog_id_user_id: {
          blog_id: blogId,
          user_id: userId,
        },
      },
    });
    userLiked = !!like;
  }

  return { count, userLiked };
}

export async function addComment(blogId, userId, content, parentId = null) {
  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  if (blog.status !== "published") throw new AppError("Blog not available", 400, "BAD_REQUEST");

  // If parentId is provided, verify it exists and is for the same blog
  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent) throw new AppError("Parent comment not found", 404, "NOT_FOUND");
    if (parent.blog_id !== blogId) throw new AppError("Invalid parent comment", 400, "BAD_REQUEST");
  }

  const comment = await prisma.comment.create({
    data: { blog_id: blogId, user_id: userId, content, parent_id: parentId },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  return comment;
}

export async function getBlogComments(blogId) {
  // We fetch comments flattened but with parent info, 
  // or we could fetch root comments with included replies.
  // For 2 levels, we fetch root comments (parent_id: null) and their replies.
  return prisma.comment.findMany({
    where: { 
      blog_id: blogId,
      parent_id: null // Root comments
    },
    include: {
      user: { select: { id: true, name: true } },
      replies: {
        include: {
          user: { select: { id: true, name: true } }
        },
        orderBy: { created_at: "asc" }
      }
    },
    orderBy: { created_at: "desc" },
  });
}

export async function deleteComment(commentId, userId, isAdmin = false) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new AppError("Comment not found", 404, "NOT_FOUND");
  if (comment.user_id !== userId && !isAdmin) {
    throw new AppError("Not authorized to delete this comment", 403, "FORBIDDEN");
  }

  await prisma.comment.delete({ where: { id: commentId } });
  return true;
}

export async function getUserStats(userId) {
  const [blogCount, likesGiven, commentsCount] = await Promise.all([
    prisma.blog.count({ where: { author_id: userId, status: "published" } }),
    prisma.like.count({ where: { user_id: userId } }),
    prisma.comment.count({ where: { user_id: userId } }),
  ]);

  return { blogCount, likesGiven, commentsCount };
}

export async function getPlatformStats() {
  const [totalUsers, totalBlogs, totalPublished, totalLikes, totalComments, publishedBlogs] = await Promise.all([
    prisma.user.count({ where: { role: "member", status: "approved" } }),
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "published" } }),
    prisma.like.count(),
    prisma.comment.count(),
    prisma.blog.findMany({
      where: { status: "published" },
      select: { content: true },
    }),
  ]);

  const totalWords = publishedBlogs.reduce((sum, blog) => {
    if (!blog.content) return sum;
    return sum + blog.content.trim().split(/\s+/).filter(Boolean).length;
  }, 0);

  return { totalUsers, totalBlogs, totalPublished, totalLikes, totalComments, totalWords };
}
