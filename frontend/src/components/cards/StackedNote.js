/**
 * StackedNote — call-to-action and feature card concept.
 *
 * Headband → body → footer band (primary CTA).
 * Two-column body: icon strip left · text right.
 * The accent horizontal rule sits between headband and body.
 * The footer CTA always runs full width.
 *
 * ┌─────────────────────────────────────────────┐
 * │  [EB]  Your listings, one click away        │ ← headband
 * ├───────────────────────────────────────────── │
 * │  [icon] Publish listing                     │ ← body line 1
 * │  · Qty + 120 units · Nyeri · Active         │  body line 2 (quiet)
 * ├───────────────────────────────────────────── │
 * │                        [+ New listing]      │ ← CTC band full-width
 * └─────────────────────────────────────────────┘
 */

import Button from '@mui/material/Button';

export default function StackedNote({
  eyebrow, title, subtitle, hint,
  icon, iconAlt,
  primaryLabel, onPrimary,
  secondaryLabel, onSecondary,
  accent = false,
}) {
  const accentColor = 'var(--colors-green600, #235132)';
  const accentBg    = 'var(--colors-green50, #EDF7F0)';
  const horizonColor = 'var(--colors-horizon, #E8E4DC)';

  return (
    <article
      role="region"
      aria-label={title}
      style={{
        fontFamily: 'inherit',
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${horizonColor}`,
        background: 'var(--colors-surface, #FFFFFF)',
        transition: 'box-shadow 120ms ease, border-color 120ms ease',
      }}
      data-testid="stacked-note-card"
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(19,17,15,.06)'; e.currentTarget.style.borderColor = 'var(--colors-wireframe, #D9D4CA)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none';  e.currentTarget.style.borderColor = horizonColor; }}
    >
      {/* Headband */}
      <div
        role="heading"
        aria-level={3}
        style={{
          padding: '14px 18px 10px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          background: accent ? accentBg : 'var(--colors-elevated, #F6F4EF)',
        }}
      >
        {icon && (
          <div
            aria-hidden
            style={{
              flexShrink: 0,
              marginTop: '2px',
              fontSize: '1.125rem',
              lineHeight: 1,
              color: accent ? accentColor : 'var(--colors-quiet, #948D82)',
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          {eyebrow && (
            <span
              role="doc-category"
              style={{
                display: 'block',
                color: accent ? accentColor : 'var(--colors-quiet, #948D82)',
                fontSize: '0.563rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 500,
                marginBottom: '3px',
              }}
            >
              {eyebrow}
            </span>
          )}
          <h4
            style={{
              margin: 0,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--colors-ink, #13110F)',
              fontFamily: 'var(--font-display, "Iowan Old Style", "Noto Serif", Georgia, serif)',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h4>
          {subtitle && (
            <p
              style={{
                margin: '3px 0 0',
                fontSize: '0.75rem',
                color: 'var(--colors-muted, #6B645B)',
                lineHeight: 1.55,
              }}
            >
              {subtitle}
            </p>
          )}
          {hint && (
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '0.625rem',
                color: 'var(--colors-ghost, #BAB3A8)',
              }}
            >
              {hint}
            </p>
          )}
        </div>
      </div>

      {/* Accent rule */}
      <div aria-hidden style={{ height: accent ? '2px' : '1px', background: accent ? accentColor : horizonColor }} />

      {/* CTA band */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '8px',
          padding: '10px 18px',
          background: 'var(--colors-surface, #FFF)',
        }}
      >
        {secondaryLabel && (
          <button
            onClick={onSecondary}
            style={{
              border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.75rem',
              color: 'var(--colors-muted, #6B645B)',
              padding: '6px 14px',
              borderRadius: '4px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--colors-elevated, #F6F4EF)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            {secondaryLabel}
          </button>
        )}
        {primaryLabel && (
          <button
            onClick={onPrimary}
            style={{
              border: 'none',
              borderRadius: '6px',
              background: accentColor,
              color: 'var(--colors-surface, #FFF)',
              cursor: 'pointer',
              padding: '7px 18px',
              fontFamily: 'inherit',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            {primaryLabel}
          </button>
        )}
      </div>
    </article>
  );
}
