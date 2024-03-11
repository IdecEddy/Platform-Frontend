export default function CardDescription({children} : {children: React.ReactNode}){
  return (
    <p className="text-gray-500 mt-0.5">
      {children}
    </p>
  );
}
