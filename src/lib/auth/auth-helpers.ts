import { auth } from "./auth";
import { prisma } from "../../../lib/prisma";
import { UnauthorizedError } from "@/lib/api-errors";

export async function getUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.deletedAt) return null;

  return { userId: user.id, user };
}

export async function getUserOrThrow() {
  const authenticatedUser = await getUser();
  if (!authenticatedUser) throw new UnauthorizedError();

  return {
    userId: authenticatedUser.user.id,
    user: authenticatedUser.user,
  };
}
