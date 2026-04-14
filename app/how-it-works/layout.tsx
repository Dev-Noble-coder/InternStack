import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Understand the 5 simple steps to jumpstart your career with InternStack. Build your profile, generate your CV, find SIWES opportunities, and deploy your career.',
  alternates: {
    canonical: '/how-it-works',
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
