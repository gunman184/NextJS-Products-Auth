import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies(); // ⭐ await it
  const token = cookieStore.get("jwt");

  if (token) {
    redirect("/dashboard");
  }

  redirect("/login");
}
