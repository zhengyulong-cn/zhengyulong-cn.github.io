const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '筝语的博客',
  tagline: '纸上得来终觉浅，绝知此事要躬行',
  favicon: 'img/logo.svg',
  url: 'https://zhengyulong-cn.github.io',
  baseUrl: '/',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: false,
        },
        blog: {},
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: '筝语的博客',
        logo: {
          alt: '我的网站Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'frontend-programing-skills',
            position: 'left',
            label: '前端技术',
          },
          {
            type: 'docSidebar',
            sidebarId: 'backend-programing-skills',
            position: 'left',
            label: '后端技术',
          },
          {
            type: 'docSidebar',
            sidebarId: 'interview',
            position: 'left',
            label: '面试',
          },
          {
            type: 'docSidebar',
            sidebarId: 'quick-links',
            position: 'left',
            label: '快捷链接',
          },
          // { to: '/blog', label: '博客', position: 'left'},
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        copyright: `Copyright © ${new Date().getFullYear()}-present zhengyu. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  plugins: ['docusaurus-plugin-sass'],
};

module.exports = config;
