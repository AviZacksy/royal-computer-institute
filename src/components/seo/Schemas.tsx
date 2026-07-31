import React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://royalcomputerinstitute.com";

// EducationalOrganization / School Schema
export function EducationalOrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    "name": "Royal Computer Institute",
    "url": SITE_URL,
    "logo": `${SITE_URL}/images/logo.png`,
    "image": `${SITE_URL}/images/og-default.jpg`,
    "description": "Royal Computer Institute is the leading IT and Computer coaching center in Motihari, East Champaran, Bihar. We offer DCA, ADCA, Tally Prime with GST, Python, and Web Development courses.",
    "telephone": "+918709322301",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Road, Near Court",
      "addressLocality": "Motihari",
      "addressRegion": "Bihar",
      "postalCode": "845401",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.6575,
      "longitude": 84.9126
    },
    "sameAs": [
      "https://www.facebook.com/royalcomputerinstitute",
      "https://www.instagram.com/royalcomputerinstitute"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema
interface FAQ {
  question: string;
  answer: string;
}

export function FAQSchema({ faqs }: { faqs: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Course Schema
interface CourseDetails {
  name: string;
  description: string;
  duration: string;
  providerName?: string;
}

export function CourseSchema({ name, description, duration, providerName = "Royal Computer Institute" }: CourseDetails) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": name,
    "description": description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": providerName,
      "sameAs": SITE_URL
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Offline",
      "duration": duration,
      "courseWorkload": "Daily 1-2 hours"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
