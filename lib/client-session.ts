import { authClient } from "@/lib/auth-client";

export const clientSession = () => {
  const { data: session } = authClient.useSession();

  return session;
};
