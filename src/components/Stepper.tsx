import {useState, useEffect, useRef} from 'react';

interface StepperProps {
  total: number;
  stepText?: (step: number) => string;
  onStepChange?: (step: number) => void;
  autoPlayInterval?: number;
}

/**
 * 通用步骤播放器：上一步 / 下一步 / 自动播放 / 重置
 * 密码学动画组件复用它来逐轮演示。
 */
export default function Stepper({
  total,
  stepText,
  onStepChange,
  autoPlayInterval = 1200,
}: StepperProps) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep((s) => {
          if (s >= total) {
            setPlaying(false);
            return total;
          }
          return s + 1;
        });
      }, autoPlayInterval);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, total, autoPlayInterval]);

  return (
    <div style={{marginTop: 12}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
        <button
          className="crypto-btn crypto-btn-ghost"
          onClick={() => {
            setPlaying(false);
            setStep(0);
          }}
        >
          ⏮ 重置
        </button>
        <button
          className="crypto-btn crypto-btn-ghost"
          disabled={step === 0}
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.max(0, s - 1));
          }}
        >
          ⏪ 上一步
        </button>
        <button
          className="crypto-btn"
          disabled={step >= total}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? '⏸ 暂停' : '▶ 自动播放'}
        </button>
        <button
          className="crypto-btn crypto-btn-ghost"
          disabled={step >= total}
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(total, s + 1));
          }}
        >
          下一步 ⏩
        </button>
        <span style={{fontSize: 13, color: 'var(--ifm-color-emphasis-600)'}}>
          步骤 {step} / {total}
        </span>
      </div>
      {stepText && <div className="crypto-step-text">{stepText(step)}</div>}
    </div>
  );
}
