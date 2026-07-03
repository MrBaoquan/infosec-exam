import { useState, useEffect, useCallback } from 'react';

const PROGRESS_KEY = 'infosec-study-progress';

export type Status = 'unset' | 'learning' | 'done';

export interface ProgressMap {
    [docId: string]: Status;
}

const ORDER: Status[] = ['unset', 'learning', 'done'];
const LABELS: Record<Status, string> = {
    unset: '⚪ 未学',
    learning: '🟡 学习中',
    done: '🟢 已掌握',
};

export function useStudyProgress() {
    const [progress, setProgress] = useState<ProgressMap>({});

    useEffect(() => {
        try {
            const raw = localStorage.getItem(PROGRESS_KEY);
            if (raw) setProgress(JSON.parse(raw));
        } catch {
            /* ignore */
        }
    }, []);

    const persist = useCallback((map: ProgressMap) => {
        setProgress(map);
        try {
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
        } catch {
            /* ignore */
        }
    }, []);

    const setStatus = useCallback((docId: string, status: Status) => {
        setProgress((prev) => {
            const next = { ...prev, [docId]: status };
            try {
                localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
            } catch {
                /* ignore */
            }
            return next;
        });
    }, []);

    const cycleStatus = useCallback(
        (docId: string) => {
            const cur = progress[docId] || 'unset';
            const next = ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length];
            setStatus(docId, next);
        },
        [progress, setStatus],
    );

    const getStatus = useCallback((docId: string): Status => progress[docId] || 'unset', [progress]);

    // 统计：给定 docId 列表，返回各状态计数与完成率
    const getStats = useCallback(
        (docIds: string[]) => {
            const counts = { unset: 0, learning: 0, done: 0 };
            docIds.forEach((id) => {
                counts[progress[id] || 'unset']++;
            });
            const total = docIds.length;
            const donePct = total === 0 ? 0 : Math.round((counts.done / total) * 100);
            return { counts, total, donePct };
        },
        [progress],
    );

    const clearAll = useCallback(() => persist({}), [persist]);

    return { progress, setStatus, cycleStatus, getStatus, getStats, clearAll, LABELS };
}
