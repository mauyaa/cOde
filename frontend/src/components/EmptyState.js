import { Box, Typography, Button } from '@mui/material';
import { colors, type } from '../styles/theme';

/**
 * EmptyState — calm placeholder when a list has no items.
 * One message, one action. Nothing decorative.
 */
export default function EmptyState({ title, description, actionLabel, actionIcon, onAction }) {
  return (
    <Box
      role="region"
      aria-label={title}
      sx={{
        textAlign: 'center',
        py: 8,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: colors.elevated,
          border: `1px solid ${colors.horizon}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
        }}
        aria-hidden="true"
      >
        <Box
          component="span"
          sx={{ fontSize: 24, lineHeight: 1, color: colors.ghost }}
        >
          {actionIcon || '∅'}
        </Box>
      </Box>
      <Typography
        variant="h4"
        sx={{
          fontSize: type.lg,
          fontWeight: 500,
          color: colors.muted,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{
            fontSize: type.sm,
            color:    colors.quiet,
            maxWidth: 360,
            lineHeight: type.leading.regular,
          }}
        >
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button
          variant="outlined"
          onClick={onAction}
          startIcon={actionIcon}
          sx={{ mt: 1 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
