import Chip from '@mui/material/Chip';
import { colors } from '../styles/theme';

/**
 * StatusChip — a flat, bordered status label.
 * Uses the shared colour palette only.
 * No fill. No shadow. Just a marker.
 */
const statusTone = {
  pending:      { label: 'Pending',       color: 'default',     borderColor: colors.wireframe },
  confirmed:    { label: 'Confirmed',     color: 'primary',     borderColor: colors.green[300] },
  completed:    { label: 'Completed',     color: 'primary',     borderColor: colors.green[400] },
  cancelled:    { label: 'Cancelled',     color: 'default',     borderColor: colors.horizon },
  active:       { label: 'Active',        color: 'primary',     borderColor: colors.green[200] },
  overdue:      { label: 'Overdue',       color: 'warning',     borderColor: colors.status.caution },
};

export default function StatusChip({ status = 'pending', size = 'small', sx = {} }) {
  const tone = statusTone[status] || statusTone.pending;

  return (
    <Chip
      label={tone.label}
      color={tone.color}
      variant="outlined"
      size={size}
      sx={{
        fontWeight: 500,
        fontSize: '0.625rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: 1.5,
        height: size === 'small' ? 22 : 28,
        borderRadius: '3px',
        borderColor: tone.borderColor,
        color:    tone.color === 'default' ? colors.muted : colors.green[500],
        '& .MuiChip-label': { px: 1, py: 0.3 },
        ...sx,
      }}
    />
  );
}
