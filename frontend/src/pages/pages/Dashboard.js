import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Tabs, Tab } from '@mui/material';
import StatusChip from '../components/StatusChip';
import EmptyState  from '../components/EmptyState';
import WalletFoldCard from '../components/cards/WalletFoldCard';
import { colors, type } from '../styles/theme';

const fmtKES = (v) => new window.Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(v || 0);
const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// ─── Stat tile (inline) ──────────────────────────────────────────────────────
function Stat({ label, value, hint, accent }) {
  return (
    <div style={{
      padding: '14px 16px', border: `1px solid ${colors.horizon}`, borderRadius: 8,
      backgroundColor: 'transparent',
    }}>
      <span style={{
        display: 'block', color: colors.quiet, letterSpacing: '0.1em',
        fontSize: type.xs, textTransform: 'uppercase', fontFamily: 'inherit', marginBottom: 6,
      }}>{label}</span>
      <span style={{
        display: 'block', fontFamily: 'var(--font-display)', fontSize: type['2xl'],
        fontWeight: 600, color: accent ? colors.green[600] : colors.ink,
        letterSpacing: type.tracking.tight, lineHeight: 1.1,
      }}>{value}</span>
      {hint && <span style={{ display: 'block', fontSize: type.xs, color: colors.ghost, marginTop: 3 }}>{hint}</span>}
    </div>
  );
}

// ─── Status map ───────────────────────────────────────────────────────────────
const ORDER_ACTIONS = {
  pending:  [{ label: 'Confirm', action: 'confirmed', role: 'farmer' }],
  confirmed: [{ label: 'Complete', action: 'completed', role: 'farmer' }, { label: 'Cancel', action: 'cancelled', role: 'farmer' }],
  completed: [],
  cancelled: [],
};

function relativeTime(iso) {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso).getTime();
  const m  = Math.round(ms / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser]          = useState(null);
  const [token, setToken]        = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats]        = useState(null);
  const [orders, setOrders]      = useState([]);
  const [conversations, setConversations] = useState([]);
  const [listings, setListings]  = useState([]);
  const [loading, setLoading]    = useState(true);
  const [snack, setSnack]        = useState({ open: false, msg: '', severity: 'info' });
  const [detailConv, setDetailConv] = useState(null);             // active conversation thread
  const [detailMsg,  setDetailMsg]  = useState('');
  const [sendLoading, setSendLoading] = useState(false);

  // auth bootstrap
  useEffect(() => {
    const sess = JSON.parse(localStorage.getItem('agri-market-session') || 'null');
    if (!sess?.token) { navigate('/'); return; }
    setToken(sess.token);
    setUser(sess.user);
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${sess.token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (u) { setUser(u); localStorage.setItem('agri-market-session', JSON.stringify({ ...sess, user: u })); } })
      .finally(() => setLoading(false));
  }, [navigate]);

  // parallel fetch
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const ac = new AbortController();
    fetch('/api/dashboard?includeOrders=true', { headers: { Authorization: `Bearer ${token}` }, signal: ac.signal })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setStats(d.stats || d);
          setListings(d.listings || []);
          setOrders(d.orders || d.recentOrders || []);
          setConversations(d.conversations || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [token]);

  // ── Rail sections ──────────────────────────────────────────────────────────
  const railSections = useMemo(() => {
    if (!stats) return [];
    return [
      {
        label: user?.role === 'farmer' ? 'Your catalogue' : 'Market snapshot',
        items: listings.map(p => ({
          title: p.name || p.title,
          meta: `${p.quantity || 0} ${p.unit || 'units'} · ${fmtKES(p.pricePerUnit || p.price)}/unit`,
          badge: p.available !== false ? 'active' : 'pending',
          href: '#',
        })),
      },
      {
        label: 'Workflow',
        items: [
          { title: 'Place an order', meta: 'Buyer → choose a listing, place order', tone: 'green' },
          { title: 'Mark order → confirmed', meta: 'Farmer acknowledges availability', tone: 'green' },
          { title: 'Complete or cancel', meta: 'Close the loop on both ends', tone: 'amber' },
          { title: 'Message your counterpart', meta: 'Resolve questions before delivery', tone: 'blue' },
        ],
      },
    ];
  }, [stats, listings, user]);

  // ── Order status update ─────────────────────────────────────────────────────
  const handleStatusUpdate = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Could not update status');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
      setSnack({ open: true, msg: `Order marked ${status}.`, severity: 'success' });
    } catch (e) {
      setSnack({ open: true, msg: e.message, severity: 'error' });
    }
  };

  // ── Send message ────────────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!detailMsg.trim() || !detailConv) return;
    setSendLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          conversationId: detailConv.id,
          participants:   detailConv.participants,
          receiverId:     detailConv.participants.find(id => id !== user?.id),
          body:           detailMsg.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      // re-fetch conversation
      const msgs = await (await fetch(`/api/messages/conversations/${detailConv.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })).json();
      setDetailConv({ ...detailConv, messages: msgs.messages || msgs });
      setDetailMsg('');
    } catch { setSnack({ open: true, msg: "Couldn't send message.", severity: 'error' }); }
    finally { setSendLoading(false); }
  };

  if (!user) return null;

  /* ────────────────────────────────────────────────────────────────────────── */
  /*  OVERVIEW TAB                                                              */
  /* ────────────────────────────────────────────────────────────────────────── */
  function OverviewPane() {
    const kpi = useMemo(() => {
      const committed = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const pending   = orders.filter(o => o.status === 'pending').length;
      const confirmed = orders.filter(o => o.status === 'confirmed').length;
      const activeConvs = conversations.length;
      return { committed, pending, confirmed, activeConvs };
    }, [orders, conversations]);

    return (
      <Box>
        {/* KPI row */}
        <Box sx={{
          display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2, mb: 5,
        }}>
          <Stat label="Live listings" value={listings.length} accent />
          <Stat label="Pending orders" value={kpi.pending} hint="Requires action" accent={kpi.pending > 0} />
          <Stat label="Confirmed orders" value={kpi.confirmed} />
          <Stat label="Active conversations" value={kpi.activeConvs} />
        </Box>

        {/* Recent orders ledger */}
        <Typography variant="overline"
          sx={{ color: colors.quiet, letterSpacing: '0.1em', fontSize: type.xs, display: 'block', mb: 2 }}>
          Recent orders
        </Typography>
        <Box role="list" aria-label="Recent orders" sx={{ display: 'flex', flexDirection: 'column' }}>
          {orders.length === 0 && (
            <EmptyState title="No orders yet"
              description="Orders will appear here once buyers start buying your listings or you place orders."
            />
          )}
          {orders.map((o) => {
            return (
              <WalletFoldCard
                key={o.id}
                id={o.id}
                productName={o.productName || '—'}
                buyerName={o.buyerName}
                sellerName={o.sellerName}
                quantity={o.quantity}
                productUnit={o.productUnit}
                totalAmount={o.totalAmount}
                paymentMethod={o.paymentMethod}
                status={o.status}
                createdAt={o.createdAt}
                updatedAt={o.updatedAt}
                isFarmer={user?.role === 'farmer'}
                onStatusChange={handleStatusUpdate}
              />
            );
          })}
        </Box>
      </Box>
    );
  }

  /* ────────────────────────────────────────────────────────────────────────── */
  /*  ORDERS TAB                                                                 */
  /* ────────────────────────────────────────────────────────────────────────── */
  function OrdersPane() {
    const statusCounts = useMemo(() => {
      const c = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
      orders.forEach(o => { c[o.status] = (c[o.status] || 0) + 1; });
      return c;
    }, [orders]);

    return (
      <Box>
        {/* status distribution compact */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 5 }}>
          {Object.entries(statusCounts).map(([s, n]) => (
            <div key={s}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: type.sm, color: colors.muted }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', display: 'inline-block',
                backgroundColor: s === 'completed' ? colors.green[400] : s === 'cancelled' ? colors.ghost : s === 'confirmed' ? colors.green[500] : colors.horizon,
              }} />
              <span style={{ textTransform: 'capitalize' }}>{s}</span>
              <span style={{ color: colors.quiet, fontFamily: type.fontFamily.mono, fontSize: type.xs }}>{n}</span>
            </div>
          ))}
        </Box>

        {/* full order ledger */}
        <Box role="list" aria-label="All orders" sx={{ display: 'flex', flexDirection: 'column' }}>
          {orders.length === 0 ? (
            <EmptyState title="No orders" description="Orders show up here once buyers start shopping." />
          ) : (
            orders.map((o) => {
              const showConfirm = user?.role === 'farmer' && o.status === 'pending';
              const showComplete = user?.role === 'farmer' && o.status === 'confirmed';
              const showCancel = user?.role === 'farmer' && (o.status === 'pending' || o.status === 'confirmed');
              return (
                <Box key={o.id} role="listitem"
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'auto 1fr auto auto auto auto' },
                    columnGap: 3, py: 2.25,
                    borderTop: `1px solid ${colors.horizon}`,
                    alignItems: 'center',
                    '&:first-child': { borderTop: 'none' },
                  }}
                >
                  <Box sx={{ minWidth: 130 }}>
                    <Typography variant="body2" sx={{ color: colors.quiet, fontSize: type.xs, fontFamily: type.fontFamily.mono }}>
                      {fmtDate(o.createdAt)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', fontSize: type.body }}>
                      {o.productName || 'Unknown product'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: type.xs, color: colors.ghost }}>
                      {o.buyerName || o.sellerName || '—'} · {o.quantity || 0}{o.productUnit || ' units'}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: type.sm }}>{fmtKES(o.totalAmount)}</Typography>
                    <Typography variant="caption" sx={{ color: colors.ghost, fontSize: type.xs }}>{o.paymentMethod || '—'}</Typography>
                  </Box>
                  <Box sx={{ minWidth: 100 }}>
                    <StatusChip status={o.status} />
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: type.xs, color: colors.ghost, textAlign: 'right' }}>
                    {relativeTime(o.updatedAt)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    {showConfirm && (
                      <button onClick={() => handleStatusUpdate(o.id, 'confirmed')}
                        style={{ border: `1px solid ${colors.green[300]}`, borderRadius: 4, background: 'none', color: colors.green[600],
                                 cursor: 'pointer', padding: '4px 10px', fontFamily: 'inherit', fontSize: type.xs, fontWeight: 500 }}>
                        Confirm
                      </button>
                    )}
                    {showComplete && (
                      <button onClick={() => handleStatusUpdate(o.id, 'completed')}
                        style={{ border: 'none', borderRadius: 4, background: colors.green[500], color: colors.surface,
                                 cursor: 'pointer', padding: '5px 12px', fontFamily: 'inherit', fontSize: type.xs, fontWeight: 500 }}>
                        Complete
                      </button>
                    )}
                    {showCancel && (
                      <button onClick={() => handleStatusUpdate(o.id, 'cancelled')}
                        style={{ border: `1px solid ${colors.wireframe}`, borderRadius: 4, background: 'transparent', color: colors.muted,
                                 cursor: 'pointer', padding: '4px 10px', fontFamily: 'inherit', fontSize: type.xs }}>
                        Cancel
                      </button>
                    )}
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    );
  }

  /* ────────────────────────────────────────────────────────────────────────── */
  /*  MESSAGES TAB                                                              */
  /* ────────────────────────────────────────────────────────────────────────── */
  function MessagesPane() {
    const msgsEndRef = useRef(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      if (!detailConv || !token) return;
      fetch(`/api/messages/conversations/${detailConv.id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setMessages(d.messages || d || []))
        .catch(() => {});
    }, [detailConv, token]);

    useEffect(() => {
      msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [detailConv, messages]);

    return (
      <Box sx={{ display: 'flex', height: 500, gap: 3 }}>
        {/* Conversation list */}
        <RailDeck
          items={deriveRailItems(conversations ?? [], detailConv?.id)}
          activeId={detailConv?.id}
          onSelect={(item) => { setDetailConv(conversations?.find(c => c.id === item.id) || null); setMessages([]); }}
          emptyLabel="No conversations"
          emptyHint="Messages from buyers and sellers will appear here."
        />

        {/* Message thread */}
        {detailConv ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${colors.horizon}`, flexShrink: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, fontSize: type.sm }}>{detailConv.title || 'Conversation'}</Typography>
            </Box>
            <Box role="list" aria-label="Message thread"
              sx={{
                flex: 1, overflowY: 'auto', py: 3, px: 2,
                display: 'flex', flexDirection: 'column', gap: 1.25,
              }}
            >
              {messages.map((m, i) => {
                const mine = String(m.senderId || m.sender) === String(user?.id);
                return (
                  <Box key={m.id || i} role="listitem"
                    sx={{
                      alignSelf: mine ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                    }}
                  >
                    <div style={{
                      padding: '9px 14px', borderRadius: 12,
                      background: mine ? colors.green[500] : colors.elevated,
                      color: mine ? colors.surface : 'text.primary',
                      borderBottomRightRadius: mine ? 3 : 12,
                      borderBottomLeftRadius:  mine ? 12 : 3,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}>
                      <span style={{
                        fontSize: type.sm, lineHeight: type.leading.regular, fontFamily: 'inherit',
                      }}>{m.body}</span>
                    </div>
                    <Typography variant="caption" sx={{
                      display: 'block', mt: 0.5,
                      fontSize: type.xs, color: colors.ghost,
                      textAlign: mine ? 'right' : 'left',
                    }}>
                      {fmtDate(m.createdAt)}
                    </Typography>
                  </Box>
                );
              })}
              <div ref={msgsEndRef} />
            </Box>
            <Box
              component="form"
              onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
              sx={{
                display: 'flex', gap: 1.5, p: 2,
                borderTop: `1px solid ${colors.horizon}`, flexShrink: 0,
              }}
            >
              <input
                type="text"
                value={detailMsg}
                onChange={e => setDetailMsg(e.target.value)}
                placeholder="Write a reply…"
                aria-label="Write a message"
                style={{
                  flex: 1, fontFamily: 'inherit', fontSize: type.sm,
                  padding: '10px 14px',
                  border: `1px solid ${colors.horizon}`, borderRadius: 7,
                  outline: 'none', background: 'transparent', color: 'inherit',
                }}
              />
              <button type="submit" disabled={sendLoading || !detailMsg.trim()}
                style={{
                  border: 'none', borderRadius: 7,
                  background: sendLoading || !detailMsg.trim() ? colors.horizon : colors.green[600],
                  color: sendLoading || !detailMsg.trim() ? colors.ghost : colors.surface,
                  cursor: sendLoading || !detailMsg.trim() ? 'not-allowed' : 'pointer',
                  padding: '8px 18px', fontFamily: 'inherit', fontWeight: 500, fontSize: type.sm,
                }}
              >
                {sendLoading ? '…' : 'Send'}
              </button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.quiet }}>
            <Typography variant="body2">Select a conversation</Typography>
          </Box>
        )}
      </Box>
    );
  }

  /* ────────────────────────────────────────────────────────────────────────── */
  /*  LISTINGS TAB  (farmer only)                                               */
  /* ────────────────────────────────────────────────────────────────────────── */
  function ListingsPane() {
    if (user?.role !== 'farmer') {
      return (
        <EmptyState
          title="Farmer workspace"
          description="Switch to a farmer account to manage listings here. Buyers have access to the Market board and their own orders."
        />
      );
    }
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{
            fontFamily: type.fontFamily.display, fontSize: type.xl, fontWeight: 600, color: 'text.primary',
          }}>
            Your listings ({listings.length})
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => alert('Listing creation form — scaffold for full implementation')}
          >
            + New listing
          </Button>
        </Box>
        <Box role="list" aria-label="Your listings" sx={{ display: 'flex', flexDirection: 'column' }}>
          {listings.length === 0 ? (
            <EmptyState
              title="No listings yet"
              description="Create your first produce listing to start receiving orders."
              actionLabel="Create listing"
              onAction={() => alert('Listing creation form — scaffold')}
            />
          ) : (
            listings.map((p) => (
              <Box key={p.id} role="listitem"
                sx={{
                  display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto auto' },
                  columnGap: 3, py: 2.5, borderTop: `1px solid ${colors.horizon}`, alignItems: 'center',
                  '&:first-child': { borderTop: 'none' },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', fontSize: type.body }}>
                      {p.name || p.title}
                    </Typography>
                    <Chip label={p.available !== false ? 'Active' : 'Draft'} size="small" variant="outlined" sx={{ fontSize: type.xs, height: 20 }} />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.25, fontSize: type.xs, color: colors.ghost }}>
                    {p.description || ''}
                    <span style={{ opacity: 0.6 }}> · {p.quantity || 0} {p.unit || 'units'} · {fmtKES(p.pricePerUnit || p.price)}/{p.unit || 'unit'}</span>
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: type.xs, color: colors.muted, textAlign: 'right' }}>
                  {p.location || '—'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                  <button style={{
                    border: `1px solid ${colors.wireframe}`, borderRadius: 4, background: 'transparent',
                    color: colors.muted, cursor: 'pointer', padding: '4px 12px',
                    fontFamily: 'inherit', fontSize: type.xs,
                  }}>
                    Edit
                  </button>
                  <button style={{
                    border: `1px solid ${colors.status.dangerLight || '#fef2f4'}`, borderRadius: 4, background: 'transparent',
                    color: colors.status.danger, cursor: 'pointer', padding: '4px 12px',
                    fontFamily: 'inherit', fontSize: type.xs,
                  }}>
                    Remove
                  </button>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    );
  }

  // tabs
  const tabs = user?.role === 'farmer'
    ? ['Overview', 'Orders', 'Messages', 'Listings']
    : ['Overview', 'Orders', 'Messages'];

  const tabPanels = [<OverviewPane />, <OrdersPane />, <MessagesPane />, <ListingsPane />];

  return (
    <Box component="main" sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      minHeight: '100vh',
      pt: { xs: 0, md: 0 },
    }}>
      <Box sx={{
        flex: 1, px: { xs: 2.5, md: 4, lg: 6 },
        py: { xs: 3, md: 6 }, maxWidth: 1200, mx: { xs: 'auto', md: 0 }, width: '100%',
        '& .MuiTabs-root': { minHeight: 44, borderBottom: `1px solid ${colors.horizon}` },
      }}>
        {/* Page header */}
        <Box id="dashboard-page" aria-label="Dashboard"
          sx={{
            display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
            columnGap: 6, alignItems: 'flex-end',
            mb: 5, pb: 4, borderBottom: `1px solid ${colors.horizon}`,
          }}
        >
          <Box>
            <Typography variant="overline" sx={{
              color: colors.green[500], letterSpacing: '0.12em', fontSize: type.xs, display: 'block', mb: 1.25,
            }}>
              Workspace — {user?.role === 'farmer' ? 'Farmer' : 'Buyer'}
            </Typography>
            <Typography variant="h1" sx={{
              fontFamily:    type.fontFamily.display, fontSize: type['3xl'],
              fontWeight:    600, lineHeight: 1.15, color: 'text.primary',
              letterSpacing: type.tracking.tight,
            }}>
              {user?.fullName || 'Workspace'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, fontSize: type.body, color: colors.muted, maxWidth: 500 }}>
              {user?.bio || 'Your field ledger for agricultural trade.'}
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
          sx={{ '& .MuiTab-root': { fontSize: type.sm, textTransform: 'none' } }}
        >
          {tabs.map((t) => <Tab key={t} label={t} />)}
        </Tabs>

        {/* Tab panel */}
        <Box role="tabpanel" aria-label={tabs[activeTab]} sx={{ pt: 4 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <Typography variant="body2" sx={{ color: colors.quiet }}>Loading workspace…</Typography>
            </div>
          ) : (
            tabPanels[activeTab]
          )}
        </Box>

        <Snackbar open={snack.open} autoHideDuration={5000}
          onClose={() => setSnack({ ...snack, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity}
            variant="filled" sx={{ borderRadius: 1, fontFamily: 'inherit', fontSize: '0.813rem' }}>
            {snack.msg}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
