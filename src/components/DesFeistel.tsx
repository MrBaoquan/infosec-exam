import {useState, useMemo} from 'react';
import {motion} from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Stepper from './Stepper';

/**
 * DES Feistel 结构动画：16 轮迭代，每轮 L'=R, R'=L XOR f(R,Ki)
 * 考点：Feistel 网络 — 加解密结构相同仅子密钥逆序；分组 64 位，密钥 56 位有效。
 */
const ROUNDS = 16;

// 示意初始 L0/R0（32 位用十六进制 8 位表示）
const L0 = '0x19CCD1C4';
const R0 = '0x14A4DDF5';

// 简化轮函数 f 的示意输出（教学用，非真实 DES）
function fRound(r: string, round: number): string {
  // 用 hash 式变换示意
  let val = parseInt(r, 16) || 0;
  val = (val * 31 + round * 0x9e37 + 0x1234) >>> 0;
  return '0x' + val.toString(16).toUpperCase().padStart(8, '0').slice(0, 10);
}

function computeRounds(): {L: string; R: string; fOut: string}[] {
  const result = [{L: L0, R: R0, fOut: '-'}];
  let L = L0;
  let R = R0;
  for (let i = 1; i <= ROUNDS; i++) {
    const fOut = fRound(R, i);
    const newR = '0x' + (parseInt(L, 16) ^ parseInt(fOut, 16))
      .toString(16).toUpperCase().padStart(8, '0');
    const newL = R;
    result.push({L: newL, R: newR, fOut});
    L = newL;
    R = newR;
  }
  return result;
}

const ROUNDS_DATA = computeRounds();

export default function DesFeistel() {
  return (
    <BrowserOnly fallback={<div className="crypto-card">加载 DES 演示…</div>}>
      {() => <DesFeistelContent />}
    </BrowserOnly>
  );
}

function DesFeistelContent() {
  const rounds = useMemo(() => ROUNDS_DATA, []);
  const [step, setStep] = useState(0);
  const cur = rounds[step];

  return (
    <div className="crypto-card">
      <h4>🎯 DES Feistel 网络演示（16 轮）</h4>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          margin: '20px 0',
          fontFamily: 'monospace',
        }}
      >
        <motion.div
          key={`L-${step}`}
          initial={{opacity: 0, x: -20}}
          animate={{opacity: 1, x: 0}}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: 'var(--ifm-color-emphasis-100)',
            border: '2px solid #2563eb',
            minWidth: 130,
          }}
        >
          <div style={{fontSize: 12, color: '#2563eb'}}>L{step}</div>
          <div style={{fontWeight: 700}}>{cur.L}</div>
        </motion.div>

        <motion.div
          key={`R-${step}`}
          initial={{opacity: 0, x: 20}}
          animate={{opacity: 1, x: 0}}
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: 'var(--ifm-color-emphasis-100)',
            border: '2px solid #ef4444',
            minWidth: 130,
          }}
        >
          <div style={{fontSize: 12, color: '#ef4444'}}>R{step}</div>
          <div style={{fontWeight: 700}}>{cur.R}</div>
        </motion.div>
      </div>

      <div style={{textAlign: 'center', fontSize: 13, color: 'var(--ifm-color-emphasis-600)'}}>
        {step > 0 && (
          <>
            轮函数 f(R{step - 1}, K{step}) = <b>{cur.fOut}</b>
            <br />
            L{step} = R{step - 1} &nbsp;|&nbsp; R{step} = L{step - 1} ⊕ f(R{step - 1}, K{step})
          </>
        )}
        {step === 0 && <>初始：明文 64 位经初始置换 IP 分成 L0(左32) / R0(右32)</>}
      </div>

      <Stepper
        total={ROUNDS}
        autoPlayInterval={800}
        onStepChange={setStep}
        stepText={(s) =>
          s === 0
            ? '初始置换后进入第 1 轮。Feistel 每轮只动一半(R)，另一半(L)原样传递。'
            : `第 ${s} 轮完成。注意 L 总是等于上一轮的 R，这是 Feistel 解密可用同一结构的关键。`
        }
      />

      <div className="crypto-step-text">
        💡 考点：DES 分组 64 位 / 密钥 64 位(含 8 位校验)→有效 56 位 / 16 轮；
        Feistel 加解密结构相同，仅子密钥逆序使用(K16→K1)；3DES = DES 三次调用，密钥 112/168 位；
        DES 已不安全，被 AES 取代。
      </div>
    </div>
  );
}
