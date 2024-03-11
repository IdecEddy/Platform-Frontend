export default function CardTitle({children} : {children: React.ReactNode}) {
  return (
    <h3 className="font-bold">
      { children }
    </h3>
  );
}
