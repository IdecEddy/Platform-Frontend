"use server"
import { api } from "~/trpc/server"; 
export async function getAuthToken() {
  const res = await api.auth.validateToken.query()
  return res

}
