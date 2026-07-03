import {useState, useEffect, useCallback} from 'react';

const WRONG_KEY = 'infosec-wrong-questions';

/** 错题本：localStorage 持久化错题 id 集合 */
export function useWrongQuestions() {
  const [wrong, setWrong] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WRONG_KEY);
      if (raw) setWrong(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((list: string[]) => {
    setWrong(list);
    try {
      localStorage.setItem(WRONG_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }, []);

  const addWrong = useCallback(
    (id: string) => {
      setWrong((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        try {
          localStorage.setItem(WRONG_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const removeWrong = useCallback((id: string) => {
    setWrong((prev) => {
      const next = prev.filter((x) => x !== id);
      try {
        localStorage.setItem(WRONG_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clearWrong = useCallback(() => persist([]), [persist]);

  return {wrong, addWrong, removeWrong, clearWrong};
}
