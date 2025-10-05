import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ business, pageTitle, pageDescription }) => {
  const title = pageTitle || `Book Appointment - ${business?.name || 'Beauty Studio'}`;
  const description = pageDescription || 
    `Book an appointment at ${business?.name || 'Beauty Studio'}. Professional ${business?.category || 'beauty'} services in ${business?.region || 'your area'}.`;
  const image = business?.coverImage || '/images/default-business-image.jpg';

  // Structured data for LocalBusiness
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business?.name || "Beauty Studio",
    "description": business?.description || description,
    "url": window.location.origin,
    "telephone": business?.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business?.location?.address || "123 Main Street",
      "addressLocality": business?.region || "Your City",
      "addressCountry": "US"
    },
    "openingHours": business?.businessHours?.map(day => 
      day.isOpen ? `${day.day} ${day.open}-${day.close}` : `${day.day} closed`
    ) || ["Mo-Fr 09:00-18:00", "Sa 10:00-17:00"],
    "priceRange": "$$",
    "category": business?.category || "Beauty Salon",
    "image": image,
    "sameAs": business?.instagramLink ? [business.instagramLink] : []
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`booking, appointment, ${business?.category || 'beauty'}, ${business?.region || 'services'}`} />
      <meta name="author" content={business?.name || 'Beauty Studio'} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={business?.name || 'Beauty Studio'} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#8b5cf6" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={window.location.href} />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* App-specific meta tags */}
      <meta name="application-name" content={business?.name || 'Beauty Studio'} />
      <meta name="apple-mobile-web-app-title" content={business?.name || 'Beauty Studio'} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Booking-specific meta tags */}
      <meta name="booking:service" content={business?.category || 'beauty services'} />
      <meta name="booking:location" content={business?.region || 'your area'} />
      <meta name="booking:price-range" content="$$" />
    </Helmet>
  );
};

export default SEOHead;
