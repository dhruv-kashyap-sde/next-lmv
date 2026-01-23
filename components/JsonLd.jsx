// JSON-LD Structured Data for SEO
// These components render schema.org structured data for search engines

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://lootmyvouchers.in';

// Organization Schema - for the main website/company
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Loot My Vouchers',
    alternateName: 'LMV',
    url: BASE_URL,
    logo: `${BASE_URL}/icons/icon-512x512.png`,
    description: 'Claim free vouchers daily from top brands and earn rewards. Discover exclusive deals, discount codes, and special offers.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@lootmyvouchers.in',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      // Add your social media links here
      // 'https://twitter.com/lootmyvouchers',
      // 'https://facebook.com/lootmyvouchers',
      // 'https://instagram.com/lootmyvouchers',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Website Schema - for search box and site links
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Loot My Vouchers',
    alternateName: 'LMV',
    url: BASE_URL,
    description: 'Claim free vouchers daily from top brands and earn rewards.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/vouchers?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema - for navigation hierarchy
export function BreadcrumbSchema({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${BASE_URL}${item.url}` : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Offer/Voucher Schema - for individual vouchers
export function VoucherSchema({ voucher, brand }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: voucher.title,
    description: voucher.description,
    category: voucher.category?.name || 'Voucher',
    offeredBy: {
      '@type': 'Organization',
      name: brand?.name || 'Various Brands',
    },
    priceSpecification: voucher.minOrder ? {
      '@type': 'PriceSpecification',
      minPrice: voucher.minOrder,
      priceCurrency: 'INR',
    } : undefined,
    validThrough: voucher.expiryDate,
    availability: 'https://schema.org/InStock',
    url: `${BASE_URL}/vouchers`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema - for FAQ sections
export function FAQSchema({ faqs }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ItemList Schema - for voucher listings
export function VoucherListSchema({ vouchers }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Available Vouchers',
    description: 'Browse and claim free vouchers from top brands',
    numberOfItems: vouchers.length,
    itemListElement: vouchers.slice(0, 10).map((voucher, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Offer',
        name: voucher.title,
        description: voucher.description,
        category: voucher.category?.name || 'Voucher',
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Local Business Schema (if applicable)
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'OnlineBusiness',
    name: 'Loot My Vouchers',
    url: BASE_URL,
    logo: `${BASE_URL}/icons/icon-512x512.png`,
    description: 'Online platform for claiming free vouchers and discount codes from top brands.',
    priceRange: 'Free',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
