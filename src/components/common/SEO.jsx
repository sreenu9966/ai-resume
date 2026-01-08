import React from 'react';
import { Helmet } from 'react-helmet-async';

export function SEO({ title, description, keywords, image }) {
    const siteTitle = "ResumeGen";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDescription = "Build professional, ATS-friendly resumes in minutes with ResumeGen using AI.";
    const defaultImage = "/dashboard-preview.png";

    return (
        <Helmet>
            {/* Standard Metrics */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="google-site-verification" content="GXttG2QSNxi9KOtmA7HE32Y51djbjpzFcjbtsW9-b58" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />
        </Helmet>
    );
}
