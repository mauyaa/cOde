import { motion } from '../styles/theme';
import { Box, Typography } from '@mui/material';
import { colors, type } from '../styles/theme';

/**
 * StatTile — a thin KPI tile.
 * Label in quiet type, value in bold. No rings, no decoration.
 */
export default function StatTile({ label, value, hint, accent = false }) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 2,
        borderRadius: '8px',
        border: `1px solid ${colors.horizon}`,
        backgroundColor: 'transparent',
        transition: `all ${motion.fast}`,
        '&:hover': {
          backgroundColor: colors.elevated,
        },
      }}
    >
      <Typography
        variant="overline"
        sx={{
          color: colors.quiet,
          letterSpacing: '0.1em',
          fontSize: type.xs,
          display: 'block',
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontFamily: type.fontFamily.display,
          fontSize: type['3xl'],
          fontWeight: 600,
          lineHeight: 1.1,
          color: accent ? colors.green[600] : colors.ink,
          letterSpacing: type.tracking.tight,
        }}
      >
        {value}
      </Typography>
      {hint && (
        <Typography
          variant="body2"
          sx={{ mt: 0.5, fontSize: type.xs, color: colors.ghost }}
        >
          {hint}
        </Typography>
      )}
    </Box>
  );
}
