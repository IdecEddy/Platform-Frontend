"use client";
import { useState, useEffect } from "react";
import Error from "./error";
import { login } from "~/actions/auth";
import { redirect } from "next/navigation";
export default function Form() {
  const [errors, setErrors] = useState({});
  async function submitData(formData: FormData) {
    setErrors({});
    const ret = await login(formData);
    if (ret && ret.errors) {
      setErrors(ret.errors);
    }
    if (ret && ret.status == 200) {
      redirect("/panel");
    }
  }
  return (
    <div>
      <form action={submitData}>
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
        <div className="mt-2">
          <button
            type="submit"
            className={`
              flex
              w-full
              justify-center
              rounded-md
              border
              border-transparent
              bg-indigo-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              shadow-sm
              hover:bg-indigo-700
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:ring-offset-2`}
          >
            Submit
          </button>
        </div>
      </form>
      {Object.keys(errors).length > 0 &&
        Object.entries(errors).map(([field, errorMessages], index) => (
          <div key={index}>
            {errorMessages.map((message, messageIndex) => (
              <Error key={messageIndex}>
                {field}: {message}
              </Error>
            ))}
          </div>
        ))}
    </div>
  );
}
