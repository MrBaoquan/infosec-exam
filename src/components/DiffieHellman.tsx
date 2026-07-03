import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Stepper from './Stepper';

/**
 * Diffie-Hellman 密钥交换 + 中间人攻击动画
 * 考点：DH 用于密钥协商（不加密、不认证）；无认证时易遭中间人攻击。
 */
const P = 23; // 公开素数（教学小数）
const G = 5;  // 公开原根

function modPow(base: number, exp: number, mod: number): number {
  let b = BigInt(base), e = BigInt(exp), m = BigInt(mod), r = 1n;
  b = b % m;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    e >>= 1n;
    b = (b * b) % m;
  }
  return Number(r);
}

function DhContent() {
  const [step, setStep] = useState(0);
  const [mitm, setMitm] = useState(false);

  // Alice 选 a=4, Bob 选 b=3, Eve(中间人) 选 e=2
  const a = 4, b = 3, e = 2;
  const A = modPow(G, a, P);  // 625 mod 23 = 4... 教学用直接算
  const B = modPow(G, b, P);
  const EveA = modPow(G, e, P);

  const K_alice = modPow(mitm ? EveA : B, a, P);
  const K_bob = modPow(mitm ? EveA : A, b, P);
  const K_eve_from_alice = modPow(A, e, P);
  const K_eve_from_bob = modPow(B, e, P);

  const steps = mitm ? [
    {from: 'Alice', to: 'Eve', label: `Alice 发送 A=${A}（被 Eve 截获）`, color: '#ef4444'},
    {from: 'Eve', to: 'Alice', label: `Eve 伪装成 Bob 发送 E=${EveA} 给 Alice`, color: '#ef4444'},
    {from: 'Bob', to: 'Eve', label: `Bob 发送 B=${B}（被 Eve 截获）`, color: '#ef4444'},
    {from: 'Eve', to: 'Bob', label: `Eve 伪装成 Alice 发送 E=${EveA} 给 Bob`, color: '#ef4444'},
    {from: 'result', label: `结果：Eve 与 Alice 共享 ${K_eve_from_alice}，与 Bob 共享 ${K_eve_from_bob}，可解密所有通信！`, color: '#dc2626'},
  ] : [
    {from: 'Alice', to: 'Bob', label: `公开参数：p=${P}, g=${G}`, color: '#3b82f6'},
    {from: 'Alice', label: `Alice 选私钥 a=${a}，计算公钥 A=g^a mod p=${A}，发送给 Bob`, color: '#3b82f6'},
    {from: 'Bob', label: `Bob 选私钥 b=${b}，计算公钥 B=g^b mod p=${B}，发送给 Alice`, color: '#10b981'},
    {from: 'Alice', label: `Alice 计算共享密钥 K=B^a mod p=${K_alice}`, color: '#3b82f6'},
    {from: 'Bob', label: `Bob 计算共享密钥 K=A^b mod p=${K_bob}（两者相等=${K_alice}）`, color: '#10b981'},
  ];

  const total = steps.length;
  const cur = steps[Math.min(step, total - 1)];

  return (
    <div className="crypto-card">
      <h4>🎯 Diffie-Hellman 密钥交换演示</h4>

      <div style={{margin: '12px 0', display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <button
          className="crypto-btn"
          onClick={() => { setMitm(false); setStep(0); }}
          style={!mitm ? {opacity: 1} : {opacity: 0.5}}
        >
          正常 DH
        </button>
        <button
          className="crypto-btn"
          onClick={() => { setMitm(true); setStep(0); }}
          style={mitm ? {opacity: 1, background: '#ef4444', borderColor: '#ef4444'} : {opacity: 0.5}}
        >
          中间人攻击
        </button>
      </div>

      {/* 三方示意 */}
      <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '24px 0', position: 'relative', minHeight: 100}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: 24}}>👩 Alice</div>
          <div style={{fontSize: 12, color: '#3b82f6'}}>a={a}{mitm && step >= 3 ? ` K=${K_alice}` : ''}</div>
        </div>
        {mitm && (
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 24}}>🕵️ Eve</div>
            <div style={{fontSize: 12, color: '#ef4444'}}>{step >= 4 ? `K_A=${K_eve_from_alice} K_B=${K_eve_from_bob}` : 'e=2'}</div>
          </div>
        )}
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: 24}}>👨 Bob</div>
          <div style={{fontSize: 12, color: '#10b981'}}>b={b}{mitm && step >= 4 ? ` K=${K_bob}` : ''}</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -10}}
          style={{
            padding: 12,
            borderRadius: 8,
            background: (cur?.color || '#3b82f6') + '11',
            borderLeft: `3px solid ${cur?.color || '#3b82f6'}`,
            fontSize: 14,
            fontFamily: 'monospace',
          }}
        >
          {cur?.label}
        </motion.div>
      </AnimatePresence>

      <Stepper total={total - 1} onStepChange={setStep} autoPlayInterval={1500} />

      <div className="crypto-step-text">
        💡 考点：DH 基于<strong>离散对数难题</strong>，用于<strong>密钥协商</strong>（不加密、不认证）；
        攻击者无法由 A/B 反推 a/b；但<strong>无身份认证→易遭中间人攻击</strong>，需结合数字签名/证书防御。
      </div>
    </div>
  );
}

export default function DiffieHellman() {
  return (
    <BrowserOnly fallback={<div className="crypto-card">加载 DH 演示…</div>}>
      {() => <DhContent />}
    </BrowserOnly>
  );
}
