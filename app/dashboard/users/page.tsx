/*import UserList from "@/components/users/UserList";

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6">
      <UserList />
    </div>
  );
} */
// app/dashboard/users/page.tsx
import UserList from "@/components/users/UserList";
import { getUsers } from "./server-actions";
import { cookies } from "next/headers";
import { getRolesFromToken } from "@/utils/tokenHelpers";

export default async function UsersPage() {
  let roles: number[] = [];
  const cookieStore = await cookies(); // await here too
  const accessToken = cookieStore.get("jwt")?.value;

  if (accessToken) {
    try {
      roles = getRolesFromToken(accessToken);
    } catch (error) {
      // Handle error appropriately
      console.error("Error parsing token:", error);
      // Optionally, you could redirect, display a message, or set some fallback behavior
      // throw new Error("Invalid token or failed to get roles"); // Example of throwing an error
      roles = []; // or some default behavior in case of an error
    }
  }

  const users = accessToken ? await getUsers() : [];

  return (
    <div className="container mx-auto py-6">
      <UserList initialUsers={users} roles={roles} />
    </div>
  );
}
