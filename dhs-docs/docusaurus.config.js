// @ts-check

// @ts-ignore
const lightCodeTheme = require("prism-react-renderer/themes/github");
// @ts-ignore
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// ###########################

// const footerdictionary = {
//   style: "dark",
//   logo: {
//     alt: "DHS Logo",
//     src: "img/logo-white.svg",
//     href: "https://your-dhs-website.com",
//     width: 160,
//     className: "ml-auto order-last md:order-none w-40", // Tailwind classes
//   },
//   links: [
//     {
//       title: "Documentation",
//       items: [
//         { label: "Quick Start", to: "/docs/quick-start" },
//         { label: "API Reference", to: "/docs/api" },
//         { label: "Troubleshooting", to: "/docs/troubleshooting" },
//       ],
//     },
//     {
//       title: "Community",
//       items: [
//         {
//           label: "GitHub",
//           href: "https://github.com/Prashu7487/DHS-Documentation",
//         },
//         { label: "Forum", href: "#" },
//         { label: "Twitter", href: "#" },
//       ],
//     },
//     {
//       title: "Legal",
//       items: [
//         { label: "Privacy", to: "/privacy" },
//         { label: "Terms", to: "/terms" },
//       ],
//     },
//   ],
//   copyright: `Copyright © ${new Date().getFullYear()} DHS Project. Built with Docusaurus.`,
// };

// #######################

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "DHS Documentation Project",
  tagline: "Preparing Digital Goods for AI in Healthcare",
  favicon: "img/favicon.svg",

  url: "https://digital-health-stack.github.io",
  baseUrl: "/DHS-Documentation/", // must match the repo name

  organizationName: "Digital-Health-Stack", // GitHub username
  projectName: "DHS-Documentation", // GitHub repo name
  deploymentBranch: "gh-pages", // don't change this

  trailingSlash: false,
  onBrokenLinks: "warn", // "throw" | "ignore", throw will stop the build
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/Digital-Health-Stack/DHS-Documentation.git/edit/main/",
          routeBasePath: "/docs",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          editUrl:
            "https://github.com/Digital-Health-Stack/DHS-Documentation.git/edit/main/blog/",
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "DHS Documentation Project",
        logo: {
          alt: "DHS Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docs",
            position: "left",
            label: "Documentation",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/Digital-Health-Stack/DHS-Documentation",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      // footer: footerdictionary,
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["bash", "python"],
      },
    }),
};

module.exports = config;
