import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import '@docusaurus/plugin-pwa';

const config: Config = {
    title: '信息安全工程师备考',
    tagline: '软考中级 · 考点速记 + 密码学动画演示',
    favicon: 'img/favicon.ico',
    url: 'https://mrbaoquan.github.io',
    baseUrl: '/infosec-exam/',
    trailingSlash: false,

    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',

    i18n: {
        defaultLocale: 'zh-CN',
        locales: ['zh-CN'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    editUrl: undefined,
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    plugins: [
        [
            '@docusaurus/plugin-pwa',
            {
                // 离线模式激活策略：安装为应用后、或访问 ?offline=true 时启用
                offlineModeActivationStrategies: ['appInstalled', 'queryString'],
                pwaHead: [
                    { tagName: 'meta', name: 'theme-color', content: '#2563eb' },
                    { tagName: 'meta', name: 'apple-mobile-web-app-capable', content: 'yes' },
                    { tagName: 'meta', name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
                    { tagName: 'meta', name: 'apple-mobile-web-app-title', content: '信安备考' },
                    { tagName: 'link', rel: 'apple-touch-icon', href: '/img/pwa-192.png' },
                    { tagName: 'link', rel: 'manifest', href: '/manifest.json' },
                ],
            },
        ],
    ],

    stylesheets: [
        {
            href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
            type: 'text/css',
            integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
            crossorigin: 'anonymous',
        },
    ],

    themeConfig: {
        colorMode: {
            defaultMode: 'light',
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: '信息安全工程师备考',
            items: [
                { type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: '考点笔记' },
                { to: '/quiz', label: '题库练习', position: 'left' },
                { to: '/exam', label: '套卷模拟', position: 'left' },
                {
                    href: 'https://www.ruankao.org.cn/',
                    label: '软考官网',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            copyright: `备考用途 · ${new Date().getFullYear()} · 内容依据 2018 新版大纲`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
