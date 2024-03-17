"use client";
export default function Error({ children }: { children: React.ReactNode }) {
  return (
    <div className="cursor-defaultv mt-5 rounded-md border-2 border-red-300 bg-red-200 p-2 ">
      <p className="text-red-800">Error: {children}</p>
    </div>
  );
}
