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

  const activeNavItem = "Configs";
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [data, setData] = useState<DataItem[]>([]);

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
