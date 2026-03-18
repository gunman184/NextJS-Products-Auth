// app/dashboard/users/actions/userActions.ts
"use server";

import { deleteUser as serverDeleteUser, deleteUsersBulk as serverDeleteUsersBulk } from "../server-actions";

// Server actions callable from client components
export async function deleteUserAction(userId: string) {
  await serverDeleteUser(userId);
}

export async function deleteUsersBulkAction(userIds: string[]) {
  await serverDeleteUsersBulk(userIds);
}
