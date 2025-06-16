'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="text-3xl mb-4 text-red-600">Something went wrong</h1>
      <p className="text-lg text-gray-700">{error.message}</p>
    </div>
  );
}

