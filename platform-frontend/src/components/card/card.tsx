export function Card({ children }: { children: React.ReactNode }) {
  return <div className="m-6 w-80 rounded-lg border p-5 shadow">{children}</div>;
}

export function CardContnet({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 h-14">{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="h-24">{children}</div>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="mt-0.5 text-gray-500">{children}</p>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-bold">{children}</h3>;
}

export function CardInfo({
  label,
  info,
}: {
  label: React.ReactNode;
  info: React.ReactNode;
}) {
  return (
    <div className="mt-1">
      <label className="font-bold">
        {label}
        <span className="font-normal"> {info}</span>
      </label>
    </div>
  );
}

export function CardButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="mt-5 rounded-md bg-blue-500 p-2 font-bold text-white">
      {children}
    </button>
  );
}
