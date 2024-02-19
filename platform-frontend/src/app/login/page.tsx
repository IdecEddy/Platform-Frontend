import React from "react";
import { api } from "~/trpc/server";
import { cookies } from "next/headers";

const LoginPage: React.FC = () => {
  async function setCookie(formData: FormData) {
    "use server";
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    if (email != undefined && password != undefined) {
      const data = await api.auth.login.mutate({
        email: email,
        password: password,
      });
      cookies().set({
        name: "auth-token",
        value: data,
        httpOnly: true,
        secure: false,
      });
    }
  }
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-blue-200">
      <h2 className="mb-10 mb-4 text-5xl font-medium leading-6 text-gray-900">
        Login To Platform
      </h2>
      <div className="rounded-lg bg-white p-8 shadow-md">
        <form action={setCookie}>
          <div className="mt-1">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              defaultValue={""}
              className={`
                mt-1
                block
                w-full
                rounded-md
                border
                border-gray-300
                px-3
                py-2
                shadow-sm
                focus:border-indigo-500
                focus:outline-none
                focus:ring-indigo-500
                sm:text-sm`}
              required
            />
          </div>
          <div className="mt-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              defaultValue={""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mt-2">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
