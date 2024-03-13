export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="m-6 w-80 rounded-lg border p-5 shadow">{children}</div>;
}
