import { Node } from "../page";
import { CpuRing } from "./cpuRing";
import { MemoryRing } from "./memoryRing";
import TableItem, { ResizeableTable } from "./tableItem";
import { useRef } from "react";
export type ring = {
  radius: number;
  circumfrence: number;
  strokeDashoffset: number;
};

export function formatBytesToBinary(bytes: number): string {
  if (bytes < 0) {
    return "Bytes value cannot be negative";
  }

  if (bytes === 0) {
    return "0 Bytes";
  }

  const units: string[] = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB"];
  let i: number = Math.floor(Math.log(bytes) / Math.log(1024));
  i = i > units.length - 1 ? units.length - 1 : i;
  const num: string = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${num} ${units[i]}`;
}

export function addTrailignN(millicores: number): string {
  if (millicores < 0) {
    return "cores cant be negative";
  }
  return `${millicores}n`;
}

export function convertNanocoresToMillicores(nanocores: number): string {
  // Check if the input is a number
  if (typeof nanocores !== "number") {
    throw new Error("Input must be a number");
  }

  // Convert nanocores to millicores and add "M" to indicate millicores
  const millicores = Math.floor((nanocores / 1_000_000) * 100) / 100;
  return millicores + "m";
}

export function NodeCard(data: Node) {
  const cpuPercent = Math.floor((data._cpu_utilization / data._cpu) * 100);
  const memoryPercent = Math.floor(
    (data._memory_utilization / data._memory) * 100,
  );
  const headers = ["Name", "Namespace", "CPU", "Memory"];
  const container = useRef<HTMLDivElement>(null)
  return (
    <div className="flex min-w-[1700px] max-w-[1700px] items-center justify-center">
      <div className="min-w-[1700px] rounded border-2 border-stone-600 p-5 shadow-lg">
        <div className="flex flex-row justify-center">
          <div className="felx flex-col">
            <p> Node Name: {data._name} </p>
            <p> Pods: {data._kube_pod_list.length} </p>
          </div>
          <svg width="150" height="100" viewBox="0 -20 100 100">
            <CpuRing
              cpu={data._cpu_utilization}
              cpuCapacity={data._cpu}
            ></CpuRing>
            <MemoryRing
              memory={data._memory_utilization}
              memoryCapacity={data._memory}
            ></MemoryRing>
          </svg>
          <div className="flex flex-col">
            <p className="text-green-600">
              {" "}
              CPU: {convertNanocoresToMillicores(data._cpu_utilization)} /{" "}
              {convertNanocoresToMillicores(data._cpu)}
            </p>
            <p className="text-blue-600">
              {" "}
              Memory: {formatBytesToBinary(data._memory_utilization)} /{" "}
              {formatBytesToBinary(data._memory)}
            </p>
          </div>
          <div className="ml-5 flex flex-col">
            <p className="text-green-600"> ({cpuPercent}%) </p>
            <p className="text-blue-600"> ({memoryPercent}%) </p>
          </div>
        </div>
        <div className="max-w-[1650px]" ref={container}>
          <ResizeableTable
            headers={headers}
            minCellWidth={100}
            tableContent={data._kube_pod_list}
            containerDiv={container}
          />
        </div>
      </div>
    </div>
  );
}
