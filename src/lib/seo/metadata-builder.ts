import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://royalcomputerinstitute.com";

interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = "",
  ogImage = "/images/og-default.jpg",
  noIndex = false,
}: MetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: "/logo/logo.jpeg",
      shortcut: "/logo/logo.jpeg",
      apple: "/logo/logo.jpeg",
    },
    verification: {
      google: "VZYWBRl2dXNS6zv_NuECZXNs6D0wZwtcF2PXJ_L0YJg",
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Royal Computer Institute",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
