import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="text-3xl mb-4">404 - Page Not Found</h1>
      <Link href="/" className="text-blue-600 underline">Go to Home</Link>
    </div>
  );
}

