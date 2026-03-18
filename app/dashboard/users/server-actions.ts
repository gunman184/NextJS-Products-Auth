import { cookies } from "next/headers";
import axios from "axios";

async function getAxiosServerInstance() {
  const cookieStore = await cookies(); // await cookies() here
  const accessToken = cookieStore.get("jwt")?.value ?? "";

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5010",
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });
}

export async function getUsers() {
  const axiosInstance = await getAxiosServerInstance();
  const res = await axiosInstance.get("/users");
  return res.data;
}

export async function deleteUser(userId: string) {
  const axiosInstance = await getAxiosServerInstance();
  await axiosInstance.delete(`/users/${userId}`);
}

export async function deleteUsersBulk(userIds: string[]) {
  const axiosInstance = await getAxiosServerInstance();
  await Promise.all(userIds.map(id => axiosInstance.delete(`/users/${id}`)));
}
