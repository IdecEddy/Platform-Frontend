"use client";
import { handler } from "./handler";
import config from "~/config/flags";

export default function sandbox() {
  if (config.sandbox === true) {
   return (
    <div>
      <form action={handler}>
        <input type="text" name="name" />
        <button type="submit"> Submit </button>
      </form>
    </div>
    );
  } else {
    return (
      <p> This is behind a flag </p>
    )
  }
}
