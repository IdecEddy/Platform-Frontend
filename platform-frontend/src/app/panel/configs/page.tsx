"use client";
import React, { useEffect, useState } from "react";
import { validateRefreshToken, validateAuthToken } from "~/actions/auth";
import { getUsersKubeConf } from "~/actions/kubeconf";
import Card from "~/components/card/card";
import CardContnet from "~/components/card/cardContent";
import CardDescription from "~/components/card/cardDescription";
import CardInfo from "~/components/card/cardInfo";
import CardTitle from "~/components/card/cardTitle";
import { DesktopNav } from "~/components/navbar";
import PanelUi from "~/components/panelUi/page";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { postKubeConf } from "~/actions/kubeconf";
import Error from "~/components/errors/errors";
const Panel: React.FC = () => {
  type DataItem = {
    config_data: String;
    config_label: String;
    config_user: String;
    config_server: String;
    config_description: String;
    user_id: Number;
    id: Number;
  };
  interface FormErrors {
    [field: string]: string[];
  }
  const activeNavItem = "Configs";
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [data, setData] = useState<DataItem[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [open, setOpen] = useState(false);
  async function submitData(formData: FormData){
    setErrors({});
    let submitable = true
    for (const item in formData.values) {
      if (!item.trim()) {
        submitable = false
      }
    }
    const ret = await postKubeConf(formData, authToken);
    if ( ret && ret.errors) {
      setErrors(ret.errors);
      console.log(ret.errors);
    }
    if (ret && ret.status == 200) {
      if(submitable) {
        setOpen(false)
      }
      console.log("we did it");
    }
  }

  useEffect(() => {
    async function authenticate() {
      let token = authToken;
      if (token) {
        const authResponse = await validateAuthToken(token);
        if (authResponse.status === 200) {
          setLoggedIn(true);
          return;
        }
      }

      // If the authToken is not valid or doesn't exist, try to refresh it
      const refreshResponse = await validateRefreshToken();
      if (
        refreshResponse &&
        refreshResponse.authToken &&
        refreshResponse.authToken != null
      ) {
        setAuthToken(refreshResponse.authToken);
        // Since token is reassigned from refreshResponse.authToken, it's guaranteed to be not null here
        const authResponse = await validateAuthToken(refreshResponse.authToken);
        if (authResponse.status === 200) {
          setLoggedIn(true);
          return;
        }
      }
      setLoggedIn(false);
    }
    authenticate();
    // If the code reaches this point, authentication has failed
    const interval = setInterval(authenticate, 30000);

    return () => clearInterval(interval);
  }, [authToken]);

  useEffect(() => {
    async function getUsersConfs() {
      if (authToken && authToken != null) {
        const confsReturn = await getUsersKubeConf(authToken);
        setData(confsReturn);
      }
    }
    getUsersConfs();
  }, [authToken]);

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>No configuration data available.</p>
      </div>
    );
  }
  // if we do have data then we are going to show this ui.
  if (loggedIn == true) {
    return (
      <div className="flex flex-row">
        <DesktopNav activeItem={activeNavItem} />
        <PanelUi>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
              <Card>
                <div className="flex justify-center items-center">
                  <Image
                    src={"/images/add_icon.png"}
                    width={150}
                    height={150}
                    alt="Add a config"/>
                </div>
              </Card>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add a configuration file </SheetTitle>
                <SheetDescription>
                  Fill out this form to create a new kubernetes configuration file used to manage new clusters.
                </SheetDescription>
              </SheetHeader>                
                <form action={submitData} className="flex flex-col gap-4 mt-4">
                  <label className='font-bold' htmlFor="label">Cluster Label</label>
                  <input
                    type="text"
                    id="label"
                    name="label"
                    required={true}
                    className="border-2 border-gray-200 rounded-md p-2"
                  />
                  <label className='font-bold' htmlFor="description">Cluster Description</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    required={true}
                    className="border-2 border-gray-200 rounded-md p-2"
                  />
                  <label className='font-bold'htmlFor="configFile">Config File</label>
                  <input
                    type="file"
                    id="kubeConfFile"
                    name="kubeConfFile"
                    required={true}
                    className="border-2 border-gray-200 rounded-md p-2"
                  />
                  <button type="submit" className="bg-blue-500 text-white rounded-md p-2 font-bold">Submit</button>
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
            </SheetContent>
          </Sheet>
          {data.map((kubeConf, index) => (
            <Card key={index}>
              <CardTitle>{kubeConf.config_label}</CardTitle>
              <CardDescription>{kubeConf.config_description}</CardDescription>
              <CardContnet>
                <CardInfo label="Cluster Name:" info={kubeConf.config_server} />
                <CardInfo label="User Name:" info={kubeConf.config_user} />
              </CardContnet>
            </Card>
          ))}
        </PanelUi>
      </div>
    );
  }
};
export default Panel;
