'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from 'zod'
import axios, { AxiosError } from "axios";
import https from "https";

// Setting some global values.
const API_URL = process.env.AUTH_API_URL;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

if (!API_URL) {
  throw new Error(
    "AUTH_API_URL environment variable is not set. Application will not start.",
  );
}

const LOGIN_ENDPOINT = API_URL + "login";
const VALIDATE_ENDPOINT = API_URL + "verify_token";


const userLogin = z.object({
  email: z.string().email(),
  password: z.string().min(2, "String must be longer then 1 character.")
})

export async function login(formData: FormData) {
  // Validate the users inputs. Return errors object if any are found.
  const validatedFields = userLogin.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });
  if (!validatedFields.success) { 
    return { errors: validatedFields.error.flatten().fieldErrors }
  }
  // Send login details to auth api
  const body = {
    email: formData.get("email"),
    password: formData.get("password"),
    audience: "platform-frontend",
  };
  const httpsAgent = new https.Agent({
    rejectUnauthorized: IS_PRODUCTION, 
  });
  try {
    const response = await axios.post(LOGIN_ENDPOINT, body, { httpsAgent });
    const authToken = response.data.authToken;
    const refreshToken = response.data.refreshToken;
    cookies().set("refresh-token", refreshToken, { httpOnly: true, secure: false, sameSite: "lax" });
    return { status: 200, authToken: authToken }
  } catch (error) {
    console.log(error)
    return { errors: {"request": ["Login failed please try again"] }}
  }
}

export async function validateToken(authToken: string | null) {
  const refreshToken = cookies().get("refresh-token");
  if ( !refreshToken && !authToken ) {
    redirect("/login");
  }

  let body = {
    authToken: authToken,
    refreshToken: refreshToken?.value,
    audience: "platform-frontend"
  }
  const httpsAgent = new https.Agent({
    rejectUnauthorized: IS_PRODUCTION, 
  });
  try {
    let response = await axios.post(VALIDATE_ENDPOINT, body, { httpsAgent })
    if(response.data.status == 301) {
      console.log("Had to use refreshToken retrying auth")
      body.authToken = response.data.authToken
      response = await axios.post(VALIDATE_ENDPOINT, body, { httpsAgent })
    }
    console.log(response.data.message)
    return { status: 200, authToken: response.data.authToken }
  } catch (error) {
    console.log(error)
    redirect("/login");
  }

  return { status: 200 }
}
