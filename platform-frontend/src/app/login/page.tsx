import React from "react";
import LoginPage from "./login";
import Form from "./form";

const Page: React.FC = () => {
  return (
    <div>
      <LoginPage>
        <Form />
      </LoginPage>
    </div>
  );
};

export default Page;
