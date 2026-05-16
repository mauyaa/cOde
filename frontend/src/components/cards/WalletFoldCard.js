/**
 * WalletFoldCard — Dashboard order row concept.
 *
 * Internal structure:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ [BADGE: status]     Order #001       ·   KES 2 856          │ ← header band
 * ├───                                                           │
 * │   Body text: 2-column definition rows                       │
 * │   · 2 kg tomatoes                                            │
 * │   · Delivered Tue, 12 May at 09:30                           │
 * │   · M-Pesa                                                   │
 * └──┴────────────────────────────────────────────────────────────┘
 * └─ Confirm              Complete             Cancel             │ ← coloured action bands
 * └──────────────────────────────────────────────────────────────┘
 *
 * Cadence: the value and the status badge appear on one row so a
 * farmer or buyer at a glance always sees confirmed state and amount
 * together — no readback loop required between left and right.
 */

import { useState } from 'react';
import StatusChip from '../StatusChip';

const KES = new window.Intl.NumberFormat('en-KE', {
  style: 'currency', currency: 'KES', maximumFractionDigits: 0,
});
const VERB = { pending: 'Confirm', confirmed: 'Complete', completed: 'Done', cancelled: 'Cancelled' };
const TARGET = { pending: 'confirmed', confirmed: 'completed' };

export default function WalletFoldCard({
  id, productName, buyerName, sellerName,
  quantity, productUnit, totalAmount, paymentMethod,
  status, createdAt, updatedAt,
  isFarmer, currency,
  onStatusChange,
}) {
  const [animating, setAnimating] = useState(false);
  const [flashColor, setFlashColor] = useState(null);

  const handleAction = async (target) => {
    setFlashColor(target === 'completed' ? '#2E6B41' : '#D3EDDC');
    setAnimating(true);
    try {
      await onStatusChange?.(id, target);
    } finally {
      setTimeout(() => { setAnimating(false); setFlashColor(null); }, 320);
    }
  };

  const canConfirm   = isFarmer && status === 'pending';
  const canComplete  = isFarmer && status === 'confirmed';
  const canCancel    = isFarmer && (status === 'pending' || status === 'confirmed');

  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <article
      role="article"
      aria-label={`Order ${productName}`}
      style={{
        borderTop: `1px solid var(--colors-horizon, #E8E4DC)`,
        padding: '0 0',
        fontFamily: 'inherit',
        position: 'relative',
        overflow: 'hidden',
        transition: 'opacity 180ms ease',
        opacity: animating ? 0.65 : 1,
      }}
    >
      {/* Flash sweep on status change */}
      {flashColor && (
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: flashColor,
            opacity: 0.08,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* Header band — identity + value + status right-aligned */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto auto',
          columnGap: '12px 20px',
          padding: '14px 0 8px',
          alignItems: 'baseline',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ minWidth: '130px' }}>
          <time
            dateTime={createdAt}
            style={{
              fontSize: '0.625rem',
              color: 'var(--colors-quiet, #948D82)',
              fontFamily: 'var(--font-mono, "SF Mono", monospace)',
              letterSpacing: '0.02em',
            }}
          >
            {fmtDate(createdAt)}
          </time>
        </div>

        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--colors-ink, #13110F)',
              fontFamily: 'inherit',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={productName}
          >
            {productName || '—'}
          </h3>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: '0.625rem',
              color: 'var(--colors-ghost, #BAB3A8)',
            }}
          >
            {buyerName || sellerName || '—'}
            {quantity ? <> · {quantity}{productUnit || ' units'}</> : null}
          </p>
        </div>

        <div style={{ textAlign: 'right', minWidth: '80px' }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--colors-ink, #13110F)',
            letterSpacing: '-0.01em',
          }}>
            {KES.format(totalAmount || 0)}
          </div>
          {paymentMethod && (
            <div style={{ fontSize: '0.563rem', color: 'var(--colors-ghost)', marginTop: '1px' }}>
              {paymentMethod}
            </div>
          )}
        </div>

        <StatusChip status={status} size="small" />
      </div>

      {/* Footer action band */}
      <div
        role="toolbar"
        aria-label={`Order actions for ${productName}`}
        style={{
          display: 'flex',
          gap: '6px',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '4px 0 14px',
          position: 'relative',
          zIndex: 1,
        }}
        data-testid="wallet-fold-actions"
      >
        {canConfirm && (
          <button
            onClick={() => handleAction('confirmed')}
            title="Mark as confirmed"
            style={{
              border: `1px solid var(--colors-green200, #D3EDDC)`,
              borderRadius: '4px',
              background: 'none',
              color: 'var(--colors-green600, #235132)',
              cursor: 'pointer',
              padding: '4px 12px',
              fontFamily: 'inherit',
              fontSize: '0.688rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
              transition: 'background 120ms ease, color 120ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--colors-green50, #EDF7F0)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            Confirm
          </button>
        )}
        {canComplete && (
          <button
            onClick={() => handleAction('completed')}
            title="Mark as completed"
            style={{
              border: 'none',
              borderRadius: '4px',
              background: 'var(--colors-green600, #235132)',
              color: '#FAF9F6',
              cursor: 'pointer',
              padding: '5px 14px',
              fontFamily: 'inherit',
              fontSize: '0.688rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            Done
          </button>
        )}
        {canCancel && (
          <button
            onClick={() => handleAction('cancelled')}
            title="Cancel order"
            style={{
              border: `1px solid var(--colors-horizon, #E8E4DC)`,
              borderRadius: '4px',
              background: 'transparent',
              color: 'var(--colors-muted, #6B645B)',
              cursor: 'pointer',
              padding: '4px 12px',
              fontFamily: 'inherit',
              fontSize: '0.688rem',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </article>
  );
}
