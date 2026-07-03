import {useState} from 'react';
import {motion} from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';

/**
 * SQL 注入动画演示
 * 考点：参数化查询防注入；输入拼接到 SQL 是漏洞根源
 */
const SAFE_QUERY = 'SELECT * FROM users WHERE name = ? AND password = ?';
const VULN_QUERY = 'SELECT * FROM users WHERE name = \'{name}\' AND password = \'{pwd}\'';

function buildVuln(name: string, pwd: string): string {
  return VULN_QUERY.replace('{name}', name).replace('{pwd}', pwd);
}

function SqlInjectionContent() {
  const [name, setName] = useState('admin');
  const [pwd, setPwd] = useState("anything' OR '1'='1");
  const [safe, setSafe] = useState(false);

  const finalQuery = safe ? SAFE_QUERY : buildVuln(name, pwd);
  const isInjected = !safe && /OR\s+'?1'?\s*=\s*'?1'?/i.test(pwd);

  return (
    <div className="crypto-card">
      <h4>🎯 SQL 注入演示</h4>

      <div className="crypto-grid-2">
        <div>
          <label style={{fontSize: 13}}>用户名：</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--ifm-color-emphasis-400)', fontFamily: 'monospace'}}
          />
        </div>
        <div>
          <label style={{fontSize: 13}}>密码：</label>
          <input
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            style={{width: '100%', padding: '8px', borderRadius: 6, border: '1px solid var(--ifm-color-emphasis-400)', fontFamily: 'monospace'}}
          />
        </div>
      </div>

      <div style={{margin: '12px 0', display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <button
          className="crypto-btn"
          onClick={() => setSafe(false)}
          style={!safe ? {opacity: 1} : {opacity: 0.5, background: '#ef4444', borderColor: '#ef4444'}}
        >
          危险：字符串拼接
        </button>
        <button
          className="crypto-btn"
          onClick={() => setSafe(true)}
          style={safe ? {opacity: 1, background: '#10b981', borderColor: '#10b981'} : {opacity: 0.5}}
        >
          安全：参数化查询
        </button>
      </div>

      <motion.div
        animate={{
          background: isInjected ? '#ef444411' : safe ? '#10b98111' : 'var(--ifm-color-emphasis-100)',
          borderColor: isInjected ? '#ef4444' : safe ? '#10b981' : 'var(--ifm-color-emphasis-300)',
        }}
        style={{
          padding: 14,
          borderRadius: 8,
          border: '2px solid',
          fontFamily: 'monospace',
          fontSize: 13,
          wordBreak: 'break-all',
          margin: '12px 0',
        }}
      >
        <div style={{fontSize: 11, color: 'var(--ifm-color-emphasis-600)', marginBottom: 6}}>最终执行的 SQL：</div>
        {finalQuery}
      </motion.div>

      {isInjected && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          style={{
            padding: 12,
            borderRadius: 8,
            background: '#ef444411',
            borderLeft: '3px solid #ef4444',
            fontSize: 13,
          }}
        >
          ⚠️ <b>注入成功！</b>因 `'1'='1'` 恒真，WHERE 条件永真，<b>绕过密码验证</b>，返回所有用户记录。
        </motion.div>
      )}

      {safe && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          style={{
            padding: 12,
            borderRadius: 8,
            background: '#10b98111',
            borderLeft: '3px solid #10b981',
            fontSize: 13,
          }}
        >
          ✓ <b>参数化查询</b>：用户输入只作为数据（?占位符），永不作为 SQL 代码执行，注入无效。
        </motion.div>
      )}

      <div className="crypto-step-text">
        💡 考点：SQL 注入根因是<strong>输入被拼入 SQL 语句作为代码执行</strong>；
        根本防护是<strong>参数化查询/预编译</strong>（输入只作数据）；辅助：输入过滤、最小权限、WAF。
      </div>
    </div>
  );
}

export default function SqlInjection() {
  return (
    <BrowserOnly fallback={<div className="crypto-card">加载 SQL 注入演示…</div>}>
      {() => <SqlInjectionContent />}
    </BrowserOnly>
  );
}
