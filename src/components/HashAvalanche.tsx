import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';

/**
 * 哈希雪崩效应动画：两段仅差 1 字符的输入 → SHA-256 输出对比 + 字节差异热力图
 * 考点：单向性、抗碰撞；雪崩效应 — 输入 1 bit 变化应使输出约 50% bit 翻转。
 */
async function sha256Hex(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < hex.length; i += 2) out.push(parseInt(hex.slice(i, i + 2), 16));
  return out;
}

export default function HashAvalanche() {
  const [textA, setTextA] = useState('信息安全工程师');
  const [textB, setTextB] = useState('信息安全工程帅'); // 仅末字不同
  const [hashA, setHashA] = useState('');
  const [hashB, setHashB] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [a, b] = await Promise.all([sha256Hex(textA), sha256Hex(textB)]);
      if (!cancelled) {
        setHashA(a);
        setHashB(b);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [textA, textB]);

  const bytesA = hexToBytes(hashA);
  const bytesB = hexToBytes(hashB);
  const diffBits = bytesA.reduce((acc, a, i) => {
    const x = a ^ bytesB[i];
    return acc + (x.toString(2).split('1').length - 1);
  }, 0);
  const totalBits = bytesA.length * 8;

  return (
    <div className="crypto-card">
      <h4>🎯 哈希雪崩效应演示（SHA-256）</h4>

      <div className="crypto-grid-2">
        <div>
          <label style={{fontSize: 13}}>输入 A：</label>
          <input
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: 6,
              border: '1px solid var(--ifm-color-emphasis-400)',
              fontFamily: 'monospace',
            }}
          />
        </div>
        <div>
          <label style={{fontSize: 13}}>输入 B（改 1 字）：</label>
          <input
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: 6,
              border: '1px solid var(--ifm-color-emphasis-400)',
              fontFamily: 'monospace',
            }}
          />
        </div>
      </div>

      <div style={{fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all', margin: '12px 0'}}>
        <div>SHA-256(A)：<span style={{color: 'var(--ifm-color-primary)'}}>{hashA || '计算中…'}</span></div>
        <div>SHA-256(B)：<span style={{color: '#ef4444'}}>{hashB || '计算中…'}</span></div>
      </div>

      {/* 字节差异热力图 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(32, 1fr)',
          gap: 2,
          margin: '12px 0',
        }}
      >
        {bytesA.map((a, i) => {
          const same = a === bytesB[i];
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{opacity: 1}}
              title={`字节${i}: ${a.toString(16)} vs ${bytesB[i].toString(16)}`}
              style={{
                height: 14,
                borderRadius: 2,
                background: same ? '#10b98155' : '#ef4444',
              }}
            />
          );
        })}
      </div>
      <div style={{fontSize: 12, color: 'var(--ifm-color-emphasis-600)'}}>
        <span style={{color: '#ef4444'}}>■</span> 不同的字节 &nbsp;
        <span style={{color: '#10b981'}}>■</span> 相同的字节
      </div>

      {hashA && hashB && (
        <div style={{marginTop: 12, fontFamily: 'monospace', fontSize: 14}}>
          差异比特数：<b>{diffBits}</b> / {totalBits} ≈{' '}
          <b style={{color: 'var(--ifm-color-primary)'}}>
            {((diffBits / totalBits) * 100).toFixed(1)}%
          </b>
          （理想雪崩效应约 50%）
        </div>
      )}

      <div className="crypto-step-text">
        💡 考点：哈希函数性质 — ①单向性 ②抗弱碰撞(同输入难找另一同输出) ③抗强碰撞(难找任意两输入同输出)；
        雪崩效应保证输入微小变化→输出剧烈变化；常见：MD5(128位,已破)/SHA-1(160位,已破)/SHA-256/SM3(国密,256位)。
      </div>
    </div>
  );
}
