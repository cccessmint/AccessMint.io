import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl mb-6 text-center">AccessMint Admin Login</h1>
        <AuthForm />
      </div>
    </div>
  );
}

