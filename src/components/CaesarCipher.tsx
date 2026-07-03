import {useState, useMemo} from 'react';
import {motion} from 'framer-motion';

/**
 * 凯撒密码动画：拖动密钥(移位) → 字母轮盘旋转 + 明密文实时对照
 * 考点：替换密码、密钥空间仅 25、暴力破解极易。
 */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function caesar(text: string, shift: number): string {
  return text
    .toUpperCase()
    .split('')
    .map((ch) => {
      const idx = ALPHABET.indexOf(ch);
      if (idx === -1) return ch;
      return ALPHABET[(idx + shift + 26) % 26];
    })
    .join('');
}

export default function CaesarCipher() {
  const [plaintext, setPlaintext] = useState('HELLO INFOSEC');
  const [shift, setShift] = useState(3);

  const ciphertext = useMemo(() => caesar(plaintext, shift), [plaintext, shift]);

  return (
    <div className="crypto-card">
      <h4>🎯 凯撒密码演示</h4>

      <label style={{fontSize: 14, marginRight: 8}}>明文：</label>
      <input
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value)}
        style={{
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid var(--ifm-color-emphasis-400)',
          width: '60%',
          fontFamily: 'monospace',
        }}
      />

      <div style={{margin: '16px 0'}}>
        <label style={{fontSize: 14}}>密钥 K = {shift}</label>
        <input
          type="range"
          min={0}
          max={25}
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          style={{width: '100%', marginTop: 6}}
        />
      </div>

      {/* 字母轮盘：内圈明文，外圈密文，随 K 旋转 */}
      <div
        style={{
          position: 'relative',
          width: 'min(260px, 72vw)',
          aspectRatio: '1',
          margin: '8px auto',
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 260 260">
          {/* 外圈密文（固定） */}
          {ALPHABET.map((ch, i) => {
            const angle = (i / 26) * 2 * Math.PI - Math.PI / 2;
            const r = 120;
            const x = 130 + r * Math.cos(angle);
            const y = 130 + r * Math.sin(angle);
            return (
              <text
                key={`o-${ch}`}
                x={x}
                y={y}
                fill="var(--ifm-color-primary)"
                fontSize={14}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {ch}
              </text>
            );
          })}
          {/* 内圈明文（旋转） */}
          <motion.g
            animate={{rotate: (shift / 26) * 360}}
            transition={{type: 'spring', stiffness: 120, damping: 14}}
            style={{originX: '130px', originY: '130px'}}
          >
            {ALPHABET.map((ch, i) => {
              const angle = (i / 26) * 2 * Math.PI - Math.PI / 2;
              const r = 85;
              const x = 130 + r * Math.cos(angle);
              const y = 130 + r * Math.sin(angle);
              return (
                <text
                  key={`i-${ch}`}
                  x={x}
                  y={y}
                  fill="var(--ifm-color-emphasis-800)"
                  fontSize={13}
                  fontWeight={600}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {ch}
                </text>
              );
            })}
            <circle cx={130} cy={130} r={95} fill="none" stroke="var(--ifm-color-emphasis-300)" />
          </motion.g>
          <circle cx={130} cy={130} r={130} fill="none" stroke="var(--ifm-color-emphasis-200)" />
        </svg>
      </div>

      <div style={{fontFamily: 'monospace', fontSize: 15, textAlign: 'center'}}>
        <div>明文：<b>{plaintext.toUpperCase()}</b></div>
        <div style={{color: 'var(--ifm-color-primary)', marginTop: 4}}>
          密文：<b>{ciphertext}</b>
        </div>
      </div>

      <div className="crypto-step-text">
        💡 考点：凯撒密码密钥空间仅 25，暴力破解秒破；属单表替换密码，无法抵御频率分析。
      </div>
    </div>
  );
}
