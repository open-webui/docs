// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Open WebUI",
  tagline: "ChatGPT-Style WebUI for LLMs (Formerly Ollama WebUI)",
  favicon: "img/favicon.png",

  // Set the production url of your site here
  url: "https://openwebui.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "open-webui", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          sidebarPath: "./sidebars.js",
          routeBasePath: "/",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/open-webui/docs/blob/main",
        },
        blog: false,
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        // },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Open WebUI",
        logo: {
          src: "img/logo.png",
          srcDark: "img/logo-dark.png",
        },
        items: [
          // {
          //   type: "docSidebar",
          //   sidebarId: "tutorialSidebar",
          //   position: "left",
          //   label: "Tutorial",
          // },
          {
            href: "https://github.com/open-webui/open-webui",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        logo: {
          src: "img/logo-dark.png",
          height: 100,
        },
        style: "light",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Getting Started",
                to: "getting-started",
              },
              {
                label: "Tutorial",
                to: "tutorial",
              }
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/open-webui/open-webui",
              },
              {
                label: "Discord",
                href: "https://discord.gg/5rJgQTnV4s",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/OpenWebUI",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Release Notes",
                to: "https://github.com/open-webui/open-webui/blob/main/CHANGELOG.md",
              },
              {
                label: "About",
                to: "https://openwebui.com",
              },
              {
                label: "Research",
                to: "research",
              }
            ],
          },
        ],
        // copyright: `Copyright © ${new Date().getFullYear()} OpenWebUI`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
