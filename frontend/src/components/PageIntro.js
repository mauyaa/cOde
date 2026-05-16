import { Box, Typography, Button, Box as MuiBox } from '@mui/material';
import { colors, type } from '../styles/theme';

/**
 * PageIntro — a large, typographic section header.
 * Left column: eyebrow + title + subtitle + optional CTAs.
 * Right column: aside slot (context rail, quick facts).
 * On mobile: single column, aside folds below.
 */
export default function PageIntro({
  eyebrow, title, subtitle,
  actions, aside,
  accent = false,
  dense = false,
}) {
  return (
    <Box
      component="section"
      sx={{
        display:        'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr auto', lg: '2fr 1fr' },
        columnGap:      { xs: 0, md: 8 },
        rowGap:         { xs: 4, md: 0 },
        py:             dense ? 3 : { xs: 3, md: 4 },
        px:             0,
        borderBottom:   `1px solid ${colors.horizon}`,
        marginBottom:   4,
        alignItems:     'start',
      }}
    >
      {/* Left: text */}
      <Box>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{
              display:        'block',
              color:          accent ? colors.green[500] : colors.quiet,
              letterSpacing:  '0.12em',
              fontSize:       type.xs,
              mb:             1.25,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontFamily:    type.fontFamily.display,
            fontSize:      type['2xl'],
            fontWeight:    600,
            lineHeight:    1.2,
            letterSpacing: type.tracking.tight,
            color:         'text.primary',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              mt:          2,
              fontSize:     type.body,
              lineHeight:   type.leading.regular,
              color:       colors.muted,
              maxWidth:    640,
            }}
          >
            {subtitle}
          </Typography>
        )}
        {actions && (
          <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {actions}
          </Box>
        )}
      </Box>

      {/* Right: aside */}
      {aside && (
        <Box
          role="complementary"
          sx={{
            minWidth:      { xs: 'auto', md: 240 },
            pt:            { xs: 0, md: 0.5 },
            justifySelf:   { xs: 'stretch', md: 'end' },
          }}
        >
          {aside}
        </Box>
      )}
    </Box>
  );
}
