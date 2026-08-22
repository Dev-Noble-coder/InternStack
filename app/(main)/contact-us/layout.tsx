import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with InternStack. Have questions about partnerships, the SIWES process, or need support? We are here to help you deploy your career.',
  alternates: {
    canonical: '/contact-us',
  },
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
