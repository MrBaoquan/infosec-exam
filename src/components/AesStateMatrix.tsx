import {useState} from 'react';
import {motion} from 'framer-motion';
import Stepper from './Stepper';

/**
 * AES 轮变换动画：4×4 状态矩阵 + 四步轮变换逐步步进
 * 考点：AES 状态矩阵列优先排列；每轮 = SubBytes→ShiftRows→MixColumns→AddRoundKey
 * （末轮无 MixColumns）
 */
const STEPS = [
  {
    name: 'SubBytes',
    desc: '字节代换：每个字节通过 S 盒查表非线性替换，提供混淆(confusion)。',
    color: '#ef4444',
  },
  {
    name: 'ShiftRows',
    desc: '行移位：第 i 行循环左移 i 字节（0/1/2/3），实现扩散(diffusion)。',
    color: '#f59e0b',
  },
  {
    name: 'MixColumns',
    desc: '列混淆：每列在 GF(2^8) 上做矩阵乘法，进一步扩散。',
    color: '#10b981',
  },
  {
    name: 'AddRoundKey',
    desc: '轮密钥加：状态与轮密钥按位异或，引入密钥。',
    color: '#3b82f6',
  },
];

// 示例状态（列优先）
const INITIAL = [
  ['19', 'a0', '9a', 'e9'],
  ['3d', 'f4', 'c6', 'f8'],
  ['e3', 'e2', '8d', '2e'],
  ['be', 'a6', '08', '9c'],
];

// 每步变换后的示意结果（用于教学演示，非真实计算）
const AFTER: Record<string, string[][]> = {
  SubBytes: [
    ['d4', 'e0', 'b8', '1e'],
    ['27', 'bf', 'b4', '41'],
    ['11', '98', '5d', '31'],
    ['ae', '24', '30', 'de'],
  ],
  ShiftRows: [
    ['d4', 'e0', 'b8', '1e'],
    ['bf', 'b4', '41', '27'],
    ['5d', '31', '11', '98'],
    ['de', 'ae', '24', '30'],
  ],
  MixColumns: [
    ['04', 'e0', '48', '28'],
    ['66', 'cb', 'f8', '06'],
    ['81', '19', 'd3', '26'],
    ['e5', '9a', '7a', '4c'],
  ],
  AddRoundKey: [
    ['a4', '68', '6b', '02'],
    ['9c', '9f', '5b', '6a'],
    ['7f', '35', 'ea', '50'],
    ['f2', '2b', '43', '49'],
  ],
};

export default function AesStateMatrix() {
  const [step, setStep] = useState(0);

  // 当前显示的矩阵：step=0 显示初始，step=k 显示第 k 步后
  let matrix = INITIAL;
  if (step >= 1) matrix = AFTER.SubBytes;
  if (step >= 2) matrix = AFTER.ShiftRows;
  if (step >= 3) matrix = AFTER.MixColumns;
  if (step >= 4) matrix = AFTER.AddRoundKey;

  const currentStepInfo = step > 0 ? STEPS[step - 1] : null;

  return (
    <div className="crypto-card">
      <h4>🎯 AES 轮变换演示（状态矩阵列优先）</h4>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 56px)',
          gap: 6,
          justifyContent: 'center',
          margin: '16px auto',
        }}
      >
        {matrix.flat().map((byte, i) => {
          const row = Math.floor(i / 4);
          const highlight =
            currentStepInfo?.name === 'ShiftRows' ? row === (step) % 4 || step >= 2 : false;
          return (
            <motion.div
              key={i}
              layout
              animate={{
                scale: step > 0 ? 1 : 1,
                backgroundColor: currentStepInfo
                  ? currentStepInfo.color + '33'
                  : 'var(--ifm-color-emphasis-100)',
                borderColor: currentStepInfo ? currentStepInfo.color : 'transparent',
              }}
              style={{
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: 16,
                border: '2px solid',
                borderRadius: 6,
              }}
            >
              {byte}
            </motion.div>
          );
        })}
      </div>

      <div style={{display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap'}}>
        {STEPS.map((s, i) => (
          <span
            key={s.name}
            style={{
              fontSize: 12,
              padding: '2px 8px',
              borderRadius: 4,
              background: step >= i + 1 ? s.color + '33' : 'transparent',
              border: `1px solid ${step >= i + 1 ? s.color : 'var(--ifm-color-emphasis-300)'}`,
              color: step >= i + 1 ? s.color : 'var(--ifm-color-emphasis-500)',
            }}
          >
            {i + 1}.{s.name}
          </span>
        ))}
      </div>

      <Stepper
        total={4}
        stepText={(s) =>
          s === 0
            ? '初始状态矩阵（明文按列填入）。点击「自动播放」查看一轮变换。'
            : `第 ${s} 步 · ${STEPS[s - 1].name}：${STEPS[s - 1].desc}`
        }
        onStepChange={setStep}
      />

      <div className="crypto-step-text">
        💡 考点：AES 分组 128 位 = 16 字节 = 4×4 矩阵；AES-128 轮数 10；末轮无 MixColumns；
        字节代换用 S 盒；密钥扩展从 128 位主密钥扩展出 11 个轮密钥。
      </div>
    </div>
  );
}
