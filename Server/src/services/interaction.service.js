import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError.js";

const prisma = new PrismaClient();

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

export async function addComment(blogId, userId, content) {
  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  if (blog.status !== "published") throw new AppError("Blog not available", 400, "BAD_REQUEST");

  const comment = await prisma.comment.create({
    data: { blog_id: blogId, user_id: userId, content },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  return comment;
}

export async function getBlogComments(blogId) {
  return prisma.comment.findMany({
    where: { blog_id: blogId },
    include: {
      user: { select: { id: true, name: true } },
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
  const [totalUsers, totalBlogs, totalPublished, totalLikes, totalComments] = await Promise.all([
    prisma.user.count({ where: { role: "member", status: "approved" } }),
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "published" } }),
    prisma.like.count(),
    prisma.comment.count(),
  ]);

  return { totalUsers, totalBlogs, totalPublished, totalLikes, totalComments };
}
