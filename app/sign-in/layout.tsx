import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Login to your InternStack account to track your SIWES applications, manage your logbook, and accelerate your tech career.',
  alternates: {
    canonical: '/sign-in',
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
