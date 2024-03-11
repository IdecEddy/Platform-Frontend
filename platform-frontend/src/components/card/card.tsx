export default function Card({children}:{children : React.ReactNode}) {
  return (
    <div className="p-5 w-80 border rounded-lg shadow m-12">
      { children }
    </div>
  );
}
