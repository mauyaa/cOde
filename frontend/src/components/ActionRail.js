import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import StatusChip from './StatusChip';
import { motion, colors, type } from '../styles/theme';

export default function ActionRail({ sections = [], footer }) {
  return (
    <Box
      component="aside"
      aria-label="Context rail"
      sx={{
        display: { xs: 'none', md: 'block' },
        minWidth: 240,
        maxWidth: 280,
        position: 'sticky',
        top: 104,
        alignSelf: 'flex-start',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sections.map((section, i) => (
          <Box key={i}>
            <Typography
              variant="overline"
              sx={{
                color: colors.quiet,
                letterSpacing: '0.1em',
                fontSize: type.xs,
                display: 'block',
                mb: 1.5,
              }}
            >
              {section.label}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {section.items.map((item, j) => (
                <Box
                  key={j}
                  component={item.href ? RouterLink : 'div'}
                  to={item.href}
                  underline="none"
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    p: 1.25,
                    m: '-1.25',
                    borderRadius: 1,
                    cursor: item.href ? 'pointer' : 'default',
                    color: 'text.primary',
                    textDecoration: 'none',
                    transition: `background-color ${motion.fast}`,
                    '&:hover': item.href ? { backgroundColor: colors.elevated } : {},
                  }}
                >
                  {item.icon && (
                    <Box
                      component="span"
                      aria-hidden
                      sx={{
                        flexShrink: 0,
                        fontSize: 18,
                        lineHeight: 1,
                        mt: '2px',
                        color: item.tone === 'green' ? colors.green[500]
                          : item.tone === 'amber' ? colors.status.caution
                          : item.tone === 'red'   ? colors.status.danger
                          : item.tone === 'blue'  ? colors.status.info
                          : colors.ghost,
                      }}
                    >
                      {item.icon}
                    </Box>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {item.title && (
                      <Typography variant="body2" sx={{
                        fontWeight: 500,
                        fontSize: type.sm,
                        lineHeight: 1.4,
                        color: 'text.primary',
                      }}>
                        {item.title}
                      </Typography>
                    )}
                    {item.meta && (
                      <Typography variant="body2" sx={{
                        fontSize: type.xs,
                        color: colors.quiet,
                        mt: 0.25,
                        lineHeight: 1.4,
                      }}>
                        {item.meta}
                      </Typography>
                    )}
                    {item.badge && <StatusChip status={item.badge} size="small" />}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
        {footer && (
          <Box sx={{ borderTop: `1px solid ${colors.horizon}`, pt: 2, mt: 1 }}>
            {footer}
          </Box>
        )}
      </Box>
    </Box>
  );
}
