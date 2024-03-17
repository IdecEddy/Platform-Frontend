export default function PanelUi({ children }: { children: React.ReactNode }) {
  return <div className="p-4 sm:ml-64 flex flex-row flex-wrap p-24">{children}</div>;
}
