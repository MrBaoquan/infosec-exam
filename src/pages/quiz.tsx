import {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Quiz, {type Question} from '../components/Quiz';
import {useWrongQuestions} from '../components/useWrongQuestions';

type Mode = 'menu' | 'practice';

interface Category {
  key: string;
  label: string;
  desc: string;
  file: string;
  color: string;
}

const CATEGORIES: Category[] = [
  {key: 'crypto', label: '密码学', desc: 'AES/DES/RSA/哈希/国密 ⭐', file: '/questions/crypto.json', color: '#2563eb'},
  {key: 'network', label: '网络安全', desc: '防火墙/IDS/IPSec/TLS', file: '/questions/network.json', color: '#10b981'},
  {key: 'system', label: '系统安全', desc: 'OS/访问控制/恶意代码', file: '/questions/system.json', color: '#f97316'},
  {key: 'application', label: '应用安全', desc: 'SQL注入/XSS/CSRF', file: '/questions/application.json', color: '#f59e0b'},
  {key: 'others', label: '基础/管理/工程', desc: 'CIA/等保/SSE-CMM', file: '/questions/others.json', color: '#8b5cf6'},
];

function QuizPageContent() {
  const [mode, setMode] = useState<Mode>('menu');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  const [wrongOnly, setWrongOnly] = useState<string[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {wrong, clearWrong} = useWrongQuestions();

  const startPractice = async (cat: Category) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(cat.file);
      if (!res.ok) throw new Error('加载失败');
      const data = await res.json();
      setQuestions(data);
      setTitle(cat.label);
      setWrongOnly(undefined);
      setMode('practice');
    } catch {
      setError('题目加载失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  };

  const startWrongOnly = async () => {
    if (wrong.length === 0) return;
    setLoading(true);
    setError('');
    try {
      // 合并所有题库，筛选错题
      const all = await Promise.all(
        CATEGORIES.map(async (c) => {
          const res = await fetch(c.file);
          return res.ok ? res.json() : [];
        }),
      );
      const flat: Question[] = all.flat();
      setQuestions(flat.filter((q: Question) => wrong.includes(q.id)));
      setTitle('错题重做');
      setWrongOnly(wrong);
      setMode('practice');
    } catch {
      setError('加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'practice') {
    return (
      <Quiz
        questions={questions}
        title={title}
        wrongOnly={wrongOnly}
        onExit={() => setMode('menu')}
      />
    );
  }

  return (
    <div>
      <h2 style={{marginTop: 0}}>📝 题库练习</h2>
      <p style={{color: 'var(--ifm-color-emphasis-600)', fontSize: 14}}>
        选择模块开始练习。答错的题自动加入错题本，可集中重做。
      </p>

      {error && (
        <div style={{color: '#ef4444', margin: '8px 0'}}>{error}</div>
      )}

      {/* 错题本入口 */}
      <div
        style={{
          border: '1px solid #ef4444',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          background: '#ef444408',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <b>❌ 错题本</b>
          <span style={{fontSize: 13, color: 'var(--ifm-color-emphasis-600)', marginLeft: 8}}>
            共 {wrong.length} 题
          </span>
        </div>
        <div style={{display: 'flex', gap: 8}}>
          <button
            className="crypto-btn"
            disabled={wrong.length === 0 || loading}
            onClick={startWrongOnly}
            style={{minHeight: 40}}
          >
            错题重做
          </button>
          <button
            className="crypto-btn crypto-btn-ghost"
            disabled={wrong.length === 0}
            onClick={clearWrong}
            style={{minHeight: 40}}
          >
            清空
          </button>
        </div>
      </div>

      {/* 模块卡片 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => startPractice(cat)}
            disabled={loading}
            style={{
              textAlign: 'left',
              padding: 18,
              borderRadius: 12,
              border: `1px solid ${cat.color}44`,
              background: 'var(--ifm-card-background-color)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              touchAction: 'manipulation',
              minHeight: 90,
            }}
          >
            <div style={{color: cat.color, fontWeight: 700, fontSize: 16}}>{cat.label}</div>
            <div style={{fontSize: 13, color: 'var(--ifm-color-emphasis-600)', marginTop: 4}}>
              {cat.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Layout title="题库练习" description="软考信息安全工程师题库练习与错题本">
      <main style={{padding: '24px 16px', maxWidth: 760, margin: '0 auto'}}>
        <BrowserOnly fallback={<div>加载中…</div>}>
          {() => <QuizPageContent />}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
