const fs = require("fs");

// Define your URLs
const urls = [
  { loc: "https://www.fnoscanner.com/", changefreq: "daily", priority: "1.0" },
  {
    loc: "https://www.fnoscanner.com/about",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/desclaimer",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/contactus",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/privacypolicy",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/option-chain",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/greeks",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/oi-analysis",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/oi-buildup",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/oi-history",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/multi-strike-oi",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/max-pain",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/put-call-ratio",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/call-vs-put-oi",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/atm-premium",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/straddle-premium",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/strangle-premium",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/options/multi-strike-premium",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/futures/long-vs-short",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/futures/price-vs-oi",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/option-chain",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/greeks",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/oi-analysis",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/oi-buildup",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/oi-history",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/multi-strike-oi",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/max-pain",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/put-call-ratio",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/call-vs-put-oi",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/atm-premium",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/straddle-premium",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/strangle-premium",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/currency/multi-strike-premium",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    loc: "https://www.fnoscanner.com/dashboard/strategy-builder",
    changefreq: "daily",
    priority: "1.0",
  },
  // {
  //   loc: "https://www.fnoscanner.com/pricing",
  //   changefreq: "daily",
  //   priority: "1.0",
  // },
];

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString();

// Create XML string
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

urls.forEach((url) => {
  xml += `   <url>\n`;
  xml += `      <loc>${url.loc}</loc>\n`;
  xml += `      <lastmod>${currentDate}</lastmod>\n`;
  xml += `      <changefreq>${url.changefreq}</changefreq>\n`;
  xml += `      <priority>${url.priority}</priority>\n`;
  xml += `   </url>\n`;
});

xml += `</urlset>`;

// Write XML to file
fs.writeFile("sitemap.xml", xml, (err) => {
  if (err) {
    console.error("Error writing sitemap:", err);
  } else {
    console.log("Sitemap generated successfully.");
  }
});
