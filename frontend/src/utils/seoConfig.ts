export const defaultSEO = {
    // ================= BASIC GLOBAL =================
    author: "AIJobFit",
    siteName: "AIJobFit",
    appName: "AIJobFit",

    // ================= DEFAULT FALLBACK SEO =================
    title: "AIJobFit - Smart Career & Job Matching Platform",
    description:
        "AIJobFit helps you discover the best jobs, build your career, and match with opportunities using AI-powered technology.",
    keywords: "AIJobFit, AI jobs, career platform, job matching, resume builder, hiring platform",
    url: "/",

    // ================= DOMAIN =================
    metadataBase: new URL("https://aijobfit.com"),
    baseUrl: "https://aijobfit.com",

    // ================= LANGUAGE =================
    language: "en",
    locale: "en_IN",
    charset: "UTF-8",

    // ================= CONTACT =================
    email: "support@aijobfit.com",

    // ================= IMAGES =================
    image: "https://aijobfit.com/images/logo/logo.png",
    imageAlt: "AIJobFit",
    imageType: "image/png",

    ogImage: "https://aijobfit.com/images/logo/logo.png",
    ogImageAlt: "AIJobFit",
    ogImageType: "image/png",

    // ================= SOCIAL =================
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterSite: "@aijobfit",
    twitterCreator: "@aijobfit",

    // ================= THEME =================
    themeColor: "#2563eb",

    // ================= GEO =================
    geoRegion: "IN-RJ",
    geoPlace: "Rajasthan, India",

    // ================= PWA =================
    manifest: "/manifest.json",
    favicon: "/icons/icon-192.png",
    appleTouchIcon: "/icons/icon-512.png",

    // ================= ROBOTS =================
    noIndex: false,
    noFollow: false,

    // ================= VERIFICATION =================
    googleVerification: "",
    bingVerification: "",

    // ================= PERFORMANCE =================
    preconnect: [
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
    ],
    prefetch: [],
    preload: [
        {
            href: "/images/logo/logo.png",
            as: "image",
        },
    ],

    // ================= SEO ADVANCED =================
    canonical: "",
    alternateLanguages: [
        { hrefLang: "en-IN", href: "https://aijobfit.com" },
    ],

    // ================= STRUCTURED =================
    organization: {
        name: "AIJobFit",
        url: "https://aijobfit.com",
        logo: "https://aijobfit.com/images/logo/logo.png",

        sameAs: [
            "https://twitter.com/aijobfit",
            "https://facebook.com/aijobfit",
            "https://instagram.com/aijobfit",
            "https://linkedin.com/company/aijobfit",
            "https://youtube.com/@aijobfit",
        ],

        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+91-0000000000",
            contactType: "customer support",
            areaServed: "IN",
            availableLanguage: ["English", "Hindi"],
        },
    },

    // ================= SECURITY =================
    referrer: "origin-when-cross-origin",

    // ================= EXTRA =================
    category: "Career & Jobs",
    tags: ["jobs", "career", "AI", "hiring", "resume"],

    publishedTime: "",
    updatedTime: "",

    trailingSlash: false,
};