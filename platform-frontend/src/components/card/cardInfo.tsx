import { ReactNode } from "react";

export default function CardInfo({label, info} : {label: React.ReactNode, info: ReactNode}) {
  return (
  <div className="mt-1"> 
    <label className="font-bold">{label}<span className="font-normal"> {info}</span></label>
  </div>
  )
}
