import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Stepper from './Stepper';

/**
 * 数字签名双向流程动画
 * 考点：私钥签名/公钥验签（发送方密钥对）；提供完整性+认证+不可否认（不提供机密性）
 */
const STEPS = [
  {
    title: '① 发送方：计算摘要',
    desc: 'Alice 对消息 M 计算哈希：H = Hash(M)',
    side: 'alice',
    color: '#3b82f6',
  },
  {
    title: '② 发送方：私钥签名',
    desc: 'Alice 用自己的私钥对摘要签名：S = H^d_Alice mod n',
    side: 'alice',
    color: '#3b82f6',
  },
  {
    title: '③ 发送 (M, S)',
    desc: 'Alice 将 消息 M 和 签名 S 一起发给 Bob',
    side: 'send',
    color: '#f59e0b',
  },
  {
    title: '④ 接收方：重算摘要',
    desc: 'Bob 收到后对 M 重新计算摘要：H\' = Hash(M)',
    side: 'bob',
    color: '#10b981',
  },
  {
    title: '⑤ 接收方：公钥验签',
    desc: 'Bob 用 Alice 的公钥解密签名：H\'\' = S^e_Alice mod n',
    side: 'bob',
    color: '#10b981',
  },
  {
    title: '⑥ 比对摘要',
    desc: '若 H\' == H\'\' 则验签成功：消息未被篡改 + 确认来自 Alice',
    side: 'bob',
    color: '#10b981',
  },
];

function SignatureContent() {
  const [step, setStep] = useState(0);
  const cur = STEPS[Math.min(step, STEPS.length - 1)];

  return (
    <div className="crypto-card">
      <h4>🎯 数字签名流程演示</h4>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '20px 0', gap: 8}}>
        <motion.div
          animate={{
            scale: cur.side === 'alice' ? 1.05 : 1,
            borderColor: cur.side === 'alice' ? '#3b82f6' : 'var(--ifm-color-emphasis-300)',
          }}
          style={{
            padding: 14,
            borderRadius: 10,
            border: '2px solid',
            textAlign: 'center',
            flex: 1,
            background: 'var(--ifm-card-background-color)',
          }}
        >
          <div style={{fontSize: 22}}>👩 Alice</div>
          <div style={{fontSize: 11, color: 'var(--ifm-color-emphasis-600)'}}>发送方</div>
          <div style={{fontSize: 11, marginTop: 4}}>私钥签名</div>
        </motion.div>

        <motion.div
          animate={{
            scale: cur.side === 'send' ? 1.05 : 1,
          }}
          style={{textAlign: 'center', flex: 1, alignSelf: 'center'}}
        >
          <div style={{fontSize: 28}}>✉️</div>
          <div style={{fontSize: 10, color: 'var(--ifm-color-emphasis-600)'}}>传输</div>
        </motion.div>

        <motion.div
          animate={{
            scale: cur.side === 'bob' ? 1.05 : 1,
            borderColor: cur.side === 'bob' ? '#10b981' : 'var(--ifm-color-emphasis-300)',
          }}
          style={{
            padding: 14,
            borderRadius: 10,
            border: '2px solid',
            textAlign: 'center',
            flex: 1,
            background: 'var(--ifm-card-background-color)',
          }}
        >
          <div style={{fontSize: 22}}>👨 Bob</div>
          <div style={{fontSize: 11, color: 'var(--ifm-color-emphasis-600)'}}>接收方</div>
          <div style={{fontSize: 11, marginTop: 4}}>公钥验签</div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{opacity: 0, x: 20}}
          animate={{opacity: 1, x: 0}}
          exit={{opacity: 0, x: -20}}
          style={{
            padding: 12,
            borderRadius: 8,
            background: cur.color + '11',
            borderLeft: `3px solid ${cur.color}`,
          }}
        >
          <div style={{fontWeight: 700, fontSize: 14}}>{cur.title}</div>
          <div style={{fontSize: 13, marginTop: 4, fontFamily: 'monospace'}}>{cur.desc}</div>
        </motion.div>
      </AnimatePresence>

      <Stepper total={STEPS.length - 1} onStepChange={setStep} autoPlayInterval={1400} />

      <div className="crypto-step-text">
        💡 考点：签名用<strong>发送方私钥</strong>，验签用<strong>发送方公钥</strong>；
        对<strong>摘要</strong>签名（非原文）；提供<strong>完整性+认证+不可否认</strong>，<strong>不提供机密性</strong>。
        与加密方向相反（加密用接收方公钥）。
      </div>
    </div>
  );
}

export default function SignatureDemo() {
  return (
    <BrowserOnly fallback={<div className="crypto-card">加载签名演示…</div>}>
      {() => <SignatureContent />}
    </BrowserOnly>
  );
}
