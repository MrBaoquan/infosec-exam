import {useState, useMemo, useRef} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useWrongQuestions} from './useWrongQuestions';
import {useAnswerRecords} from './useAnswerRecords';

export interface Question {
  id: string;
  category: string;
  topic: string;
  type: 'scenario' | 'concept' | 'parameter' | 'comprehensive' | 'calculation';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QuizProps {
  questions: Question[];
  title: string;
  /** 只做错题模式：传入错题 id 集合 */
  wrongOnly?: string[];
  onExit: () => void;
}

function QuizContent({questions, title, wrongOnly, onExit}: QuizProps) {
  const {addWrong, removeWrong} = useWrongQuestions();
  const {recordAnswer} = useAnswerRecords();
  const list = useMemo(
    () => (wrongOnly ? questions.filter((q) => wrongOnly.includes(q.id)) : questions),
    [questions, wrongOnly],
  );

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const questionStartedAt = useRef(Date.now());

  if (list.length === 0) {
    return (
      <div className="crypto-card">
        <p>没有题目可练习。</p>
        <button className="crypto-btn" onClick={onExit}>
          返回
        </button>
      </div>
    );
  }

  const cur = list[idx];

  const submit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    const isCorrect = selected === cur.answer;
    recordAnswer({
      questionId: cur.id,
      category: cur.category,
      topic: cur.topic,
      type: cur.type,
      selected,
      correctAnswer: cur.answer,
      isCorrect,
      durationMs: Date.now() - questionStartedAt.current,
      source: 'practice',
      questionText: cur.question,
    });
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      removeWrong(cur.id); // 答对则移出错题本
    } else {
      addWrong(cur.id); // 答错加入错题本
    }
  };

  const next = () => {
    if (idx + 1 >= list.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null);
    setSubmitted(false);
    questionStartedAt.current = Date.now();
  };

  if (done) {
    const pct = Math.round((correctCount / list.length) * 100);
    return (
      <div className="crypto-card" style={{textAlign: 'center'}}>
        <h4>🎉 练习完成</h4>
        <p style={{fontSize: 18}}>
          得分：<b style={{color: pct >= 60 ? '#10b981' : '#ef4444'}}>{correctCount}</b> /{' '}
          {list.length}（{pct}%）
        </p>
        <p style={{fontSize: 13, color: 'var(--ifm-color-emphasis-600)'}}>
          {pct >= 60 ? '及格！继续巩固' : '需加强，建议重做错题'}
        </p>
        <button className="crypto-btn" onClick={onExit}>
          返回题库
        </button>
      </div>
    );
  }

  return (
    <div className="crypto-card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          fontSize: 13,
          color: 'var(--ifm-color-emphasis-600)',
        }}
      >
        <button
          className="crypto-btn crypto-btn-ghost"
          style={{minHeight: 0, padding: '4px 10px'}}
          onClick={onExit}
        >
          ← 返回
        </button>
        <span>
          {title} · 第 {idx + 1} / {list.length} 题
        </span>
      </div>

      {/* 进度条 */}
      <div style={{height: 4, background: 'var(--ifm-color-emphasis-200)', borderRadius: 2, marginBottom: 16}}>
        <motion.div
          animate={{width: `${((idx + (submitted ? 1 : 0)) / list.length) * 100}%`}}
          style={{height: '100%', background: 'var(--ifm-color-primary)', borderRadius: 2}}
        />
      </div>

      <h4 style={{marginTop: 0}}>{cur.question}</h4>

      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        {cur.options.map((opt, i) => {
          const isSelected = selected === i;
          const isAnswer = i === cur.answer;
          let bg = 'var(--ifm-color-emphasis-100)';
          let border = '1px solid var(--ifm-color-emphasis-300)';
          if (submitted) {
            if (isAnswer) {
              bg = '#10b98122';
              border = '2px solid #10b981';
            } else if (isSelected) {
              bg = '#ef444422';
              border = '2px solid #ef4444';
            }
          } else if (isSelected) {
            bg = 'var(--ifm-color-primary)';
            border = '2px solid var(--ifm-color-primary)';
          }
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setSelected(i)}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                minHeight: 48,
                borderRadius: 8,
                background: bg,
                border,
                cursor: submitted ? 'default' : 'pointer',
                color: isSelected && !submitted ? '#fff' : 'inherit',
                fontSize: 15,
                fontFamily: 'inherit',
                touchAction: 'manipulation',
              }}
            >
              <b>{String.fromCharCode(65 + i)}.</b> {opt}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background:
                selected === cur.answer
                  ? '#10b98111'
                  : '#ef444411',
              borderLeft: `3px solid ${selected === cur.answer ? '#10b981' : '#ef4444'}`,
            }}
          >
            <b>{selected === cur.answer ? '✓ 回答正确' : '✗ 回答错误'}</b>
            <div style={{fontSize: 13, marginTop: 6, lineHeight: 1.6}}>
              💡 {cur.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{marginTop: 16}}>
        {!submitted ? (
          <button
            className="crypto-btn"
            disabled={selected === null}
            onClick={submit}
            style={{width: '100%', minHeight: 44}}
          >
            提交答案
          </button>
        ) : (
          <button
            className="crypto-btn"
            onClick={next}
            style={{width: '100%', minHeight: 44}}
          >
            {idx + 1 >= list.length ? '查看结果' : '下一题 →'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Quiz(props: QuizProps) {
  return (
    <BrowserOnly fallback={<div className="crypto-card">加载题库…</div>}>
      {() => <QuizContent {...props} />}
    </BrowserOnly>
  );
}
