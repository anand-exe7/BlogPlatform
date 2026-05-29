import prisma from "../db/db.js";

export async function createDraft(authorId, payload) {
  const blog = await prisma.blog.create({
    data: {
      title: payload.title,
      content: payload.content,
      image: payload.image || null,
      links: payload.links || null,
      author_id: authorId,
      status: "draft"
    },
    include: {
      author: { select: { id: true, name: true, email: true } },
      _count: { select: { likes: true, comments: true } }
    }
  });
  return blog;
}

export async function editDraft(authorId, id, payload) {
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  if (blog.author_id !== authorId) throw new AppError("Not authorized", 403, "FORBIDDEN");
  if (blog.status === "published") throw new AppError("Cannot edit published blogs", 400, "BAD_REQUEST");
  if (blog.status === "pending_review") throw new AppError("Cannot edit blog while under review", 400, "BAD_REQUEST");

  const updated = await prisma.blog.update({
    where: { id },
    data: {
      title: payload.title,
      content: payload.content,
      image: payload.image || blog.image,
      links: payload.links || null,
      status: blog.status === "rejected" ? "draft" : blog.status
    }
  });
  return updated;
}

export async function deleteBlog(authorId, id) {
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  if (blog.author_id !== authorId) throw new AppError("Not authorized", 403, "FORBIDDEN");

  await prisma.blog.delete({
    where: { id }
  });
  return { success: true };
}

export async function submitForReview(authorId, id) {
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  if (blog.author_id !== authorId) throw new AppError("Not authorized", 403, "FORBIDDEN");
  if (blog.status !== "draft") throw new AppError("Can only submit drafts for review", 400, "BAD_REQUEST");

  await prisma.blog.update({
    where: { id },
    data: { status: "pending_review" }
  });
  return true;
}

export async function getByAuthor(authorId) {
  return prisma.blog.findMany({
    where: { author_id: authorId },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      links: true,
      status: true,
      created_at: true,
      updated_at: true,
      rejection_reason: true,
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    }
  });
}

export async function getPublishedBlogs(userId = null) {
  const blogs = await prisma.blog.findMany({
    where: { status: "published" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  if (!userId) return blogs.map(b => ({ ...b, userLiked: false }));

  // Efficiently check likes for all fetched blogs
  const userLikes = await prisma.like.findMany({
    where: {
      user_id: userId,
      blog_id: { in: blogs.map(b => b.id) }
    },
    select: { blog_id: true }
  });

  const likedBlogIds = new Set(userLikes.map(l => l.blog_id));

  return blogs.map(b => ({
    ...b,
    userLiked: likedBlogIds.has(b.id)
  }));
}

export async function getBlogById(id, userId = null) {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    }
  });

  if (!blog) return null;

  let userLiked = false;
  if (userId) {
    const like = await prisma.like.findUnique({
      where: {
        blog_id_user_id: {
          blog_id: id,
          user_id: userId,
        },
      },
    });
    userLiked = !!like;
  }

  return { ...blog, userLiked };
}
