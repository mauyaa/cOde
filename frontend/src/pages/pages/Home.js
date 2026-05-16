import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, Stack,
} from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';

const cards = [
  { eyebrow: 'Fresh produce', title: 'Tomatoes',      subtitle: 'KSh 95 / kg · 120 kg left · Nyeri', category: 'Vegetables', location: 'Nyeri', seller: 'Amina Wanjiku',  id: 'product_tomatoes_01' },
  { eyebrow: 'Fresh produce', title: 'Sukuma Wiki',   subtitle: 'KSh 35 / bunch · 80 left · Nyeri', category: 'Leafy Greens', location: 'Nyeri',  seller: 'Amina Wanjiku',  id: 'product_kales_01' },
  { eyebrow: 'Bulk grains',   title: 'Dry Maize',    subtitle: 'KSh 4 200 / bag · 300 left · Eldoret', category: 'Grains',  location: 'Eldoret', seller: 'Kiptoo Cheruiyot', id: 'product_maize_01' },
  { eyebrow: 'Legumes',       title: 'Rosecoco Beans', subtitle: 'KSh 180 / kg · 90 left · Eldoret', category: 'Legumes',  location: 'Eldoret', seller: 'Kiptoo Cheruiyot', id: 'product_beans_01' },
];

export default function Home({ products = [] }) {
  const navigate = useNavigate();
  const liveProducts = useMemo(() => products.length > 0 ? products : cards, [products]);
  const stats = useMemo(() => {
    const categories = new Set(liveProducts.map(p => p.category));
    const locations  = new Set(liveProducts.map(p => p.location));
    const listings   = liveProducts.length;
    const inStock    = liveProducts.filter(p => p.quantity > 0).length;
    return { listings, categories: categories.size, locations: locations.size, inStock };
  }, [liveProducts]);

  // placeholder live from blank state styling
  const hasData = stats.listings > 0;

  return (
    <Box sx={{ px: { xs: 2.5, md: 4, lg: 6 }, py: { xs: 5, md: 8 }, maxWidth: 1200, mx: 'auto' }}>
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <Box
        sx={{
          display:        'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          columnGap:      8,
          alignItems:     'flex-end',
          mb: 8,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: colors.green[500],
              letterSpacing: '0.12em',
              fontSize: type.xs,
              display: 'block',
              mb: 1.25,
            }}
          >
            Soko Shambani
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontFamily:    type.fontFamily.display,
              fontSize:      type['3xl'],
              fontWeight:    600,
              lineHeight:    1.15,
              letterSpacing: type.tracking.tight,
              color:         'text.primary',
              maxWidth:      540,
            }}
          >
            Where farmers sell directly to buyers.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt:          2.5,
              fontSize:    type.lg,
              lineHeight:  type.leading.regular,
              color:       colors.muted,
              maxWidth:    480,
            }}
          >
            A shared workspace for agricultural trade — listings, orders, and
            conversations, all in one place.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/marketplace')}
              sx={{ px: 3.5, py: 1.5 }}
            >
              Browse market board
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ px: 3.5, py: 1.5 }}
            >
              Open workspace →
            </Button>
          </Stack>
        </Box>

        {/* Right: stat tiles as a mini wall */}
        <Box
          sx={{
            display:       { xs: 'grid', md: 'flex' },
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: undefined },
            flexDirection: { xs: undefined, md: 'column' },
            gap:           2,
            justifySelf:   { md: 'end' },
          }}
        >
          <StatTile label="Listings now" value={stats.inStock} hint={`of ${stats.listings} visible`} accent />
          <StatTile label="Produce categories" value={stats.categories} />
          <StatTile label="Counties active"  value={stats.locations} />
        </Box>
      </Box>

      {/* ─── Live board preview ─────────────────────────────── */}
      {hasData && (
        <Box component="section" sx={{ mt: 8, mb: 0 }}>
          <PageIntro
            eyebrow="Live market"
            title="Now on the board"
            subtitle="Four listings from the seed data, live from the store."
            actions={
              <Button onClick={() => navigate('/marketplace')} endIcon={<ArrowForward />}>
                See full board
              </Button>
            }
          />

          <Box
            component="ul"
            aria-label="Live market listings"
            sx={{
              display:  'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              columnGap: 4,
              rowGap:    1,
              mb:        8,
            }}
          >
            {liveProducts.map((p, i) => (
              <Box
                key={p.id || i}
                component="li"
                sx={{
                  display:        'grid',
                  gridTemplateColumns: { xs: 'auto 1fr', md: 'auto 1fr auto auto' },
                  columnGap:      3,
                  py:             2.75,
                  borderTop:      `1px solid ${colors.horizon}`,
                  alignItems:     'center',
                  '&:first-child': { borderTop: 'none' },
                  '&:hover a': {
                    color: colors.green[600],
                  },
                }}
              >
                <Box component="span" sx={{
                  position: 'relative',
                  top:     '2px',
                  fontSize: 18,
                  color:   colors.green[400],
                  lineHeight: 1,
                  letterSpacing: -1,
                  fontFamily: 'monospace',
                }}>
                  #{String(i + 1).padStart(2, '0')}
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{
                      fontWeight: 500,
                      fontSize: type.body,
                      color: 'text.primary',
                    }}>
                      {p.title || p.name}
                    </Typography>
                    <Chip label={p.category} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" sx={{
                    mt: 0.25,
                    fontSize: type.xs,
                    color: colors.quiet,
                  }}>
                    {p.location} · {p.seller}
                    {typeof p.quantity === 'number' && ` · ${p.quantity} ${p.unit || 'units'} available`}
                  </Typography>
                </Box>
                <Box sx={{
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  fontSize: type.sm,
                  fontWeight: 500,
                  color: colors.green[600],
                  minWidth: 80,
                }}>
                  KEs {parseInt(p.pricePerUnit || p.price || 0).toLocaleString('en-KE')}
                  {p.unit && <Typography variant="caption" sx={{ color: colors.ghost }}>/{p.unit}</Typography>}
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <StatusChip
                    status={p.available !== false ? 'active' : 'pending'}
                    sx={{ fontSize: type.xs }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ─── What this screen exists for ───────────────────── */}
      <Box
        component="section"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          columnGap: 4,
          rowGap:    3,
          py:        8,
          borderTop: `1px solid ${colors.horizon}`,
        }}
        >
        {[
          {
          eyebrow: 'For farmers',
          title:   'Publish listings. Track orders. Keep everything in one place.',
          detail:  'Create a listing once and have it visible on the public market board. Confirm, complete, or cancel orders — and message buyers directly.',
        },
        {
          eyebrow: 'For buyers',
          title:   'Browse the market. Place orders. Contact sellers instantly.',
          detail:  'Filter by produce type and county, place an order in seconds. Message farmers for price, availability, or delivery.',
        },
        {
          eyebrow: 'Role-based access',
          title:   'Right tools for the right role.',
          detail:  'Farmers manage their catalogue. Buyers browse and order. Each workspace shows only what matters to that role.',
        },
        ].map((item, i) => (
          <Box key={i}>
            <Typography variant="overline" sx={{
              color: colors.green[500],
              letterSpacing: '0.12em',
              fontSize: type.xs,
              display: 'block',
              mb: 1.25,
            }}>
              {item.eyebrow}
            </Typography>
            <Typography variant="h6" sx={{
              fontFamily: type.fontFamily.display,
              fontSize: type.lg,
              fontWeight: 600,
              lineHeight: 1.3,
              color: 'text.primary',
              mb: 1,
            }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{
              fontSize: type.sm,
              lineHeight: type.leading.regular,
              color: colors.muted,
            }}>
              {item.detail}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
