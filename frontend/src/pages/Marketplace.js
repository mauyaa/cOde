import { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, Chip, MenuItem,
  FormControl, InputLabel, Select, OutlinedInput, Tab, Tabs,
  Snackbar, Alert,
} from '@mui/material';
import EmptyState from '../components/EmptyState';
import StatusChip from '../components/StatusChip';
import { colors, type } from '../styles/theme';

const KES = new window.Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 });

/* ─── Constants ────────────────────────────────────────────────────────────── */

const CATEGORIES = ['Vegetables','Leafy Greens','Grains','Legumes','Fruits','Herbs','Other'];

const DEMO_ACCOUNTS = [
  ['Buyer',  'njeri@buyer.demo',   'Password', 'demo123'],
  ['Farmer', 'amina@mkulima.demo', 'Password', 'demo123'],
];

/* ─── Formats ──────────────────────────────────────────────────────────────── */

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtKES(v) { return KES.format(v || 0); }

/* ─── Mine-pred filter ─────────────────────────────────────────────────────── */
// Highlights seller's own listings; disables order/contact on them

function isOwnListing(product, userId) {
  return String(product.sellerId) === String(userId);
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function Marketplace({ products: storeProducts = [] }) {
  const [allProducts, setAllProducts]        = useState([]);
  const [search, setSearch]                  = useState('');
  const deferredSearch                      = useDeferredValue(search);
  const [category, setCategory]              = useState('all');
  const [location, setLocation]              = useState('');
  const [sortBy, setSortBy]                  = useState('name');

  // Auth state read for "mine" filtering (read-only, reactive)
  const [userId, setUserId]                  = useState('');
  useEffect(() => {
    const sess = JSON.parse(localStorage.getItem('agri-market-session') || 'null');
    if (sess?.user?.id) setUserId(sess.user.id);
    else if (sess?.id) setUserId(sess.id);
  }, []);

  // Load products (lazy: use storeProducts if provided)
  useEffect(() => {
    if (storeProducts?.length > 0) { setAllProducts(storeProducts); return; }
    fetch('/api/products')
      .then(r => r.json())
      .then(d => setAllProducts(d.products || d || []))
      .catch(() => {});
  }, [storeProducts]);

  // Filter + sort
  const visible = useMemo(() => {
    let list = [...allProducts];
    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      list = list.filter(p =>
        (p.name || p.title || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q)
      );
    }
    if (category !== 'all') list = list.filter(p => p.category === category);
    if (location.trim()) list = list.filter(p => (p.location || '').toLowerCase().includes(location.toLowerCase()));
    list.sort((a, b) => {
      if (sortBy === 'name')    return (a.name || a.title || '').localeCompare(b.name || b.title || '');
      if (sortBy === 'price')   return (a.pricePerUnit || a.price || 0) - (b.pricePerUnit || b.price || 0);
      if (sortBy === 'qty')     return (b.quantity || 0) - (a.quantity || 0);
      return 0;
    });
    return list;
  }, [allProducts, deferredSearch, category, location, sortBy]);

  // Unique locations (for type-ahead)
  const allLocations = useMemo(() =>
    [...new Set(allProducts.map(p => p.location).filter(Boolean))],
    [allProducts]
  );

  // Snackbar
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const setSnackMsg = (msg, severity = 'success') => setSnack({ open: true, msg, severity });

  /* ── Actions ── */

  const handlePlaceOrder = async (product, qty) => {
    try {
      const sess = JSON.parse(localStorage.getItem('agri-market-session') || 'null');
      if (!sess?.token) { setSnackMsg('Sign in to place an order.', 'error'); return; }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sess.token}` },
        body: JSON.stringify({ productId: product.id, quantity: qty, paymentMethod: 'M-Pesa', note: '' }),
      });
      if (!res.ok) throw new Error('Failed to place order');
      setSnackMsg(`Order placed for ${qty} ${product.unit || 'units'} of ${product.name || product.title}.`);
    } catch (e) { setSnackMsg(e.message, 'error'); }
  };

  const handleContactSeller = async (product, messageBody) => {
    try {
      const sess = JSON.parse(localStorage.getItem('agri-market-session') || 'null');
      if (!sess?.token) { setSnackMsg('Sign in to send a message.', 'error'); return; }
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sess.token}` },
        body: JSON.stringify({
          conversationId: `conv_${product.sellerId}_${sess.user?.id || sess.id}`,
          participants: [product.sellerId, sess.user?.id || sess.id],
          receiverId: product.sellerId,
          body:    messageBody,
        }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSnackMsg('Message sent to the seller.');
    } catch (e) { setSnackMsg(e.message, 'error'); }
  };

  // Dialogs
  const [placeDialog, setPlaceDialog]       = useState(null);  // product
  const [contactDialog, setContactDialog]   = useState(null);  // product
  const [orderQty, setOrderQty]             = useState('');
  const [msgBody, setMsgBody]               = useState('');
  const [placeLoading, setPlaceLoading]     = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const openPlaceDialog   = (p) => { setPlaceDialog(p); setOrderQty('1'); };
  const closePlaceDialog  = ()  => { setPlaceDialog(null); setOrderQty(''); };
  const openContactDialog = (p) => { setContactDialog(p); setMsgBody(''); };
  const closeContactDialog = () => { setContactDialog(null); setMsgBody(''); };

  const submitOrder = async () => {
    if (!placeDialog) return;
    const qty = parseInt(orderQty, 10);
    if (!qty    || qty <  1) { setSnackMsg('Enter a valid quantity.', 'error'); return; }
    if (qty > (placeDialog.quantity || 0)) { setSnackMsg('Not enough stock available.', 'error'); return; }
    setPlaceLoading(true);
    await handlePlaceOrder(placeDialog, qty).catch(setSnackMsg);
    setPlaceLoading(false);
    closePlaceDialog();
  };

  const submitMsg = async () => {
    if (!contactDialog) return;
    if (!msgBody.trim()) { setSnackMsg('Write a message first.', 'error'); return; }
    setContactLoading(true);
    await handleContactSeller(contactDialog, msgBody.trim()).catch(setSnackMsg);
    setContactLoading(false);
    closeContactDialog();
  };

  const mineFilter = userId ? visible.filter(p => isOwnListing(p, userId)) : null;
  const filtered   = mineFilter !== null ? mineFilter : visible;
  const filterLabel = mineFilter !== null
    ? `${mineFilter.length} of your listing${mineFilter.length !== 1 ? 's' : ''}`
    : `${visible.length} listing${visible.length !== 1 ? 's' : ''}`;

  return (
    <Box component="main"
      sx={{
        display:'flex',
        flexDirection:'column',
        px: { xs: 2.5, md: 4, lg: 6 },
        py: { xs: 0, md: 8 },
        minHeight: '100vh',
      }}
    >
      {/* ── Page intro ──────────────────────────────────────────── */}
      <Box id="marketplace-header" aria-label="Market board"
        sx={{
          maxWidth: 1200, width: '100%', mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 240px' },
          columnGap: 6,
        }}
      >
        <Box>
          <Typography variant="overline"
            sx={{ color: colors.green[500], letterSpacing: '0.12em', fontSize: type.xs, display: 'block', mb: 1.25 }}>
            Market board
          </Typography>
          <Typography variant="h2"
            sx={{
              fontFamily: type.fontFamily.display, fontSize: type['2xl'],
              fontWeight: 600, lineHeight: 1.15, color: 'text.primary', letterSpacing: type.tracking.tight,
            }}
          >
            Live produce listings
          </Typography>
          <Typography variant="body1" sx={{ mt: 1.5, fontSize: type.lg, color: colors.muted, maxWidth: 540 }}>
            Search, filter, and browse produce available right now.
            Place an order or message the seller directly.
          </Typography>
        </Box>
      </Box>

      {/* ── Filters bar ─────────────────────────────────────────── */
      }
      <Box component="nav" aria-label="Market filters"
        sx={{
          maxWidth: 1200, width: '100%', mx: 'auto',
          mt: 4, mb: 2,
          display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-end',
        }}
      >
        <TextField
          label="Search produce"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ flex: '1 1 220px', minWidth: 180, '& .MuiInputLabel-root': { fontSize: type.xs } }}
        />
        <FormControl size="small" sx={{ minWidth: 150, '& .MuiInputLabel-root': { fontSize: type.xs } }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={e => setCategory(e.target.value)} input={<OutlinedInput />}>
            <MenuItem value="all">All categories</MenuItem>
            {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          label="County"
          value={location}
          onChange={e => setLocation(e.target.value)}
          size="small"
          sx={{ minWidth: 150, '& .MuiInputLabel-root': { fontSize: type.xs } }}
        />
        <FormControl size="small" sx={{ minWidth: 150, '& .MuiInputLabel-root': { fontSize: type.xs } }}>
          <InputLabel>Sort</InputLabel>
          <Select value={sortBy} label="Sort" onChange={e => setSortBy(e.target.value)} input={<OutlinedInput />}>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="price">Price ↑</MenuItem>
            <MenuItem value="qty">Stock ↓</MenuItem>
          </Select>
        </FormControl>
        <Chip
          label={filterLabel}
          variant="outlined"
          sx={{ ml: 'auto', fontSize: type.xs, borderColor: colors.wireframe, color: colors.muted }}
        />
      </Box>

      {/* ── Ledger ─────────────────────────────────────────────────── */}
      <Box
        role="list"
        aria-label="Listings"
        sx={{
          maxWidth: 1200,
          width:    '100%',
          mx:       'auto',
          mb:       8,
          display:  'flex',
          flexDirection: 'column',
        }}
      >
        {filtered.length === 0 && (
          <EmptyState
            title="No listings match your filters"
            description="Try changing your search or filter criteria."
            actionLabel="Clear filters"
            onAction={() => { setSearch(''); setCategory('all'); setLocation(''); }}
          />
        )}

        {filtered.map((p) => {
          const owned = isOwnListing(p, userId);
          return (
            <Box
              key={p.id}
              role="listitem"
              sx={{
                display:       'flex',
                alignItems:    'center',
                gap:          2.5,
                py:            2.75,
                px:            { xs: 0, md: 0 },
                borderTop:     `1px solid ${colors.horizon}`,
                '&:first-child': { borderTop: 'none' },
              }}
            >
              {/* Marker */}
              <Box sx={{
                flexShrink: 0, display: { xs: 'none', md: 'flex' },
                flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: 100,
              }}>
                <Typography variant="overline"
                  sx={{ color: colors.quiet, fontSize: type.xs, letterSpacing: '0.1em' }}>
                  {p.category}
                </Typography>
                <Typography variant="body2" sx={{
                  fontSize: type.xs, color: colors.muted, fontWeight: 500,
                }}>
                  KES {fmtKES(p.pricePerUnit || p.price)}/{p.unit || 'unit'}
                </Typography>
              </Box>

              {/* Title + description */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', fontSize: type.body }}>
                    {p.name || p.title}
                  </Typography>
                  <Chip label={p.available !== false ? 'Active' : 'Private'} size="small" variant="outlined"
                    sx={{ fontSize: type.xs, height: 20 }}
                  />
                  {owned && <Chip label="Your listing" size="small" color="primary"
                    sx={{ fontSize: type.xs, height: 20, '& .MuiChip-label': { px: 1 } }}
                  />}
                </Box>
                {p.description && (
                  <Typography variant="body2" sx={{ mt: 0.25, fontSize: type.xs, color: colors.ghost }}>
                    {p.description}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 0.5, fontSize: type.xs, color: colors.quiet }}>
                  {p.sellerName || '—'} · {p.location || '—'} · {p.quantity || 0}
                  {p.unit || 'units'} in stock
                </Typography>
              </Box>

              {/* Price (right) */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, minWidth: 90 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: type.sm, color: colors.green[600] }}>
                  {fmtKES(p.pricePerUnit || p.price)}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.ghost, fontSize: type.xs }}>
                  {p.unit || '/ unit'}
                </Typography>
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, ml: 'auto' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openPlaceDialog(p)}
                  disabled={owned}
                  sx={{
                    fontSize: type.xs,
                    px: 1.25,
                    py: 0.65,
                  }}
                >
                  {/* placeholder action text */}
                  Order
                </Button>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => openContactDialog(p)}
                  disabled={owned}
                  sx={{ fontSize: type.xs, px: 1.25, py: 0.65 }}
                >
                  Contact
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* ── Place order dialog ────────────────────────────────────── */}
      {placeDialog && (
        <div role="dialog" aria-modal="true"
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(19,17,15,.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1300, padding: 24,
          }}
          onClick={e => { if (e.target === e.currentTarget) closePlaceDialog(); }}
        >
          <div style={{
            background: colors.surface, border: `1px solid ${colors.horizon}`,
            borderRadius: 12, padding: 28, width: '100%', maxWidth: 420,
          }}>
            <Typography
              variant="h5"
              style={{ fontFamily: 'var(--font-display, "Iowan Old Style", serif)', fontSize: '1.375rem', fontWeight: 600,
                       marginBottom: 4 }}
            >
              Place order: {placeDialog.name || placeDialog.title}
            </Typography>
            <Typography variant="body2" style={{ color: colors.muted, marginBottom: 22 }}>
              {fmtKES(placeDialog.pricePerUnit || placeDialog.price)}/{placeDialog.unit || 'unit'} · {placeDialog.quantity || 0} available
            </Typography>

            <label style={{ display: 'block', marginBottom: 6, fontSize: type.xs, color: colors.quiet }}>
              Quantity ({placeDialog.unit || 'units'})
            </label>
            <input
              type="number"
              min={1}
              max={placeDialog.quantity || 99}
              value={orderQty}
              onChange={e => setOrderQty(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', fontSize: '0.875rem',
                fontFamily: 'inherit', border: `1px solid ${colors.horizon}`,
                borderRadius: 6, outline: 'none', marginBottom: 16,
              }}
            />
{(parseInt(orderQty, 10) || 0) > 0 && (
              <p style={{
                fontSize: '0.813rem', color: colors.green[600], fontWeight: 500, marginBottom: 16,
              }}>
                Total: {fmtKES((placeDialog.pricePerUnit || placeDialog.price || 0) * parseInt(orderQty, 10))}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={closePlaceDialog}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
                         color: colors.muted, fontSize: type.sm, padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                onClick={submitOrder}
                disabled={placeLoading || !orderQty}
                style={{
                  border: 'none', cursor: placeLoading || !orderQty ? 'not-allowed' : 'pointer',
                  background: colors.green[600], color: colors.surface,
                  fontFamily: 'inherit', fontWeight: 500, fontSize: type.sm,
                  padding: '8px 22px', borderRadius: 6, opacity: placeLoading ? 0.7 : 1,
                }}
              >
                {placeLoading ? 'Processing…' : 'Confirm order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Contact seller dialog ──────────────────────────────────── */}
      {contactDialog && (
        <div role="dialog" aria-modal="true"
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(19,17,15,.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1300, padding: 24,
          }}
          onClick={e => { if (e.target === e.currentTarget) closeContactDialog(); }}
        >
          <div style={{
            background: colors.surface, border: `1px solid ${colors.horizon}`,
            borderRadius: 12, padding: 28, width: '100%', maxWidth: 480,
          }}>
            <Typography
              variant="h5"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 600,
                       marginBottom: 4 }}
            >
              Contact seller
            </Typography>
            <Typography variant="body2" style={{ color: colors.muted, marginBottom: 22 }}>
              Regarding: <strong>{contactDialog.name || contactDialog.title}</strong> — {contactDialog.sellerName || contactDialog.seller || 'seller'}
            </Typography>

            <label style={{ display: 'block', marginBottom: 6, fontSize: type.xs, color: colors.quiet }}>
              Message
            </label>
            <textarea
              value={msgBody}
              onChange={e => setMsgBody(e.target.value)}
              rows={5}
              style={{
                width: '100%', padding: '10px 14px', fontSize: '0.875rem', lineHeight: 1.625,
                fontFamily: 'inherit', border: `1px solid ${colors.horizon}`,
                borderRadius: 6, outline: 'none', resize: 'vertical', marginBottom: 16,
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={closeContactDialog}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
                         color: colors.muted, fontSize: type.sm, padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                onClick={submitMsg}
                disabled={contactLoading || !msgBody.trim()}
                style={{
                  border: 'none', cursor: contactLoading || !msgBody.trim() ? 'not-allowed' : 'pointer',
                  background: colors.green[600], color: colors.surface,
                  fontFamily: 'inherit', fontWeight: 500, fontSize: type.sm,
                  padding: '8px 22px', borderRadius: 6, opacity: contactLoading ? 0.7 : 1,
                }}
              >
                {contactLoading ? 'Sending…' : 'Send message'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Snackbar ────────────────────────────────────────────────── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: 1, fontFamily: 'inherit', fontSize: '0.813rem' }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
