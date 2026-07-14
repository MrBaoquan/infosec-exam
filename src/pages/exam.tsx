import {useState, useEffect, useRef} from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {motion, AnimatePresence} from 'framer-motion';
import {useAnswerRecords, type QuestionType} from '../components/useAnswerRecords';

interface ExamQuestion {
  id: string;
  category?: string;
  topic?: string;
  type?: QuestionType;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
interface Exam {
  title: string;
  type: string;
  duration: number;
  questions: ExamQuestion[];
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function ExamPageContent() {
  const {recordAnswer} = useAnswerRecords();
  const [phase, setPhase] = useState<'menu' | 'exam' | 'result'>('menu');
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [curIdx, setCurIdx] = useState(0);
  const [remain, setRemain] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const examStartedAt = useRef(0);
  const recordedExam = useRef(false);

  const startExam = async (file: string) => {
    const res = await fetch(file);
    const data: Exam = await res.json();
    setExam(data);
    setAnswers({});
    setCurIdx(0);
    setRemain(data.duration * 60);
    examStartedAt.current = Date.now();
    recordedExam.current = false;
    setPhase('exam');
  };

  useEffect(() => {
    if (phase === 'exam' && remain > 0) {
      timerRef.current = setInterval(() => {
        setRemain((r) => {
          if (r <= 1) {
            setPhase('result');
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, remain === 0]);

  useEffect(() => {
    if (phase !== 'result' || !exam || recordedExam.current) return;
    recordedExam.current = true;
    const answeredCount = Object.keys(answers).length;
    const averageDuration = answeredCount > 0
      ? Math.round((Date.now() - examStartedAt.current) / answeredCount)
      : 0;

    exam.questions.forEach((question, index) => {
      const selected = answers[index];
      if (selected === undefined) return;
      recordAnswer({
        questionId: question.id,
        category: question.category || 'others',
        topic: question.topic,
        type: question.type,
        selected,
        correctAnswer: question.answer,
        isCorrect: selected === question.answer,
        durationMs: averageDuration,
        source: 'exam',
        questionText: question.question,
      });
    });
  }, [answers, exam, phase, recordAnswer]);

  const submit = () => setPhase('result');

  // 结果统计
  let correct = 0;
  let answered = 0;
  if (exam && phase === 'result') {
    exam.questions.forEach((q, i) => {
      if (answers[i] !== undefined) {
        answered++;
        if (answers[i] === q.answer) correct++;
      }
    });
  }
  const score = exam ? Math.round((correct / exam.questions.length) * 75) : 0;
  const passed = score >= 45;

  if (phase === 'menu') {
    return (
      <div>
        <h2 style={{marginTop: 0}}>📋 限时综合测验</h2>
        <p style={{color: 'var(--ifm-color-emphasis-600)', fontSize: 14}}>
          25 题限时训练，提供倒计时、答题卡和交卷判分；题量少于正式上午科目，用于阶段性检测。
        </p>
        <button
          className="crypto-btn"
          onClick={() => startExam('exams/exam-1.json')}
          style={{minHeight: 48, padding: '12px 24px', fontSize: 16}}
        >
          📝 综合测验一（25题·120分钟）
        </button>
      </div>
    );
  }

  if (phase === 'result' && exam) {
    return (
      <div className="crypto-card" style={{textAlign: 'center'}}>
        <h3>{passed ? '🎉 恭喜通过！' : '❌ 未及格'}</h3>
        <p style={{fontSize: 28, margin: '16px 0'}}>
          得分：<b style={{color: passed ? '#10b981' : '#ef4444'}}>{score}</b> / 75
        </p>
        <p style={{fontSize: 14, color: 'var(--ifm-color-emphasis-600)'}}>
          答对 {correct} / {exam.questions.length} 题 · 已答 {answered} 题
        </p>
        <div style={{textAlign: 'left', marginTop: 20}}>
          <h4>错题解析</h4>
          {exam.questions.map((q, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === q.answer;
            if (isCorrect) return null;
            return (
              <div
                key={q.id}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  borderRadius: 8,
                  background: '#ef444408',
                  borderLeft: '3px solid #ef4444',
                  fontSize: 13,
                }}
              >
                <div style={{fontWeight: 600}}>{i + 1}. {q.question}</div>
                <div style={{marginTop: 4}}>
                  正确答案：<b style={{color: '#10b981'}}>{String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}</b>
                </div>
                {userAns !== undefined && (
                  <div>你的答案：<span style={{color: '#ef4444'}}>{String.fromCharCode(65 + userAns)}. {q.options[userAns]}</span></div>
                )}
                <div style={{marginTop: 4, color: 'var(--ifm-color-emphasis-600)'}}>💡 {q.explanation}</div>
              </div>
            );
          })}
        </div>
        <button className="crypto-btn" onClick={() => setPhase('menu')} style={{marginTop: 16}}>
          返回
        </button>
      </div>
    );
  }

  // 考试中
  if (!exam) return null;
  const q = exam.questions[curIdx];

  return (
    <div>
      {/* 顶部状态栏 */}
      <div
        style={{
          position: 'sticky',
          top: 60,
          zIndex: 50,
          background: 'var(--ifm-background-color)',
          padding: '10px 12px',
          borderBottom: '1px solid var(--ifm-color-emphasis-300)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <span style={{fontSize: 13}}>{exam.title}</span>
        <span style={{fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: remain < 300 ? '#ef4444' : 'var(--ifm-color-primary)'}}>
          ⏱ {fmt(remain)}
        </span>
        <button className="crypto-btn" style={{minHeight: 36}} onClick={submit}>
          交卷
        </button>
      </div>

      {/* 题目 */}
      <div className="crypto-card">
        <div style={{fontSize: 13, color: 'var(--ifm-color-emphasis-600)', marginBottom: 8}}>
          第 {curIdx + 1} / {exam.questions.length} 题
        </div>
        <h4 style={{marginTop: 0}}>{q.question}</h4>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {q.options.map((opt, i) => {
            const isSelected = answers[curIdx] === i;
            return (
              <button
                key={i}
                onClick={() => setAnswers((a) => ({...a, [curIdx]: i}))}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  minHeight: 48,
                  borderRadius: 8,
                  background: isSelected ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-100)',
                  border: isSelected ? '2px solid var(--ifm-color-primary)' : '1px solid var(--ifm-color-emphasis-300)',
                  color: isSelected ? '#fff' : 'inherit',
                  fontSize: 15,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  touchAction: 'manipulation',
                }}
              >
                <b>{String.fromCharCode(65 + i)}.</b> {opt}
              </button>
            );
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16}}>
          <button
            className="crypto-btn crypto-btn-ghost"
            disabled={curIdx === 0}
            onClick={() => setCurIdx((i) => i - 1)}
          >
            上一题
          </button>
          {curIdx < exam.questions.length - 1 ? (
            <button className="crypto-btn" onClick={() => setCurIdx((i) => i + 1)}>
              下一题
            </button>
          ) : (
            <button className="crypto-btn" onClick={submit}>交卷</button>
          )}
        </div>
      </div>

      {/* 答题卡 */}
      <div className="crypto-card">
        <div style={{fontSize: 13, marginBottom: 8}}>答题卡（已答 {Object.keys(answers).length}/{exam.questions.length}）</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
          {exam.questions.map((_, i) => {
            const answered = answers[i] !== undefined;
            const isCur = i === curIdx;
            return (
              <button
                key={i}
                onClick={() => setCurIdx(i)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  border: isCur ? '2px solid var(--ifm-color-primary)' : '1px solid var(--ifm-color-emphasis-300)',
                  background: answered ? 'var(--ifm-color-primary)' : 'transparent',
                  color: answered ? '#fff' : 'inherit',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Layout title="限时综合测验" description="软考信息安全工程师限时综合测验">
      <main style={{padding: '24px 16px', maxWidth: 760, margin: '0 auto'}}>
        <BrowserOnly fallback={<div>加载中…</div>}>
          {() => <ExamPageContent />}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
