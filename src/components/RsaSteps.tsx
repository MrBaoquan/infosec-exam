import {useState, useMemo} from 'react';
import {motion} from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Stepper from './Stepper';

/**
 * RSA 步骤动画：选 p,q → n,φ → 公钥 e → 私钥 d → 加密 → 解密
 * 考点：基于大数分解难题；公钥加密/私钥解密；也用于数字签名(私钥签/公钥验)。
 */
const P = 61;
const Q = 53;
const N = P * Q; // 3233
const PHI = (P - 1) * (Q - 1); // 3120
const E = 17;
const D = 2753; // e=17 的逆元 mod 3120

function modPow(base: number, exp: number, mod: number): number {
  // 大数用 BigInt 避免溢出
  let b = BigInt(base);
  let e = BigInt(exp);
  const m = BigInt(mod);
  let r = 1n;
  b = b % m;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    e = e >> 1n;
    b = (b * b) % m;
  }
  return Number(r);
}

export default function RsaSteps() {
  return (
    <BrowserOnly fallback={<div className="crypto-card">加载 RSA 演示…</div>}>
      {() => <RsaStepsContent />}
    </BrowserOnly>
  );
}

function RsaStepsContent() {
  const [message, setMessage] = useState(65); // 明文 M
  const [step, setStep] = useState(0);

  const c = useMemo(() => modPow(message, E, N), [message]);
  const recovered = useMemo(() => modPow(c, D, N), [c]);

  const lines = [
    <>① 选两个大素数 p = <b>{P}</b>, q = <b>{Q}</b></>,
    <>② 计算 n = p × q = <b>{N}</b>（公开模数）</>,
    <>③ 欧拉函数 φ(n) = (p-1)(q-1) = <b>{PHI}</b></>,
    <>④ 选公钥指数 e = <b>{E}</b>，满足 1 &lt; e &lt; φ(n) 且 gcd(e,φ)=1</>,
    <>⑤ 计算私钥 d = e⁻¹ mod φ(n) = <b>{D}</b>（满足 e·d ≡ 1 mod φ(n)）</>,
    <>
      ⑥ 公钥 = (e, n) = <b>({E}, {N})</b>；私钥 = (d, n) = <b>({D}, {N})</b>
    </>,
    <>⑦ 加密：C = M<sup>e</sup> mod n = {message}<sup>{E}</sup> mod {N} = <b>{c}</b></>,
    <>⑧ 解密：M = C<sup>d</sup> mod n = {c}<sup>{D}</sup> mod {N} = <b>{recovered}</b> ✓</>,
  ];

  return (
    <div className="crypto-card">
      <h4>🎯 RSA 加解密步骤演示（教学小数）</h4>

      <label style={{fontSize: 14, marginRight: 8}}>明文 M（数字）：</label>
      <input
        type="number"
        min={2}
        max={N - 1}
        value={message}
        onChange={(e) => setMessage(Math.min(N - 1, Math.max(2, Number(e.target.value))))}
        style={{
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid var(--ifm-color-emphasis-400)',
          width: 100,
          fontFamily: 'monospace',
        }}
      />
      <span style={{fontSize: 12, color: 'var(--ifm-color-emphasis-500)', marginLeft: 8}}>
        (须 &lt; n={N})
      </span>

      <div style={{marginTop: 16}}>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              opacity: i <= step ? 1 : 0.25,
              backgroundColor: i === step ? 'rgba(37,99,235,0.08)' : 'transparent',
            }}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              fontFamily: 'monospace',
              fontSize: 14,
              borderLeft:
                i === step ? '3px solid var(--ifm-color-primary)' : '3px solid transparent',
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      <Stepper total={lines.length - 1} onStepChange={setStep} />

      <div className="crypto-step-text">
        💡 考点：RSA 基于<strong>大整数分解难题</strong>；安全性依赖 n 足够大（≥2048 位）；
        公钥加密/私钥解密；数字签名则<strong>私钥签名/公钥验签</strong>；
        速度远慢于对称加密，常用于加密对称密钥(混合加密) + 数字签名。
      </div>
    </div>
  );
}
