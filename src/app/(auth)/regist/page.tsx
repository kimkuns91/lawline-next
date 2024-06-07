import RegistForm from "@/components/form/RegistForm";
import { authOptions } from "@/libs/next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RegistPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <RegistForm />
  );
}