import CheckOutForm from "@/components/checkout-form";
import { auth } from "@/lib/auth";
import { protectUserRoute } from "@/lib/auth-guard";
import { signInPath } from "@/lib/path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const CheckOutPage = async () => {
  const sessions = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessions) {
    redirect(signInPath);
  }

  const session = await protectUserRoute();

  const userId = session?.user.id || "";

  return <CheckOutForm userId={userId} />;
};

export default CheckOutPage;
