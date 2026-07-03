// PWA reload popup 占位组件
// 解决 dev 模式下 @docusaurus/plugin-pwa 解析 @theme/PwaReloadPopup 失败的问题。
// 生产构建时插件会注入真实实现；此处提供空 fallback 避免编译错误。
import React from 'react';
import type {Props} from '@theme/PwaReloadPopup';

export default function PwaReloadPopup({isReloadRequired, onReload}: Props): JSX.Element | null {
  if (!isReloadRequired) return null;
  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 20,
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'var(--ifm-color-primary)',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxWidth: '90vw',
      }}
    >
      <span style={{fontSize: 14}}>有新内容，请刷新</span>
      <button
        onClick={onReload}
        style={{
          background: '#fff',
          color: 'var(--ifm-color-primary)',
          border: 'none',
          borderRadius: 4,
          padding: '6px 14px',
          minHeight: 36,
          cursor: 'pointer',
          fontWeight: 600,
          fontFamily: 'inherit',
        }}
      >
        刷新
      </button>
    </div>
  );
}
