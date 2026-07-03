import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useStudyProgress} from '../components/useStudyProgress';

const MODULES = [
  {t: '一、信息安全基础', d: 'CIA · 安全模型 · 法律法规', to: '/docs/fundamentals', ids: ['fundamentals/index']},
  {
    t: '二、密码学 ⭐',
    d: '含 5 个交互动画演示',
    to: '/docs/crypto',
    hot: true,
    ids: ['crypto/index', 'crypto/classical', 'crypto/symmetric', 'crypto/des', 'crypto/asymmetric', 'crypto/hash', 'crypto/signature', 'crypto/pki', 'crypto/national-crypto'],
  },
  {t: '三、网络安全', d: '防火墙 · IDS/IPS · VPN', to: '/docs/network', ids: ['network/index']},
  {t: '四、系统安全', d: 'OS安全 · 恶意代码 · 访问控制', to: '/docs/system', ids: ['system/index']},
  {t: '五、应用安全', d: 'SQL注入 · XSS · CSRF', to: '/docs/application', ids: ['application/index']},
  {t: '六、信息安全管理', d: '风险评估 · 等保2.0 · BCP', to: '/docs/management', ids: ['management/index']},
  {t: '七、信息安全工程', d: 'SSE-CMM · CC · 安全原则', to: '/docs/engineering', ids: ['engineering/index']},
];
const ALL_IDS = MODULES.flatMap((m) => m.ids);

function Dashboard() {
  const {getStats} = useStudyProgress();
  const {counts, total, donePct} = getStats(ALL_IDS);
  return (
    <div style={{background: 'var(--ifm-color-emphasis-100)', borderRadius: 12, padding: 20, margin: '20px 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8}}>
        <h3 style={{margin: 0}}>📊 学习进度</h3>
        <span style={{fontSize: 24, fontWeight: 700, color: 'var(--ifm-color-primary)'}}>{donePct}%</span>
      </div>
      <div style={{height: 8, background: 'var(--ifm-color-emphasis-300)', borderRadius: 4, margin: '12px 0'}}>
        <div style={{width: `${donePct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: 4, transition: 'width 0.4s'}} />
      </div>
      <div style={{display: 'flex', gap: 16, fontSize: 13, color: 'var(--ifm-color-emphasis-600)', flexWrap: 'wrap'}}>
        <span>🟢 已掌握 {counts.done}</span>
        <span>🟡 学习中 {counts.learning}</span>
        <span>⚪ 未学 {counts.unset}</span>
        <span>共 {total} 篇</span>
      </div>
    </div>
  );
}

function ModuleCard({module: c}: {module: typeof MODULES[number]}) {
  const {getStats} = useStudyProgress();
  const {donePct} = getStats(c.ids);
  return (
    <Link to={c.to} style={{textDecoration: 'none', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 12, padding: 20, background: 'var(--ifm-card-background-color)', textAlign: 'left', position: 'relative'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <h3 style={{margin: 0, color: 'var(--ifm-color-primary)'}}>{c.t}</h3>
        {donePct > 0 && <span style={{fontSize: 12, color: '#10b981', fontWeight: 600}}>{donePct}%</span>}
      </div>
      <p style={{margin: '8px 0 0', fontSize: 13, color: 'var(--ifm-color-emphasis-600)'}}>{c.d}</p>
      {c.hot && (
        <span style={{position: 'absolute', top: 10, right: 10, background: '#ef4444', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 10}}>重点</span>
      )}
    </Link>
  );
}

function HomeContent() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="软考中级信息安全工程师备考站点">
      <main style={{padding: '40px 20px', textAlign: 'center', maxWidth: 900, margin: '0 auto'}}>
        <h1 style={{fontSize: 36, marginBottom: 8}}>🛡️ 信息安全工程师备考</h1>
        <p style={{fontSize: 18, color: 'var(--ifm-color-emphasis-600)'}}>
          软考中级 · 2018 新版大纲 · 考点速记 + 密码学动画演示
        </p>

        <BrowserOnly fallback={<div style={{height: 100}} />}>
          {() => <Dashboard />}
        </BrowserOnly>

        <div className="hero-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, margin: '24px 0'}}>
          {MODULES.map((c) => <ModuleCard key={c.t} module={c} />)}
        </div>

        <div style={{background: 'var(--ifm-color-emphasis-100)', borderRadius: 12, padding: 24, marginTop: 20, textAlign: 'left'}}>
          <h3 style={{marginTop: 0}}>🎬 密码学动画演示（亮点）</h3>
          <ul>
            <li><Link to="/docs/crypto/classical">凯撒密码</Link> — 字母轮盘 + 密钥拖动</li>
            <li><Link to="/docs/crypto/symmetric">AES 状态矩阵</Link> — 四步轮变换逐步播放</li>
            <li><Link to="/docs/crypto/des">DES Feistel 网络</Link> — 16 轮左右半块流动</li>
            <li><Link to="/docs/crypto/asymmetric">RSA 加解密步骤</Link> — 大数运算全程演示</li>
            <li><Link to="/docs/crypto/hash">哈希雪崩效应</Link> — 1 字之差 → 输出剧变</li>
          </ul>
        </div>

        <p style={{marginTop: 30, color: 'var(--ifm-color-emphasis-500)', fontSize: 13}}>
          建议从「二、密码学」开始，配合动画直观理解算法原理。每篇文档右下角可标记学习状态。
        </p>
      </main>
    </Layout>
  );
}

export default function Home(): JSX.Element {
  return (
    <BrowserOnly fallback={<div style={{padding: 40, textAlign: 'center'}}>加载中…</div>}>
      {() => <HomeContent />}
    </BrowserOnly>
  );
}
