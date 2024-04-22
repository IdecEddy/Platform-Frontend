"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { NodeCard } from "./_components/nodeCard";
import  config from "~/config/flags";

export interface Pod {
  _name: string;
  _namespace: string;
  _cpu: number;
  _cpu_limit: number;
  _memory: number;
  _memory_limit: number;
}

export interface Node {
  _name: string;
  _cpu: number;
  _memory: number;
  _cpu_utilization: number;
  _memory_utilization: number;
  _cpu_allocated: number;
  _memory_allocated: number;
  _kube_pod_list: Pod[];
}

export type Cluster = Node[];

const ProgressiveCircle = () => {
  const [authToken, setAuthToken] = useState();
  const [clusterData, setClusterData] = useState<Cluster>([]);
  const getClusterInfo = api.clusters.clusterInfo.useMutation({
    onSuccess(data) {
      setClusterData(data);
    },
  });

  useEffect(() => {
    if (authToken) {
      getClusterInfo.mutate({ authToken: authToken, configId: 2 });
    }
    const interval = setInterval(() => {
      if (authToken) {
        getClusterInfo.mutate({ authToken: authToken, configId: 2 });
      }
    }, 15000);
    return () => {
      clearInterval(interval);
    };
  }, [authToken]);

  const handleAuthTokenChange = (event: any) => {
    setAuthToken(event.target.value);
  };
  if (config.rings === true) {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-stone-900 font-mono">
      {clusterData
        ? clusterData.map((data, index) => (
            <div key={index} className="flex flex-row text-white">
              <NodeCard key={index} {...data}></NodeCard>
            </div>
          ))
        : ""}
      <textarea
        onChange={handleAuthTokenChange}
        className="absolute bottom-5 h-24 w-96 border border-white text-black"
      ></textarea>
    </div>
  );
  }
  else {
    return ( <p> Welcome to the B side </p> )
  }
};

export default ProgressiveCircle;
