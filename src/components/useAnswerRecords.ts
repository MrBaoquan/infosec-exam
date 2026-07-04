import {useState, useEffect, useCallback} from 'react';

/**
 * 答题记录持久化系统
 *
 * 存储结构（localStorage）：
 * - infosec-answer-records：完整答题记录数组
 * - infosec-question-stats：按题目id聚合的统计
 *
 * 每条记录含：题目id/选择/正确答案/对错/模块/时间戳/用时/来源(练习/记忆/套卷)
 *
 * 导出格式支持 AI 分析：JSON / CSV
 */

const RECORDS_KEY = 'infosec-answer-records';
const STATS_KEY = 'infosec-question-stats';
const MAX_RECORDS = 2000; // 防止 localStorage 溢出

export interface AnswerRecord {
  questionId: string;       // 题目id（如 crypto-1）
  category: string;         // 模块（crypto/network/system/application/others）
  selected: number;         // 用户选择的选项索引
  correctAnswer: number;    // 正确答案索引
  isCorrect: boolean;       // 是否答对
  timestamp: number;        // 答题时间戳(ms)
  durationMs: number;       // 答题用时(ms)，0表示未记录
  source: 'practice' | 'spaced' | 'exam'; // 来源：练习/记忆/套卷
  questionText?: string;    // 题目文本（可选，便于离线分析）
}

export interface QuestionStat {
  questionId: string;
  category: string;
  totalAttempts: number;    // 总答题次数
  correctCount: number;     // 答对次数
  wrongCount: number;       // 答错次数
  lastResult: boolean;      // 最近一次对错
  lastTimestamp: number;    // 最近答题时间
  avgDurationMs: number;    // 平均用时
  streak: number;           // 连续答对次数（间隔重复用）
  mastered: boolean;        // 是否已掌握（连续答对≥2次）
}

export function useAnswerRecords() {
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [stats, setStats] = useState<Record<string, QuestionStat>>({});

  useEffect(() => {
    try {
      const rawRecords = localStorage.getItem(RECORDS_KEY);
      if (rawRecords) setRecords(JSON.parse(rawRecords));
      const rawStats = localStorage.getItem(STATS_KEY);
      if (rawStats) setStats(JSON.parse(rawStats));
    } catch {
      /* ignore */
    }
  }, []);

  /** 记录一次答题 */
  const recordAnswer = useCallback(
    (record: Omit<AnswerRecord, 'timestamp'>) => {
      const fullRecord: AnswerRecord = {
        ...record,
        timestamp: Date.now(),
      };

      setRecords((prev) => {
        const next = [...prev, fullRecord];
        // 超出上限则丢弃最早的
        if (next.length > MAX_RECORDS) {
          next.splice(0, next.length - MAX_RECORDS);
        }
        try {
          localStorage.setItem(RECORDS_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });

      // 更新统计
      setStats((prev) => {
        const existing = prev[record.questionId] || {
          questionId: record.questionId,
          category: record.category,
          totalAttempts: 0,
          correctCount: 0,
          wrongCount: 0,
          lastResult: false,
          lastTimestamp: 0,
          avgDurationMs: 0,
          streak: 0,
          mastered: false,
        };

        const newStreak = record.isCorrect ? existing.streak + 1 : 0;
        const updated: QuestionStat = {
          ...existing,
          totalAttempts: existing.totalAttempts + 1,
          correctCount: existing.correctCount + (record.isCorrect ? 1 : 0),
          wrongCount: existing.wrongCount + (record.isCorrect ? 0 : 1),
          lastResult: record.isCorrect,
          lastTimestamp: fullRecord.timestamp,
          avgDurationMs: record.durationMs > 0
            ? Math.round((existing.avgDurationMs * existing.totalAttempts + record.durationMs) / (existing.totalAttempts + 1))
            : existing.avgDurationMs,
          streak: newStreak,
          mastered: newStreak >= 2,
        };

        const next = {...prev, [record.questionId]: updated};
        try {
          localStorage.setItem(STATS_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  /** 获取某模块的统计 */
  const getCategoryStats = useCallback(
    (category: string) => {
      const catStats = Object.values(stats).filter((s) => s.category === category);
      const total = catStats.reduce((sum, s) => sum + s.totalAttempts, 0);
      const correct = catStats.reduce((sum, s) => sum + s.correctCount, 0);
      const mastered = catStats.filter((s) => s.mastered).length;
      const uniqueQuestions = catStats.length;
      return {
        totalAttempts: total,
        correctCount: correct,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        mastered,
        uniqueQuestions,
        masteryRate: uniqueQuestions > 0 ? Math.round((mastered / uniqueQuestions) * 100) : 0,
      };
    },
    [stats],
  );

  /** 获取全量统计 */
  const getOverallStats = useCallback(() => {
    const allStats = Object.values(stats);
    const total = allStats.reduce((sum, s) => sum + s.totalAttempts, 0);
    const correct = allStats.reduce((sum, s) => sum + s.correctCount, 0);
    const mastered = allStats.filter((s) => s.mastered).length;
    return {
      totalAttempts: total,
      correctCount: correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      totalQuestions: allStats.length,
      mastered,
      masteryRate: allStats.length > 0 ? Math.round((mastered / allStats.length) * 100) : 0,
    };
  }, [stats]);

  /** 获取错题列表（未掌握的题目id） */
  const getUnmasteredQuestions = useCallback(() => {
    return Object.values(stats)
      .filter((s) => !s.mastered && s.totalAttempts > 0)
      .sort((a, b) => b.wrongCount - a.wrongCount) // 错得多的排前面
      .map((s) => s.questionId);
  }, [stats]);

  /** 导出为JSON（供AI分析） */
  const exportJSON = useCallback(() => {
    const data = {
      exportTime: new Date().toISOString(),
      records,
      stats,
      overall: getOverallStats(),
    };
    return JSON.stringify(data, null, 2);
  }, [records, stats, getOverallStats]);

  /** 导出为CSV（供Excel/AI分析） */
  const exportCSV = useCallback(() => {
    const headers = ['questionId', 'category', 'selected', 'correctAnswer', 'isCorrect', 'timestamp', 'durationMs', 'source'];
    const rows = records.map((r) => [
      r.questionId,
      r.category,
      r.selected,
      r.correctAnswer,
      r.isCorrect ? '1' : '0',
      new Date(r.timestamp).toISOString(),
      r.durationMs,
      r.source,
    ]);
    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  }, [records]);

  /** 下载导出文件 */
  const downloadExport = useCallback((format: 'json' | 'csv') => {
    const content = format === 'json' ? exportJSON() : exportCSV();
    const blob = new Blob([content], {type: format === 'json' ? 'application/json' : 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infosec-answer-records-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportJSON, exportCSV]);

  /** 清空所有记录 */
  const clearAll = useCallback(() => {
    setRecords([]);
    setStats({});
    try {
      localStorage.removeItem(RECORDS_KEY);
      localStorage.removeItem(STATS_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return {
    records,
    stats,
    recordAnswer,
    getCategoryStats,
    getOverallStats,
    getUnmasteredQuestions,
    exportJSON,
    exportCSV,
    downloadExport,
    clearAll,
  };
}
