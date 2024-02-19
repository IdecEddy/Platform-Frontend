import React from 'react';
import { api } from '~/trpc/server';
import { cookies } from 'next/headers';

const LoginPage: React.FC = () => {
  async function setCookie(formData: FormData) {
    'use server'
    const email = formData.get("email")?.toString()
    const password = formData.get("password")?.toString()
    if (email != undefined && password != undefined){
      const data = await api.auth.login.mutate({
        email: email,
        password: password
      });
      cookies().set({
        name: "auth-token",
        value: data,
        httpOnly: true,
        secure: false
      });
    }
  }
  return (
    <div className="w-full h-screen bg-blue-200 flex flex-col justify-center items-center">
      <h2 className="mb-10 text-5xl leading-6 font-medium text-gray-900 mb-4">
        Login To Platform
      </h2>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form  action={setCookie}>
          <div className='mt-1'>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              defaultValue={""} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className='mt-1'>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              defaultValue={""}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className='mt-2'>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
