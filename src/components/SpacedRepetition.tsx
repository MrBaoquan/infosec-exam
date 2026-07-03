import {useState, useEffect, useRef, useMemo} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QueueItem {
  q: Question;
  /** 当前队列位置（0=当前题） */
  /** 答错次数 */
  wrongCount: number;
  /** 答对次数（连续） */
  streak: number;
  /** 下次出现的间隔（题数） */
  nextDelay: number;
  /** 已"毕业"(连续答对≥2次) */
  mastered: boolean;
}

interface Props {
  questions: Question[];
  title: string;
  onExit: () => void;
}

/**
 * 间隔重复记忆模式（Spaced Repetition）：
 * - 答错→间隔 3 题后再次出现，wrongCount++
 * - 答对→streak++，连续答对 2 次则"毕业"
 * - 答错重置 streak，间隔逐步拉长(3→5→8 题)
 * - 全部毕业则完成
 *
 * 灵感来自 SM-2 / Anki 算法，简化为题内间隔。
 */
function SpacedRepetitionContent({questions, title, onExit}: Props) {
  // 队列：当前待答题目有序列表，index 0 是当前题
  const [queue, setQueue] = useState<QueueItem[]>(() =>
    questions.map((q) => ({
      q,
      wrongCount: 0,
      streak: 0,
      nextDelay: 0,
      mastered: false,
    })),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [stats, setStats] = useState({answered: 0, correct: 0, mastered: 0});
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');

  // 打乱初始顺序
  const shuffled = useMemo(() => {
    const arr = [...queue];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setQueue(shuffled);
  }, [shuffled]);

  const cur = queue[0];

  const submit = () => {
    if (selected === null || submitted || !cur) return;
    setSubmitted(true);
    const isCorrect = selected === cur.q.answer;
    setLastResult(isCorrect ? 'correct' : 'wrong');
    setStats((s) => ({
      answered: s.answered + 1,
      correct: s.correct + (isCorrect ? 1 : 0),
      mastered: s.mastered,
    }));

    if (isCorrect) {
      const newStreak = cur.streak + 1;
      if (newStreak >= 2) {
        // 毕业
        setFeedback('✓ 连续答对2次，已掌握！此题不再出现。');
        setStats((s) => ({...s, mastered: s.mastered + 1}));
      } else {
        setFeedback('✓ 答对！再答对1次即掌握。');
      }
    } else {
      setFeedback(`✗ 答错。此题将在 ${cur.nextDelay === 0 ? 3 : cur.nextDelay} 题后再次出现。`);
    }
  };

  const next = () => {
    if (!cur) return;
    const isCorrect = selected === cur.q.answer;
    const newStreak = isCorrect ? cur.streak + 1 : 0;
    const mastered = isCorrect && newStreak >= 2;

    setQueue((prev) => {
      const [current, ...rest] = prev;
      if (mastered) {
        // 毕业：移出队列
        const newQueue = rest;
        if (newQueue.length === 0) setDone(true);
        return newQueue;
      }
      // 重新插入队列：答错间隔3题，答对(但未毕业)间隔5题，连续错则间隔更长
      const delay = isCorrect ? 5 : Math.min(8, 3 + current.wrongCount);
      const updated: QueueItem = {
        ...current,
        streak: newStreak,
        wrongCount: isCorrect ? current.wrongCount : current.wrongCount + 1,
        nextDelay: delay,
      };
      // 插入到 delay 位置（不超过队列长度）
      const insertPos = Math.min(delay, rest.length);
      const newQueue = [...rest.slice(0, insertPos), updated, ...rest.slice(insertPos)];
      if (newQueue.length === 0) setDone(true);
      return newQueue;
    });

    setSelected(null);
    setSubmitted(false);
    setLastResult(null);
    setFeedback('');
  };

  if (done || (!cur && !submitted)) {
    const pct = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;
    return (
      <div className="crypto-card" style={{textAlign: 'center'}}>
        <h4>🎉 记忆训练完成！</h4>
        <p style={{fontSize: 18}}>
          全部 {questions.length} 题已掌握
        </p>
        <p style={{fontSize: 13, color: 'var(--ifm-color-emphasis-600)'}}>
          共答题 {stats.answered} 次，答对 {stats.correct} 次（{pct}%）
        </p>
        <p style={{fontSize: 13, color: 'var(--ifm-color-emphasis-500)'}}>
          💡 间隔重复原理：答错的题反复出现，答对的题逐步拉长间隔，直到稳定记忆。
        </p>
        <button className="crypto-btn" onClick={onExit}>返回题库</button>
      </div>
    );
  }

  if (!cur) return null;

  const remaining = queue.filter((item) => !item.mastered).length;

  return (
    <div className="crypto-card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 13, flexWrap: 'wrap', gap: 8}}>
        <button className="crypto-btn crypto-btn-ghost" style={{minHeight: 0, padding: '4px 10px'}} onClick={onExit}>← 返回</button>
        <span>🧠 {title} · 记忆模式</span>
        <span>剩余 {remaining} 题</span>
      </div>

      {/* 进度条 */}
      <div style={{height: 4, background: 'var(--ifm-color-emphasis-200)', borderRadius: 2, marginBottom: 16}}>
        <motion.div
          animate={{width: `${(stats.mastered / questions.length) * 100}%`}}
          style={{height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: 2}}
        />
      </div>
      <div style={{fontSize: 11, color: 'var(--ifm-color-emphasis-500)', marginBottom: 12}}>
        已掌握 {stats.mastered}/{questions.length} · 答题 {stats.answered} 次
      </div>

      <h4 style={{marginTop: 0}}>{cur.q.question}</h4>

      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        {cur.q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isAnswer = i === cur.q.answer;
          let bg = 'var(--ifm-color-emphasis-100)';
          let border = '1px solid var(--ifm-color-emphasis-300)';
          if (submitted) {
            if (isAnswer) { bg = '#10b98122'; border = '2px solid #10b981'; }
            else if (isSelected) { bg = '#ef444422'; border = '2px solid #ef4444'; }
          } else if (isSelected) {
            bg = 'var(--ifm-color-primary)'; border = '2px solid var(--ifm-color-primary)';
          }
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setSelected(i)}
              style={{
                textAlign: 'left', padding: '12px 16px', minHeight: 48, borderRadius: 8,
                background: bg, border, cursor: submitted ? 'default' : 'pointer',
                color: isSelected && !submitted ? '#fff' : 'inherit', fontSize: 15, fontFamily: 'inherit',
                touchAction: 'manipulation',
              }}
            >
              <b>{String.fromCharCode(65 + i)}.</b> {opt}
              {submitted && isAnswer && cur.streak > 0 && !isSelected && (
                <span style={{fontSize: 11, marginLeft: 8, color: '#10b981'}}>(第{cur.streak + 1}次答对即掌握)</span>
              )}
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
              marginTop: 14, padding: 12, borderRadius: 8,
              background: lastResult === 'correct' ? '#10b98111' : '#ef444411',
              borderLeft: `3px solid ${lastResult === 'correct' ? '#10b981' : '#ef4444'}`,
            }}
          >
            <b>{feedback}</b>
            <div style={{fontSize: 13, marginTop: 6, lineHeight: 1.6}}>💡 {cur.q.explanation}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{marginTop: 16}}>
        {!submitted ? (
          <button className="crypto-btn" disabled={selected === null} onClick={submit} style={{width: '100%', minHeight: 44}}>
            提交答案
          </button>
        ) : (
          <button className="crypto-btn" onClick={next} style={{width: '100%', minHeight: 44}}>
            下一题 →
          </button>
        )}
      </div>

      {cur.wrongCount > 0 && (
        <div style={{fontSize: 11, color: '#ef4444', marginTop: 8, textAlign: 'center'}}>
          此题已答错 {cur.wrongCount} 次，加强记忆中
        </div>
      )}
    </div>
  );
}

export default function SpacedRepetition(props: Props) {
  return (
    <BrowserOnly fallback={<div className="crypto-card">加载记忆训练…</div>}>
      {() => <SpacedRepetitionContent {...props} />}
    </BrowserOnly>
  );
}
