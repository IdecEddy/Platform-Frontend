export default function PanelUi({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full w-full flex-row p-24">{children}</div>;
}
