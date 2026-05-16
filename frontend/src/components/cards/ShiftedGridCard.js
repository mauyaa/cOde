/**
 * ShiftedGridCard — Marketplace listing row concept.
 *
 * Layout:
 *   ┌─ [ crop tag – short ] ───────────────────────────────────────┐
 *   │                      ┌───────────┬───────────┐              │
 *   │   Crop Name          │ KES 190   │  [Active] │              │
 *   │   description text   ├───────────┴───────────┤  [Order]     │
 *   └─── · location       │ Product footer               ──]        │
 *       × qty avail      └──────────────────────────────┘           │
 *
 * Cadence left (name/body), value and status right, fulcrum in between.
 * The right column carries two items in a single landmark so price and
 * status travel as a pair — always accessible without left/right reorientation.
 */

import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import StatusChip from '../StatusChip';

const KES = new window.Intl.NumberFormat('en-KE', {
  style: 'currency', currency: 'KES', maximumFractionDigits: 0,
});

export default function ShiftedGridCard({
  name, category, description, location,
  pricePerUnit, unit, quantity, available = true,
  sellerName, sellerId, productId,
  onOrder, onContact, isOwn,
}) {
  const fmtKES = (v) => KES.format(v || 0);

  return (
    <article
      role="article"
      aria-label={name}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        columnGap: '12px 16px',
        rowGap: '2px',
        padding: '18px 0',
        borderTop: `1px solid var(--colors-horizon, #E8E4DC)`,
        fontFamily: 'var(--font-body, "Aptos", "Segoe UI Variable", system-ui, sans-serif)',
        alignItems: 'start',
        position: 'relative',
      }}
      data-testid="shifted-grid-card"
    >
      {/* Left: identity + body */}
      <div style={{ minWidth: 0 }}>
        <span
          role="doc-category"
          style={{
            display: 'block',
            color: 'var(--colors-status-info, #2A5470)',
            fontSize: '0.625rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'inherit',
            fontWeight: 500,
            marginBottom: '3px',
          }}
        >
          {category}
        </span>
        <h3
          style={{
            margin: 0,
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--colors-ink, #13110F)',
            fontFamily: 'var(--font-body, "Aptos", "Segoe UI Variable", system-ui, sans-serif)',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          {name}
        </h3>
        {description && (
          <p
            style={{
              margin: '3px 0 0',
              fontSize: '0.75rem',
              color: 'var(--colors-muted, #6B645B)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        )}
        <p
          style={{
            margin: '5px 0 0',
            fontSize: '0.688rem',
            color: 'var(--colors-ghost, #BAB3A8)',
            fontFamily: 'inherit',
          }}
        >
          {sellerName || '—'} · {location || '—'}
          {typeof quantity === 'number' && (
            <> · <strong style={{ color: 'var(--colors-muted, #6B645B)' }}>{quantity}</strong> {unit || 'units'} in stock</>
          )}
        </p>
      </div>

      {/* Middle-right: price + status stacked, right-aligned */}
      <div
        role="group"
        aria-label="Price and availability"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '6px',
          minWidth: '90px',
          paddingTop: '4px',
        }}
      >
        <span style={{ textAlign: 'right' }}>
          <span
            className="shifted-grid-price"
            style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--colors-green600, #235132)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {fmtKES(pricePerUnit || 0)}
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '0.625rem',
              color: 'var(--colors-ghost, #BAB3A8)',
              marginTop: '1px',
            }}
          >
            {unit || '/ unit'}
          </span>
        </span>
        <StatusChip status={available ? 'active' : 'pending'} />
      </div>

      {/* Far-right: action column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '6px',
          minWidth: '80px',
          alignItems: 'flex-end',
          paddingTop: '4px',
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={onOrder}
          disabled={isOwn}
          sx={{
            fontSize: '0.688rem',
            px: 1.25,
            py: 0.5,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {isOwn ? 'Your listing' : 'Order'}
        </Button>
        {!isOwn && (
          <Button
            variant="text"
            size="small"
            onClick={onContact}
            sx={{
              fontSize: '0.688rem',
              px: 1,
              color: 'var(--colors-muted, #6B645B)',
              textTransform: 'none',
            }}
          >
            Contact
          </Button>
        )}
      </div>
    </article>
  );
}
