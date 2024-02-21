'use client';
export default function Error({
  children,
}: {
  children: React.ReactNode
}) {
  return(
    <div className="p-2 mt-5 border-2 border-red-300 rounded-md bg-red-200 cursor-defaultv ">
      <p className="text-red-800">Error: {children}</p>
    </div>
  )
}
