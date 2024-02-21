"use client";

export default function LoginPage({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-blue-200">
      <div>
        <h2 className="mb-10 mb-4 text-5xl font-medium text-gray-900">
          Login To Platform
        </h2>
      </div>
      <div className="rounded-lg bg-white p-8 shadow-md">
        {children}
      </div>
    </div>
  );
} 
