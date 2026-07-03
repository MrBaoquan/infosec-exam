# 项目指令 · 信息安全工程师备考站点

## 项目性质
软考中级"信息安全工程师"备考学习站点，基于 Docusaurus 3 + React + framer-motion + KaTeX。
代码库位于 `e:\信息安全工程师`。

## 核心约束（必须遵守）

### 1. 移动端优先 · 随时随地学习
这是**最高优先级约束**。所有功能与内容必须适配手机：
- 已启用 PWA（`@docusaurus/plugin-pwa`）：Service Worker 离线缓存，支持"添加到主屏幕"。
- 所有页面、动画组件、表格必须在 375px 窄屏下可用、不溢出、不横向滚动（表格允许内部滚动）。
- 交互按钮最小触控区 40px，取消 300ms 点击延迟（`touch-action: manipulation`）。
- 新增任何组件/页面前，默认考虑移动端布局，使用响应式单位（`min()`, `vw`, `%`）而非固定 px。
- 新增表格一律继承 `.theme-doc-markdown table { overflow-x: auto }` 行为，禁止固定宽度撑破视口。

### 2. 密码学动画是核心价值
考点笔记配套交互动画（凯撒/AES/DES/RSA/哈希），每个动画须：
- 带 💡 考点速记，直击选择题/大题得分点。
- 动画组件用 `BrowserOnly` 包裹（避免 SSR 阶段 framer-motion/BigInt 报错）。
- 数学公式用 `$...$` / `$$...$$`（remark-math + rehype-katex），**禁止**在 MDX 中裸写 `{...}`（会被当 JSX 表达式求值）。

### 3. 已验证的技术基线（勿随意改动）
- Docusaurus **3.7.0**（3.4.0 在 Node 24 下 build 崩溃）。
- webpack **overrides 锁 5.95.0**（5.108 的 ProgressPlugin schema 变更导致 build 失败，勿升级）。
- 文档 id 会剥离文件夹开头 `数字-` 前缀：`02-crypto/classical.mdx` 的 id 是 `crypto/classical`，sidebars 必须用剥离后的 id。
- 部署：`url`/`baseUrl` 读环境变量 `URL`/`BASE_URL`，GitHub Actions `deploy.yml` 自动注入项目页路径。

## 编码规范
- 组件放 `src/components/`，文档放 `docs/`，MDX 用 frontmatter `title`。
- 改动后必须 `npm run build` 验证通过（EXIT=0）才算完成。
- 不要新增无关依赖、不要过度抽象、不要给未改动代码加注释/类型注解。
