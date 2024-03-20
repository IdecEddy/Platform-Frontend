export default function PanelUi({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-row flex-wrap p-24 p-4 sm:ml-64">{children}</div>;
}
