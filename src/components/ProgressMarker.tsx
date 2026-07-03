import {useDoc} from '@docusaurus/plugin-content-docs/client';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useStudyProgress} from './useStudyProgress';

function ProgressMarkerInner() {
  const {metadata} = useDoc();
  const docId = metadata.id;
  const {getStatus, cycleStatus, LABELS} = useStudyProgress();
  const status = getStatus(docId);

  return (
    <div
      style={{
        position: 'fixed',
        right: 'max(16px, env(safe-area-inset-right))',
        bottom: 'max(80px, env(safe-area-inset-bottom))',
        zIndex: 100,
      }}
    >
      <button
        onClick={() => cycleStatus(docId)}
        aria-label="切换学习状态"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          minHeight: 44,
          borderRadius: 22,
          border: '1px solid var(--ifm-color-primary)',
          background:
            status === 'done'
              ? '#10b981'
              : status === 'learning'
                ? '#f59e0b'
                : 'var(--ifm-card-background-color)',
          color: status === 'unset' ? 'var(--ifm-color-primary)' : '#fff',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {LABELS[status]}
      </button>
    </div>
  );
}

export default function ProgressMarker() {
  return (
    <BrowserOnly fallback={null}>
      {() => <ProgressMarkerInner />}
    </BrowserOnly>
  );
}
