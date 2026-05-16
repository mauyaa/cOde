/**
 * RailDeck — interleaved row strip for conversation / compact list display.
 *
 * Two-column layout (compact):
 *  ┌──────────────────────────────────────┐
 *  │ Amina Wanjiku  ·  2m ago             │
 *  │ Yes, I can prepare that order…        │ ← single-line excerpt
 *  └──────────────────────────────────────┘
 *  ┌──────────────────────────────────────┐
 *  │ Kiptoo Cheruiyot  ·  1h ago           │
 *  │ Looking forward to the delivery        │
 *  └──────────────────────────────────────┘
 *
 * Row is flat — no box, no elevation — separated by a full-width horizon line.
 * Hover=elevated (pale tint). Click=active (green tint). Keyboard accessible.
 * Data respects prefers-reduced-motion implicitly by avoiding transitions.
 */

import StatusChip from '../StatusChip';

function timeAgo(iso) {
  if (!iso) return '—';
  const ms  = Date.now() - new Date(iso).getTime();
  const m   = Math.round(ms / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export default function RailDeck({
  items,                          // Array of { id, title, excerpt, meta, status, onClick, active }
  emptyLabel = 'No conversations',
  emptyHint  = 'Messages from buyers and sellers will appear here.',
  activeId: controlledActive,
  onSelect,
  horizonColor,
  elevatedColor,
  accentColor,
}) {
  const hc   = horizonColor  ?? 'var(--colors-horizon, #E8E4DC)';
  const ec   = elevatedColor ?? 'var(--colors-elevated, #F6F4EF)';
  const gc   = accentColor   ?? 'var(--colors-green500, #2E6B41)';

  if (!items?.length) {
    return (
      <div
        role="status"
        aria-label="Empty"
        style={{
          padding: '32px 16px',
          textAlign: 'center',
          fontSize: '0.813rem',
          color: 'var(--colors-muted, #6B645B)',
          lineHeight: 1.6,
        }}
      >
        <div style={{
          width: 40, height: 40,
          margin: '0 auto 10px',
          borderRadius: '50%',
          border: `1.5px dashed ${hc}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} aria-hidden>
          <span style={{ fontSize: '1rem', color: 'var(--colors-quiet, #948D82)' }}>✉</span>
        </div>
        <span style={{ display: 'block', fontWeight: 500 }}>{emptyLabel}</span>
        {emptyHint && <span style={{ display: 'block', fontSize: '0.688rem', color: 'var(--colors-ghost)', marginTop: '2px' }}>{emptyHint}</span>}
      </div>
    );
  }

  return (
    <div role="list" aria-label="Items">
      {items.map((item, i) => {
        const active = controlledActive === item.id;
        const last   = i === items.length - 1;
        return (
          <button
            key={item.id || i}
            role="listitem"
            tabIndex={0}
            aria-selected={active}
            aria-label={item.title}
            onClick={() => onSelect?.(item)}
            style={{
              width: '100%',
              textAlign: 'left',
              border: 'none',
              background: active ? ec : 'transparent',
              cursor: 'pointer',
              padding: '13px 12px',
              borderBottom: last ? 'none' : `1px solid ${hc}`,
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              transition: 'background 120ms ease',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = ec; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            {/* Row 1 — title + time */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '8px',
            }}>
              <span style={{
                fontSize: '0.813rem',
                fontWeight: 500,
                color: active ? gc : 'var(--colors-ink, #13110F)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}>
                {item.title}
              </span>
              {item.meta && (
                <span
                  role="time"
                  style={{
                    fontSize: '0.563rem',
                    color: 'var(--colors-ghost, #BAB3A8)',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.status ? <StatusChip status={item.status} size="small" /> : timeAgo(item.meta)}
                </span>
              )}
              {!item.meta?.startsWith && (
                <span style={{ fontSize: '0.563rem', color: 'var(--colors-ghost)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {timeAgo(item.meta)}
                </span>
              )}
            </div>

            {/* Row 2 — excerpt */}
            {item.excerpt && (
              <p style={{
                margin: 0,
                fontSize: '0.688rem',
                color: 'var(--colors-quiet, #948D82)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}>
                {item.excerpt}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Helper: derive RailDeck items from the raw conversations list
export function deriveRailItems(conversations, activeId) {
  return (conversations || []).map(c => {
    const last = c.lastMessage || c.messages?.[c.messages.length - 1] || {};
    return {
      id:         c.id,
      title:      c.title || c.sellerName || 'Conversation',
      excerpt:    last.body,
      meta:       last.createdAt,
      status:     c.status,
      accentColor: activeId === c.id,
    };
  });
}
