import {useState} from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useAnswerRecords} from '../components/useAnswerRecords';

const CATEGORIES = [
  {key: 'crypto', label: '密码学', color: '#2563eb'},
  {key: 'network', label: '网络安全', color: '#10b981'},
  {key: 'system', label: '系统安全', color: '#f97316'},
  {key: 'application', label: '应用安全', color: '#f59e0b'},
  {key: 'others', label: '基础/管理/工程', color: '#8b5cf6'},
];

function StatsContent() {
  const {records, stats, getOverallStats, getCategoryStats, downloadExport, clearAll} = useAnswerRecords();
  const [confirmClear, setConfirmClear] = useState(false);
  const overall = getOverallStats();

  return (
    <div>
      <h2 style={{marginTop: 0}}>📊 答题数据分析</h2>
      <p style={{color: 'var(--ifm-color-emphasis-600)', fontSize: 14}}>
        所有答题记录存储在本地浏览器，可导出为 JSON/CSV 供 AI 分析。
      </p>

      {/* 总览 */}
      <div className="crypto-card" style={{marginBottom: 16}}>
        <h3 style={{marginTop: 0}}>总体统计</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 28, fontWeight: 700, color: 'var(--ifm-color-primary)'}}>{overall.totalAttempts}</div>
            <div style={{fontSize: 12, color: 'var(--ifm-color-emphasis-600)'}}>总答题次数</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 28, fontWeight: 700, color: '#10b981'}}>{overall.correctCount}</div>
            <div style={{fontSize: 12, color: 'var(--ifm-color-emphasis-600)'}}>答对次数</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 28, fontWeight: 700, color: overall.accuracy >= 60 ? '#10b981' : '#ef4444'}}>{overall.accuracy}%</div>
            <div style={{fontSize: 12, color: 'var(--ifm-color-emphasis-600)'}}>正确率</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 28, fontWeight: 700, color: '#10b981'}}>{overall.mastered}</div>
            <div style={{fontSize: 12, color: 'var(--ifm-color-emphasis-600)'}}>已掌握题数</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 28, fontWeight: 700}}>{overall.totalQuestions}</div>
            <div style={{fontSize: 12, color: 'var(--ifm-color-emphasis-600)'}}>已答题数</div>
          </div>
        </div>
        <div style={{height: 8, background: 'var(--ifm-color-emphasis-200)', borderRadius: 4, margin: '16px 0 4px'}}>
          <div style={{
            width: `${overall.masteryRate}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #10b981, #3b82f6)',
            borderRadius: 4,
            transition: 'width 0.4s',
          }} />
        </div>
        <div style={{fontSize: 12, color: 'var(--ifm-color-emphasis-600)'}}>掌握率 {overall.masteryRate}%</div>
      </div>

      {/* 分模块统计 */}
      <div className="crypto-card" style={{marginBottom: 16}}>
        <h3 style={{marginTop: 0}}>分模块统计</h3>
        {CATEGORIES.map((cat) => {
          const s = getCategoryStats(cat.key);
          if (s.totalAttempts === 0) return null;
          return (
            <div key={cat.key} style={{marginBottom: 12, padding: 12, borderRadius: 8, background: 'var(--ifm-color-emphasis-100)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8}}>
                <span style={{color: cat.color, fontWeight: 700}}>{cat.label}</span>
                <span style={{fontSize: 13, color: 'var(--ifm-color-emphasis-600)'}}>
                  答题 {s.totalAttempts} 次 · 正确率 {s.accuracy}% · 掌握 {s.mastered}/{s.uniqueQuestions}
                </span>
              </div>
              <div style={{height: 6, background: 'var(--ifm-color-emphasis-200)', borderRadius: 3, marginTop: 8}}>
                <div style={{
                  width: `${s.accuracy}%`,
                  height: '100%',
                  background: cat.color,
                  borderRadius: 3,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 高频错题 */}
      <div className="crypto-card" style={{marginBottom: 16}}>
        <h3 style={{marginTop: 0}}>高频错题 TOP 10</h3>
        {Object.values(stats)
          .filter((s) => s.wrongCount > 0)
          .sort((a, b) => b.wrongCount - a.wrongCount)
          .slice(0, 10)
          .map((s, i) => (
            <div key={s.questionId} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--ifm-color-emphasis-200)'}}>
              <span style={{fontSize: 13}}>
                {i + 1}. {s.questionId} ({s.category})
              </span>
              <span style={{fontSize: 13, color: '#ef4444'}}>
                错 {s.wrongCount} 次 / 对 {s.correctCount} 次
              </span>
            </div>
          ))}
        {Object.values(stats).filter((s) => s.wrongCount > 0).length === 0 && (
          <p style={{color: 'var(--ifm-color-emphasis-500)', fontSize: 13}}>暂无错题记录</p>
        )}
      </div>

      {/* 导出与清除 */}
      <div className="crypto-card">
        <h3 style={{marginTop: 0}}>数据导出</h3>
        <p style={{fontSize: 13, color: 'var(--ifm-color-emphasis-600)'}}>
          导出答题记录供 AI 分析，可基于数据制定个性化练习方案。
        </p>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          <button className="crypto-btn" onClick={() => downloadExport('json')} style={{minHeight: 40}}>
            📥 导出 JSON
          </button>
          <button className="crypto-btn" onClick={() => downloadExport('csv')} style={{minHeight: 40}}>
            📥 导出 CSV
          </button>
          {!confirmClear ? (
            <button className="crypto-btn crypto-btn-ghost" onClick={() => setConfirmClear(true)} style={{minHeight: 40, color: '#ef4444', borderColor: '#ef4444'}}>
              清空记录
            </button>
          ) : (
            <>
              <button className="crypto-btn" onClick={() => {clearAll(); setConfirmClear(false);}} style={{minHeight: 40, background: '#ef4444', borderColor: '#ef4444'}}>
                确认清空
              </button>
              <button className="crypto-btn crypto-btn-ghost" onClick={() => setConfirmClear(false)} style={{minHeight: 40}}>
                取消
              </button>
            </>
          )}
        </div>
        <div style={{fontSize: 11, color: 'var(--ifm-color-emphasis-500)', marginTop: 12}}>
          💡 JSON 含完整记录+统计，适合 AI 分析；CSV 适合 Excel 查看。
          共 {records.length} 条记录。
        </div>
      </div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <Layout title="答题分析" description="答题记录统计与导出">
      <main style={{padding: '24px 16px', maxWidth: 760, margin: '0 auto'}}>
        <BrowserOnly fallback={<div>加载中…</div>}>
          {() => <StatsContent />}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
