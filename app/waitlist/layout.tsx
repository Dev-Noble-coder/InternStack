import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shortlisting in Progress',
  description: 'Join the InternStack 2026 SIWES waitlist today. Be the first to get access to our AI CV builder, automatic logbook entries, and verified company directory.',
  alternates: {
    canonical: '/waitlist',
  },
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
