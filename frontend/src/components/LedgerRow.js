import { Box, Typography, Button, IconButton } from '@mui/material';
import StatusChip from './StatusChip';
import { colors, type } from '../styles/theme';

/**
 * LedgerRow — a list item in a data table / ledger.
 * Grid is flat on mobile; four-column layout on desktop.
 * Visual hierarchy: title is large and bold; metadata is quiet.
 * Separated from the row above by a single hairline.
 */
const columnGap = { xs: 1.5, md: 3 };

export default function LedgerRow({
  marker, eyebrow, title, description, meta, aside, actions, dense,
}) {
  const m = Array.isArray(marker) ? marker : [marker || null];

  return (
    <Box
      component="section"
      aria-label={title || eyebrow}
      sx={{
        display:       'grid',
        gridTemplateColumns: { xs: '1fr', md: 'auto 1fr auto auto' },
        columnGap:     columnGap,
        py:            dense ? 1.5 : 2.25,
        px:            { xs: 0, md: 0 },
        borderTop:     `1px solid ${colors.horizon}`,
        alignItems:    'center',
        // first row strips the top border
        '&:first-of-type': { borderTop: 'none' },
        position: 'relative',
      }}
    >
      {/* Left marker (status / date badge) */}
      {m[0] && (
        <Box
          sx={{
            display: { xs: 'flex', md: 'flex' },
            alignItems: 'center',
            gap: 1.5,
            pr: { xs: 0, md: columnGap },
            minWidth: { xs: 0, md: 140 },
          }}
        >
          {m[0]}
          {m[1] && (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {m[1]}
            </Box>
          )}
        </Box>
      )}

      {/* Title + description */}
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{
              display:        'block',
              color:          colors.quiet,
              letterSpacing:  '0.1em',
              fontSize:       type.xs,
              mb:             0.25,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="body1"
          sx={{
            fontWeight:    500,
            fontSize:       type.body,
            lineHeight:    1.3,
            color:         colors.ink,
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            sx={{
              fontSize:  type.sm,
              color:     colors.muted,
              mt: 0.25,
              lineHeight: 1.5,
              display:  '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Meta column (middle-right on desktop) */}
      {meta && (
        <Box
          sx={{
            display:  { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
            minWidth: 100,
            gap: 0.5,
          }}
        >
          {meta}
        </Box>
      )}

      {/* Aside / actions (rightmost on desktop) */}
      {(aside || actions) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap:      0.75,
            flexShrink: 0,
            minWidth: 0,
          }}
        >
          {aside}
          {actions}
        </Box>
      )}
    </Box>
  );
}
