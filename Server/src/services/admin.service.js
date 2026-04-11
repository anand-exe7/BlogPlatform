import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPendingUsers() {
  return prisma.user.findMany({
    where: { status: 'pending' },
    select: { id: true, name: true, email: true, reg_no: true, year: true, domain: true, ref_code: true, created_at: true },
    orderBy: { created_at: 'desc' }
  });
}

export async function approveUser(id) {
  const user = await prisma.user.update({ 
    where: { id }, 
    data: { status: 'approved' } 
  });

  return { message: 'User approved successfully', user: { id: user.id, email: user.email, status: user.status } };
}
