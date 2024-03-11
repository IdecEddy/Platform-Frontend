export default function PanelUi({ children }: { children: React.ReactNode }) {
  return(
    <div className="w-full h-full flex flex-row p-24">
      { children }
    </div> 
  )
}
