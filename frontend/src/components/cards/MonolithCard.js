/**
 * Monolith — elevated minimalism card.
 *
 * Tight left image strip + large right content column.
 * Computes CTA label so the user sees the numeric commitment
 * before touching any dialog.
 *
 * ┌── ─────────────────────────────────────────────────────────── ─ ─ ┐
 * │  [108 px tall image strip — left, full-height, flat-top]        │
 * │                                                                   │
 * │  Crop Name               Liverpool, Kenya                         │
 * │  What the seller says here in a few sentences…                   │
 * │                                                                   │
 * │  KES 4 200  per bag                                                │
 * │                                                                   │
 * │        Reserve 50 bags  →  KES 210 000                            │
 * └──────────────────────────────────────────────────────────────────────┘
 */

import Button from '@mui/material/Button';

const KES = new window.Intl.NumberFormat('en-KE', {
  style: 'currency', currency: 'KES', maximumFractionDigits: 0,
});

function fmtKES(v) { return KES.format(v || 0); }

export default function Monolith({
  name, description, location, pricePerUnit, unit,
  quantity, imageUrl, imageAlt,
  onAction,
  accentLabel,
  actionLabel = 'View details',
  dense = false,
}) {
  return (
    <article
      role="article"
      aria-label={name}
      style={{
        display: 'grid',
        gridTemplateColumns: dense ? '1fr' : '108px 1fr',
        gridTemplateRows:   dense ? 'auto' : '1fr',
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid var(--colors-horizon, #E8E4DC)`,
        fontFamily: 'inherit',
        alignItems: 'stretch',
        transition: 'border-color 120ms ease',
      }}
      data-testid="monolith-card"
    >
      {/* Image strip — full height, flat top */}
      {imageUrl ? (
        <div
          role="img"
          aria-label={imageAlt || name}
          style={{
            height: dense ? '120px' : '100%',
            minHeight: dense ? '120px' : '200px',
            background: `url("${imageUrl}") center / cover no-repeat`,
            borderRadius: dense ? '8px 8px 0 0' : '6px 0 0 6px',
          }}
        />
      ) : (
        <div
          aria-hidden
          style={{
            height: dense ? '120px' : '100%',
            minHeight: dense ? '120px' : '200px',
            borderRadius: dense ? '8px 8px 0 0' : '6px 0 0 6px',
            background: 'var(--colors-elevated, #F6F4EF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '2rem', color: 'var(--colors-wireframe, #D9D4CA)' }}>🌿</span>
        </div>
      )}

      {/* Content column */}
      <div
        style={{
          padding: dense ? '18px' : '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'space-between',
        }}
      >
        {/* Top band — name + location */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '8px',
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--colors-ink, #13110F)',
            fontFamily: 'var(--font-display, "Iowan Old Style", "Noto Serif", Georgia, serif)',
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {name}
          </h3>
          {location && (
            <span style={{
              fontSize: '0.563rem',
              color: 'var(--colors-quiet, #948D82)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {location}
            </span>
          )}
        </div>

        {/* Body — description trimmed */}
        {description && (
          <p style={{
            margin: 0,
            fontSize: '0.75rem',
            color: 'var(--colors-muted, #6B645B)',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {description}
          </p>
        )}

        {/* Stock available meta */}
        <p style={{
          margin: 0,
          fontSize: '0.688rem',
          color: 'var(--colors-quiet, #948D82)',
        }}>
          {typeof quantity === 'number' && quantity > 0
            ? `${quantity} ${unit || 'units'} available`
            : 'Out of stock'
          }
        </p>

        {/* Price + CTA — pushed to base */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: 'auto',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '0.688rem',
            color: 'var(--colors-quiet, #948D82)',
          }}>
            {fmtKES(pricePerUnit || 0)}
            {unit && <span style={{ color: 'var(--colors-ghost, #BAB3A8)' }}> / {unit}</span>}
          </span>
          <button
            onClick={onAction}
            style={{
              border: 'none',
              borderRadius: '6px',
              background: 'var(--colors-green600, #235132)',
              color: 'var(--colors-surface, #FAF9F6)',
              cursor: 'pointer',
              padding: '7px 18px',
              fontFamily: 'inherit',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--colors-green700, #1A3F29)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--colors-green600, #235132)'; }}
            data-testid="monolith-cta"
          >
            {accentLabel || actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
