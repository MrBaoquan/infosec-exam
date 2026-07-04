# 项目指令 · 信息安全工程师备考站点

## 项目性质

软考中级"信息安全工程师"备考学习站点，基于 Docusaurus 3 + React + framer-motion + KaTeX。
代码库位于 `e:\信息安全工程师`，线上地址 https://mrbaoquan.github.io/infosec-exam/
GitHub 仓库 MrBaoquan/infosec-exam，自动部署到 GitHub Pages。

## 核心约束（必须遵守）

### 1. 移动端优先 · 随时随地学习

这是**最高优先级约束**。所有功能与内容必须适配手机：

- 已启用 PWA（`@docusaurus/plugin-pwa`）：Service Worker 离线缓存，支持"添加到主屏幕"。
- 所有页面、动画组件、表格必须在 375px 窄屏下可用、不溢出、不横向滚动（表格允许内部滚动）。
- 交互按钮最小触控区 40px，取消 300ms 点击延迟（`touch-action: manipulation`）。
- 新增任何组件/页面前，默认考虑移动端布局，使用响应式单位（`min()`, `vw`, `%`）而非固定 px。
- 新增表格一律继承 `.theme-doc-markdown table { overflow-x: auto }` 行为，禁止固定宽度撑破视口。
- 固定导航栏不遮挡锚点：`html { scroll-padding-top: calc(var(--ifm-navbar-height, 60px) + 8px); }`。

### 2. 密码学动画是核心价值

考点笔记配套交互动画（凯撒/AES/DES/RSA/哈希/DH/签名/SQL注入），每个动画须：

- 带 💡 考点速记，直击选择题/大题得分点。
- 动画组件用 `BrowserOnly` 包裹（避免 SSR 阶段 framer-motion/BigInt 报错）。
- 数学公式用 `$...$` / `$$...$$`（remark-math + rehype-katex），**禁止**在 MDX 中裸写 `{...}`（会被当 JSX 表达式求值）。

### 3. 已验证的技术基线（勿随意改动）

- Docusaurus **3.7.0**（3.4.0 在 Node 24 下 build 崩溃）。
- webpack **overrides 锁 5.95.0**（5.108 的 ProgressPlugin schema 变更导致 build 失败，勿升级）。
- `@docusaurus/plugin-pwa` 必须精确锁定 **3.7.0**（用 `^3.7.0` 会升到 3.10.1 报版本不匹配）。
- 文档 id 会剥离文件夹开头 `数字-` 前缀：`02-crypto/classical.mdx` 的 id 是 `crypto/classical`，sidebars 必须用剥离后的 id。
- **路由 URL 也会剥离前缀** → `/docs/crypto/classical` 而非 `/docs/02-crypto/classical`。首页/自定义页硬编码的 `<Link to>` 必须用剥离后的路径。
- 部署：`url`/`baseUrl` 已硬编码为 `https://mrbaoquan.github.io` / `/infosec-exam/`，不依赖环境变量注入（configure-pages 的 origin 输出不可靠）。
- 本地构建需增大内存：`$env:NODE_OPTIONS="--max-old-space-size=4096"`。

### 4. MDX 文档编写规则

- **禁止在 MDX 中裸写 `<` 或 `>` 字符**（会被误判为 JSX 标签开头）。用"小于/大于"中文替代，或用 `$<$` `$>$` LaTeX 包裹。
- **禁止在 MDX 正文（非代码块）中裸写 `{...}`**（会被当 JSX 表达式求值）。数学下标用 `$_{i}$` 或 `[i]` 替代。
- 文档用 frontmatter `title`，MDX 文件才能 import 组件。
- 相对链接用 `./classical` 格式（去 `.md` 后缀），否则 warning。

### 5. 教程级文档标准（7要素）

每篇知识点文档应包含：
1. **为什么需要**（动机/场景引入）
2. **是什么**（定义+形象比喻）
3. **怎么工作**（原理详解，不是一句话）
4. **具体例子**（命令/配置/场景）
5. **易错辨析**（考试怎么考、易混淆点）
6. **真题示例及解析**（上午单选+下午简答，含评分要点）
7. **考点速记**

- 高频考点标注 ⭐，超纲/低频标注 📌。
- 英文缩写必须提供全拼（如 AES = Advanced Encryption Standard）。
- 抽象概念必须配具体案例场景（如 BLP 用军事文件系统、Biba 用医院病历）。

### 6. 章节循序渐进原则

侧边栏顺序遵循"**基础理论 → 技术原理 → 攻击威胁 → 防护措施 → 管理实践**"：
- 密码学：古典→DES(先出现)→AES(取代)→哈希→RSA→签名→PKI→Kerberos→国密
- 网络安全：OSI(分层基础)→协议→体系模型→攻击原理→攻击→防火墙→IDS→VPN→TLS→物理→审计→防御→架构→测评
- 备考路线图（study-plan.md）须与侧边栏顺序同步。

### 7. 题库与练习系统

- 题库 JSON 放 `static/questions/`，套卷放 `static/exams/`。
- fetch 路径用**纯相对路径**（如 `questions/crypto.json`），不用 `useDocusaurusContext` 取 baseUrl（在 BrowserOnly 内取不到）。
- 间隔重复记忆模式：答错间隔3题再现，连续答对2次毕业，间隔逐步拉长(3→5→8)。

### 8. 题库出题规则（必须遵循）

#### 题型分布（按真实考试比例）
| 题型 | 目标占比 | 说明 |
|------|:--------:|------|
| **场景应用题** | 25% | 给实际场景选方案/判断做法 |
| **概念辨析题** | 30% | 易混淆概念对比 |
| **参数记忆题** | 20% | 具体数值/参数 |
| **综合分析题** | 15% | 多知识点交叉 |
| **计算题** | 10% | RSA/ALE等手算 |

#### 出题质量要求
1. **紧扣大纲**：每道题必须对应大纲明确列出的考点，不出超纲题。
2. **真题风格**：选项有迷惑性，易错项设计合理（不是明显错的凑数项）。
3. **解析有教学价值**：不只说答案，要解释为什么对、其他选项为什么错。
4. **场景题优先**：给真实业务场景（如"某银行需…"），比直接问概念更有备考价值。
5. **计算题必须可手算**：用小数（如p=5,q=11），不要求计算器。
6. **不为凑数出题**：宁可少出，不出低质量/重复/偏离考点的题。
7. **题目JSON格式**：
   ```json
   {
     "id": "模块-序号",
     "category": "模块标识",
     "question": "题干",
     "options": ["A","B","C","D"],
     "answer": 0,
     "explanation": "解析（必须含为什么对+为什么错）"
   }
   ```
8. **题干标注类型**：场景题用"某企业/某银行…"开头；计算题用"已知…求…"；综合题用"下列…正确的是"。

#### 禁止出题方向
- ❌ 超纲内容（区块链/DeFi/智能合约等不在大纲的）
- ❌ 无解析的题
- ❌ 4个选项有2个以上明显错误的凑数题
- ❌ 与已有题高度重复的题
- ❌ 纯记忆无理解的题（如"AES的S盒有多少行"——考了也没意义）

### 9. 部署流程

- 推送到 main 自动触发 GitHub Actions（`.github/workflows/deploy.yml`）。
- CI 用 `rm -f package-lock.json && npm install`（规避 rollup native 平台 bug + npm ci 崩溃）。
- deploy 阶段偶发 "Deployment failed, try again later" 是 GitHub Pages 服务临时错误，`gh run rerun --failed` 重试即可。
- 本地测试 PWA 用 `npm run build && npm run serve`（dev 模式 PWA 有已知问题）。

### 10. 编码规范（原第8条）

- 组件放 `src/components/`，文档放 `docs/`，MDX 用 frontmatter `title`。
- 改动后必须 `npm run build` 验证通过（EXIT=0）才算完成。
- 不要新增无关依赖、不要过度抽象、不要给未改动代码加注释/类型注解。
- 中文 commit message 在 PowerShell 可能乱码，不影响功能。
