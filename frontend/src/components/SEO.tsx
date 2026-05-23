import { defaultSEO } from "@/utils/seoConfig";
import Script from 'next/script';

export default function SEO({ props }: { props: any }) {
    const seo = { ...defaultSEO, ...props };

    // ✅ Full URL
    const fullUrl = seo.url
        ? `${defaultSEO.baseUrl.replace(/\/$/, "")}${seo.url}`
        : defaultSEO.baseUrl;

    // ✅ Images
    const imageUrl = seo.image || defaultSEO.image;
    const ogImageUrl = seo.ogImage || defaultSEO.ogImage || imageUrl;

    // ✅ Title format
    const finalTitle = seo.title.includes(seo.siteName)
        ? seo.title
        : `${seo.title} | ${seo.siteName}`;

    return (
        <>
            {/* ================= BASIC ================= */}
            <meta charSet={seo.charset || "UTF-8"} />
            <title>{finalTitle}</title>
            <meta name="description" content={seo.description} />

            {seo.keywords && <meta name="keywords" content={seo.keywords} />}
            <meta name="author" content={seo.author} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="application-name" content={seo.appName} />

            {/* ================= ROBOTS ================= */}
            <meta
                name="robots"
                content={`${seo.noIndex
                    ? "noindex,nofollow"
                    : seo.noFollow
                        ? "index,nofollow"
                        : "index,follow"
                    }, max-image-preview:large`}
            />
            <meta name="googlebot" content="index,follow" />

            {/* ================= CANONICAL ================= */}
            <link rel="canonical" href={fullUrl} />

            {/* ================= ALTERNATE ================= */}
            {seo.alternateLanguages?.map((lang: any, i: number) => (
                <link key={i} rel="alternate" hrefLang={lang.hrefLang} href={lang.href} />
            ))}

            {/* ================= OPEN GRAPH ================= */}
            <meta property="og:type" content={seo.ogType || "website"} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content={seo.siteName} />
            <meta property="og:image" content={ogImageUrl} />
            <meta property="og:image:alt" content={seo.ogImageAlt} />
            <meta property="og:image:type" content={seo.ogImageType || "image/jpeg"} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content={seo.locale || "en_US"} />

            {/* Article meta */}
            {seo.publishedTime && (
                <meta property="article:published_time" content={seo.publishedTime} />
            )}
            {seo.updatedTime && (
                <meta property="article:modified_time" content={seo.updatedTime} />
            )}

            {/* ================= TWITTER ================= */}
            <meta name="twitter:card" content={seo.twitterCard || "summary_large_image"} />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={ogImageUrl} />
            <meta name="twitter:site" content={seo.twitterSite} />
            <meta name="twitter:creator" content={seo.twitterCreator} />
            <meta name="twitter:label1" content="Written by" />
            <meta name="twitter:data1" content={seo.author} />

            {/* ================= PERFORMANCE ================= */}
            {seo.preload?.map((item: any, i: number) => (
                <link key={i} rel="preload" as={item.as} href={item.href} />
            ))}

            {seo.preconnect?.map((url: string, i: number) => (
                <link key={i} rel="preconnect" href={url} />
            ))}

            {seo.prefetch?.map((url: string, i: number) => (
                <link key={i} rel="dns-prefetch" href={url} />
            ))}

            {/* ================= PWA ================= */}
            <meta name="theme-color" content={seo.themeColor} />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-title" content={seo.appName} />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />

            <link rel="manifest" href={seo.manifest} />
            <link rel="icon" href={seo.favicon} />
            <link rel="icon" sizes="16x16" href={seo.favicon} />
            <link rel="icon" sizes="32x32" href={seo.favicon} />
            <link rel="apple-touch-icon" sizes="180x180" href={seo.appleTouchIcon} />

            {/* Microsoft */}
            <meta name="msapplication-TileColor" content={seo.themeColor} />
            <meta name="msapplication-TileImage" content={seo.favicon} />

            {/* ================= GEO ================= */}
            {seo.geoRegion && <meta name="geo.region" content={seo.geoRegion} />}
            {seo.geoPlace && <meta name="geo.placename" content={seo.geoPlace} />}

            {/* ================= REFERRER ================= */}
            <meta name="referrer" content={seo.referrer} />

            {/* ================= VERIFICATION ================= */}
            {seo.googleVerification && (
                <meta name="google-site-verification" content={seo.googleVerification} />
            )}
            {seo.bingVerification && (
                <meta name="bing-verification" content={seo.bingVerification} />
            )}

            {/* ================= STRUCTURED DATA ================= */}

            {/* Organization */}
            <Script
                id="seo-organization"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: seo.organization.name,
                        url: seo.organization.url,
                        logo: seo.organization.logo,
                        sameAs: seo.organization.sameAs,
                    }),
                }}
            />

            {/* Website */}
            <Script
                id="seo-website"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        name: seo.siteName,
                        url: fullUrl,
                    }),
                }}
            />

            {/* WebPage */}
            <Script
                id="seo-webpage"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: finalTitle,
                        url: fullUrl,
                        description: seo.description,
                    }),
                }}
            />

            {/* Breadcrumb */}
            <Script
                id="seo-breadcrumb"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            {
                                "@type": "ListItem",
                                position: 1,
                                name: "Home",
                                item: defaultSEO.baseUrl,
                            },
                            ...(seo.url
                                ? [
                                    {
                                        "@type": "ListItem",
                                        position: 2,
                                        name: seo.title,
                                        item: fullUrl,
                                    },
                                ]
                                : []),
                        ],
                    }),
                }}
            />

            {/* Article Schema */}
            {seo.type === "article" && (
                <Script
                    id="seo-article"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Article",
                            headline: seo.title,
                            description: seo.description,
                            image: ogImageUrl,
                            author: {
                                "@type": "Organization",
                                name: seo.organization.name,
                            },
                            publisher: {
                                "@type": "Organization",
                                name: seo.organization.name,
                                logo: {
                                    "@type": "ImageObject",
                                    url: seo.organization.logo,
                                },
                            },
                            mainEntityOfPage: fullUrl,
                        }),
                    }}
                />
            )}

            {/* FAQ Schema */}
            {seo.faq && (
                <Script
                    id="seo-faq"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: seo.faq.map((f: any) => ({
                                "@type": "Question",
                                name: f.q,
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: f.a,
                                },
                            })),
                        }),
                    }}
                />
            )}
        </>
    );
}