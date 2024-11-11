
import { signIn, getProviders } from 'next-auth/react';
import type { GetServerSideProps } from 'next';
import { useState } from 'react';
import Button from '@/src/components/ui/Button';

const SignIn = ({ providers }: { providers: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Invalid email or password.');
      //setError(result.error);
    } else {
      // Redirect or do something after successful sign-in
      console.log("Logged in successful")
      window.location.href = "/app";

    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl">Sign In</h1>

      <form onSubmit={handleCredentialsSignIn} className="mb-4">
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit">Sign in with Credentials</Button>
      </form>

      {Object.values(providers).map((provider: any) => {
        if (provider.id === 'credentials') return null;
        return (
          <Button key={provider.name} onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </Button>
        );
      })}
      <p>
        Don`&apos;`t have an account?{' '}
        <link href="/auth/signup" className="text-blue-500">Sign up here</link>
      </p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;

