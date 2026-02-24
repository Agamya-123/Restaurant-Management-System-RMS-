// Core Enums
import { TableStatus } from './src/core/domain/enums/TableStatus.js';
import { OrderStatus } from './src/core/domain/enums/OrderStatus.js';
import { UserRole } from './src/core/domain/enums/UserRole.js';

// Presentation UI
import { 
    renderDashboard, 
    renderTables, 
    renderMenu, 
    renderReservations,
    renderKitchen,
    renderCheckout,
    renderLogin,
    renderBillingHistory,
    renderStaff,
    renderAnalytics
} from './src/presentation/ui/Views.js';

const API_BASE = 'http://localhost:3000/api/v1';

// Global State
const appState = {
    currentUser: null, // role: ADMIN | WAITER | CHEF
    tables: [],
    menu: [],
    reservations: [],
    orders: [],
    revenue: 0,
    users: [],
    currentView: 'dashboard',
    context: {
        tableId: null,
        activeOrder: null,
        selectedPaymentMethod: null
    },
    refresh: async () => {
        try {
            const res = await fetch(`${API_BASE}/state`);
            const data = await res.json();
            appState.tables = data.tables;
            appState.reservations = data.reservations;
            appState.orders = data.orders;
            appState.revenue = data.revenue;
            appState.menu = data.menu;
            appState.users = data.users || [];
            
            if (appState.context.tableId) {
                appState.context.activeOrder = appState.orders.find(o => o.tableId === appState.context.tableId && o.status !== 'PAID');
            }
        } catch (e) {
            console.error('API Sync Error:', e);
        }
    }
};

const viewContainer = document.getElementById('view-container');
const viewTitle = document.getElementById('current-view-title');
const navItems = document.querySelectorAll('.nav-item');
const sidebar = document.querySelector('.sidebar');

// ── Live Auto-Refresh Engine ────────────────────────────────────────────────
const LIVE_VIEWS = ['dashboard', 'kitchen', 'tables'];
const LIVE_REFRESH_MS = 20_000; // 20 seconds
let _liveTimer = null;

/** Lightweight snapshot — only fields that should trigger a re-render */
const _snapshot = () => JSON.stringify({
    orders: appState.orders.map(o => ({ id: o.id, s: o.status, n: o.orderItems?.length })),
    tables: appState.tables.map(t => ({ id: t.id, s: t.status }))
});

/** Inject / update a pulsing live badge into the topbar title area */
const _updateLiveBadge = (changed = false) => {
    let badge = document.getElementById('live-refresh-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.id = 'live-refresh-badge';
        badge.style.cssText = `
            display:inline-flex; align-items:center; gap:5px;
            margin-left:12px; padding:3px 9px; border-radius:999px;
            font-size:0.6rem; font-weight:800; letter-spacing:0.08em;
            text-transform:uppercase; vertical-align:middle;
            transition: background 0.4s, color 0.4s;
        `;
        viewTitle.parentElement?.appendChild(badge);
    }
    if (changed) {
        badge.style.background = 'rgba(245,158,11,0.15)';
        badge.style.color = '#f59e0b';
        badge.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:#f59e0b;display:inline-block;"></span> Updated`;
        setTimeout(() => _updateLiveBadge(false), 3000);
    } else {
        badge.style.background = 'rgba(16,185,129,0.12)';
        badge.style.color = '#10b981';
        badge.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block;animation:livePulse 1.5s infinite;"></span> Live`;
    }
};

const stopLiveRefresh = () => {
    if (_liveTimer) { clearInterval(_liveTimer); _liveTimer = null; }
    if (window._kdsTickTimer) { clearInterval(window._kdsTickTimer); window._kdsTickTimer = null; }
    document.getElementById('live-refresh-badge')?.remove();
};

const startLiveRefresh = (view) => {
    stopLiveRefresh(); // clear any existing
    if (!LIVE_VIEWS.includes(view)) return;
    _updateLiveBadge(false);

    _liveTimer = setInterval(async () => {
        // Safety: stop if user navigated away
        if (appState.currentView !== view) { stopLiveRefresh(); return; }

        const before = _snapshot();
        await appState.refresh();
        const after = _snapshot();

        if (before !== after) {
            // State changed — silently re-render
            let html = '';
            switch (view) {
                case 'dashboard': html = renderDashboard(appState); break;
                case 'kitchen':   html = renderKitchen(appState);   break;
                case 'tables':    html = renderTables(appState);    break;
            }
            viewContainer.innerHTML = html;
            attachAllListeners(view, {});
            _updateLiveBadge(true); // flash amber to signal update
        }
        // if nothing changed, badge stays green — no re-render needed
    }, LIVE_REFRESH_MS);
};

// Inject pulse keyframe once
if (!document.getElementById('live-pulse-style')) {
    const s = document.createElement('style');
    s.id = 'live-pulse-style';
    s.textContent = `@keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`;
    document.head.appendChild(s);
}

const notify = (msg, type = 'success') => {
    const el = document.createElement('div');
    el.className = 'fade-in';
    el.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        padding: 1.2rem 2.2rem; border-radius: 12px; font-weight: 700;
        background: ${type === 'success' ? 'var(--primary-color)' : 'var(--accent-red)'};
        color: white; box-shadow: 0 15px 35px rgba(0,0,0,0.4); 
        border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);
    `;
    el.textContent = msg;
    document.body.appendChild(el);
    // Duration scales with message length: min 2.5s, max 5s
    const duration = Math.min(5000, Math.max(2500, msg.length * 80));
    setTimeout(() => { el.style.transition = 'opacity 0.4s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 400); }, duration);
};

const updateSidebarVisibility = () => {
    const role = appState.currentUser?.role;
    navItems.forEach(item => {
        const view = item.getAttribute('data-view');
        
        // Default hidden
        item.style.display = 'none';

        if (role === UserRole.ADMIN) {
            item.style.display = 'flex'; // Admin sees everything
        } else if (role === UserRole.WAITER) {
            if (['dashboard', 'tables', 'kitchen'].includes(view)) {
                item.style.display = 'flex';
            }
        } else if (role === UserRole.CHEF) {
            if (['dashboard', 'kitchen', 'menu'].includes(view)) {
                item.style.display = 'flex';
            }
        }
        
        // Final override: Staff + Analytics only for Admin
        if ((view === 'staff' || view === 'analytics') && role !== UserRole.ADMIN) {
            item.style.display = 'none';
        }

        // Role-specific label overrides (applied AFTER visibility)
        const spanEl = item.querySelector('span:last-child');
        if (spanEl) {
            // Reset to original first
            const originalLabel = item.getAttribute('data-label') || spanEl.textContent;
            if (!item.hasAttribute('data-label')) item.setAttribute('data-label', spanEl.textContent);
            spanEl.textContent = originalLabel;
            // Then apply overrides
            if (view === 'kitchen' && role === UserRole.WAITER) spanEl.textContent = 'Pickup';
            if (view === 'dashboard' && role === UserRole.CHEF) spanEl.textContent = 'Station';
        }

    }); // end navItems.forEach

    // Logout button always visible if logged in
    document.getElementById('logout-btn')?.style.setProperty('display', appState.currentUser ? 'flex' : 'none');
};

// Populate user avatar + role in top-bar
const updateTopBarUser = () => {
    const user = appState.currentUser;
    if (!user) return;
    const avatar = document.getElementById('user-avatar');
    const roleLabel = document.getElementById('user-role-label');
    if (avatar) avatar.textContent = user.username.substring(0, 2).toUpperCase();
    if (roleLabel) roleLabel.textContent = user.role;
};

const navigateTo = async (view, params = {}) => {
    stopLiveRefresh(); // always clear previous poll before navigating
    if (!appState.currentUser) {
        viewContainer.innerHTML = renderLogin();
        sidebar.style.display = 'none';
        attachAllListeners('login');
        return;
    }

    sidebar.style.display = 'flex';
    updateSidebarVisibility();
    updateTopBarUser();
    await appState.refresh();
    appState.currentView = view;
    
    navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === view);
    });

    const titleMap = {
        'dashboard': 'Dashboard',
        'tables': 'Table Management',
        'menu': 'Service Menu',
        'reservations': 'Hostess Desk',
        'kitchen': 'Command Center',
        'checkout': 'Settlement',
        'billing': 'Billing Audit',
        'staff': 'Staff Management',
        'analytics': 'Intelligence Hub'
    };

    viewTitle.textContent = titleMap[view] || view.toUpperCase();

    let html = '';
    switch(view) {
        case 'dashboard': html = renderDashboard(appState); break;
        case 'tables': html = renderTables(appState); break;
        case 'menu': html = renderMenu(appState, appState.context.tableId); break;
        case 'reservations': html = renderReservations(appState); break;
        case 'kitchen': html = renderKitchen(appState); break;
        case 'staff': html = renderStaff(appState); break;
        case 'analytics': html = renderAnalytics(appState); break;
        case 'checkout': html = renderCheckout(appState, params.orderId); break;
        case 'billing': {
            const resp = await fetch(`${API_BASE}/bills`);
            const bills = await resp.json();
            html = renderBillingHistory(bills);
            break;
        }
    }

    viewContainer.innerHTML = html;
    attachAllListeners(view, params);
    startLiveRefresh(view); // start polling for live views
};
window.navigateTo = navigateTo;

const attachAllListeners = (view, params) => {
    
    if (view === 'login') {
        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                appState.currentUser = await res.json();
                notify(`Welcome back, ${appState.currentUser.username}!`);
                navigateTo('dashboard');
            } else {
                notify("Login Failed. Check credentials.", "error");
            }
        });
        return;
    }

    // Dashboard: Waiter Checkout Trigger + Admin Billing History
    if (view === 'dashboard') {
        document.querySelectorAll('.trigger-checkout').forEach(btn => {
            btn.addEventListener('click', () => {
                navigateTo('checkout', { orderId: btn.getAttribute('data-id') });
            });
        });

        // Waiter: Add extra items to an existing active order
        document.querySelectorAll('.trigger-add-items').forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.getAttribute('data-id');
                const tableId = btn.getAttribute('data-table');
                const order = appState.orders.find(o => o.id === orderId);
                if (!order) return notify('Order not found.', 'error');
                appState.context.activeOrder = order;
                appState.context.tableId = tableId;
                // Snapshot current quantities so send-to-kitchen can derive the delta (extra items only)
                appState.context.previousItems = (order.orderItems || []).map(oi => ({
                    id: oi.mealItem?.id,
                    qty: oi.quantity
                }));
                notify(`Adding items to Table ${tableId}…`);
                navigateTo('menu');
            });
        });

        // Admin: open billing ledger
        document.getElementById('view-billing-history')?.addEventListener('click', () => {
            navigateTo('billing', { title: 'Billing Ledger' });
        });
    }

    // Billing history: back button
    if (view === 'billing') {
        document.getElementById('back-to-dashboard')?.addEventListener('click', () => {
            navigateTo('dashboard');
        });
    }

    // Tables: Order Flow Start
    if (view === 'tables') {
        // Helper: build and show order summary modal for an OCCUPIED table
        const showTableModal = (tableId, order) => {
            document.getElementById('table-order-modal')?.remove(); // close any existing

            const items    = order?.orderItems || [];
            const subtotal = items.reduce((s, i) => s + (i.priceAtPurchase * i.quantity), 0);
            const tax      = subtotal * 0.08;
            const total    = subtotal + tax;

            const statusMeta = {
                RECEIVED:  { color: '#818cf8', label: '📋 Received',        bg: 'rgba(99,102,241,0.15)' },
                PREPARING: { color: '#f59e0b', label: '🔥 In Kitchen',      bg: 'rgba(245,158,11,0.15)' },
                READY:     { color: '#10b981', label: '✓ Ready to Serve',   bg: 'rgba(16,185,129,0.15)' },
                SERVED:    { color: '#fb923c', label: '💳 Awaiting Payment', bg: 'rgba(251,146,60,0.15)' },
            };
            const sm = statusMeta[order?.status] || statusMeta.RECEIVED;

            const modal = document.createElement('div');
            modal.id = 'table-order-modal';
            modal.style.cssText = `
                position:fixed; inset:0; z-index:9999;
                background:rgba(0,0,0,0.65); backdrop-filter:blur(6px);
                display:flex; align-items:center; justify-content:center;
                animation:fadeIn 0.18s ease;
            `;
            modal.innerHTML = `
                <div style="background:#0f172a; border:1px solid rgba(255,255,255,0.08);
                            border-radius:1.5rem; width:420px; max-width:92vw;
                            box-shadow:0 30px 80px rgba(0,0,0,0.6); overflow:hidden;">

                    <!-- Header -->
                    <div style="padding:1.25rem 1.5rem; border-bottom:1px solid rgba(255,255,255,0.06);
                                display:flex; justify-content:space-between; align-items:center;
                                background:rgba(255,255,255,0.02);">
                        <div>
                            <div style="font-size:1.4rem; font-weight:900; color:white; letter-spacing:-0.02em;">
                                Table ${tableId}
                            </div>
                            <div style="font-size:0.65rem; color:#64748b; font-weight:600; margin-top:2px; font-family:monospace;">
                                ORDER #${order?.id?.split('-')[1] || '—'}
                            </div>
                        </div>
                        <span style="padding:4px 12px; border-radius:999px; font-size:0.62rem;
                                     font-weight:800; text-transform:uppercase; letter-spacing:0.08em;
                                     background:${sm.bg}; color:${sm.color};">
                            ${sm.label}
                        </span>
                    </div>

                    <!-- Items -->
                    <div style="padding:1rem 1.5rem; max-height:240px; overflow-y:auto;">
                        ${items.length === 0
                            ? `<p style="color:#475569; font-size:0.85rem; text-align:center; padding:1rem 0;">No items yet.</p>`
                            : items.map(oi => `
                                <div style="display:flex; justify-content:space-between; align-items:center;
                                            padding:0.55rem 0; border-bottom:1px solid rgba(255,255,255,0.04);">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <span style="background:rgba(255,255,255,0.06); color:white;
                                                     font-weight:800; font-size:0.78rem; width:24px; height:24px;
                                                     border-radius:6px; display:flex; align-items:center; justify-content:center;">
                                            ${oi.quantity}
                                        </span>
                                        <span style="font-size:0.88rem; color:#e2e8f0; font-weight:500;">${oi.mealItem?.name}</span>
                                    </div>
                                    <span style="font-size:0.85rem; color:#94a3b8; font-weight:700;">
                                        $${(oi.priceAtPurchase * oi.quantity).toFixed(2)}
                                    </span>
                                </div>`).join('')}
                    </div>

                    <!-- Totals -->
                    <div style="padding:0.75rem 1.5rem; background:rgba(0,0,0,0.2);
                                border-top:1px solid rgba(255,255,255,0.05);">
                        <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:4px;">
                            <span style="color:#64748b;">Subtotal</span>
                            <span style="color:#94a3b8; font-weight:700;">$${subtotal.toFixed(2)}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:6px;">
                            <span style="color:#64748b;">Tax (8%)</span>
                            <span style="color:#94a3b8; font-weight:700;">$${tax.toFixed(2)}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:1.05rem;
                                    padding-top:6px; border-top:1px solid rgba(255,255,255,0.06);">
                            <span style="color:white; font-weight:800;">Total</span>
                            <span style="color:#ec5b13; font-weight:900;">$${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div style="padding:1rem 1.5rem 1.25rem; display:flex; gap:0.6rem;">
                        <button id="modal-add-items" style="flex:2; padding:0.75rem;
                            background:rgba(59,130,246,0.15); color:#60a5fa;
                            border:1px solid rgba(59,130,246,0.25); border-radius:0.75rem;
                            font-weight:800; font-size:0.78rem; text-transform:uppercase;
                            letter-spacing:0.06em; cursor:pointer; display:flex;
                            align-items:center; justify-content:center; gap:6px; transition:all 0.2s;"
                            onmouseover="this.style.background='rgba(59,130,246,0.25)'"
                            onmouseout="this.style.background='rgba(59,130,246,0.15)'">
                            <span class="material-symbols-outlined" style="font-size:16px;">add_circle</span>
                            Add Items
                        </button>
                        ${order?.status === 'SERVED' ? `
                        <button id="modal-pay-bill" style="flex:2; padding:0.75rem;
                            background:linear-gradient(135deg,#10b981,#059669); color:white;
                            border:none; border-radius:0.75rem; font-weight:800; font-size:0.78rem;
                            text-transform:uppercase; letter-spacing:0.06em; cursor:pointer;
                            display:flex; align-items:center; justify-content:center; gap:6px;
                            box-shadow:0 4px 15px rgba(16,185,129,0.25); transition:all 0.2s;"
                            onmouseover="this.style.opacity='0.9'"
                            onmouseout="this.style.opacity='1'">
                            <span class="material-symbols-outlined" style="font-size:16px;">receipt</span>
                            Pay Bill
                        </button>` : ''}
                        <button id="modal-dismiss" style="flex:1; padding:0.75rem;
                            background:transparent; color:#475569;
                            border:1px solid rgba(255,255,255,0.06); border-radius:0.75rem;
                            font-weight:700; font-size:0.78rem; cursor:pointer; transition:all 0.2s;"
                            onmouseover="this.style.background='rgba(255,255,255,0.04)'"
                            onmouseout="this.style.background='transparent'">
                            Dismiss
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Dismiss on backdrop click
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
            document.getElementById('modal-dismiss')?.addEventListener('click', () => modal.remove());

            document.getElementById('modal-add-items')?.addEventListener('click', () => {
                modal.remove();
                appState.context.tableId = tableId;
                appState.context.activeOrder = order;
                appState.context.previousItems = (order?.orderItems || []).map(oi => ({
                    id: oi.mealItem?.id, qty: oi.quantity
                }));
                navigateTo('menu');
            });

            document.getElementById('modal-pay-bill')?.addEventListener('click', () => {
                modal.remove();
                navigateTo('checkout', { orderId: order.id });
            });
        };

        document.querySelectorAll('.interactive-table').forEach(card => {
            card.addEventListener('click', async () => {
                const id    = card.getAttribute('data-id');
                const table = appState.tables.find(t => t.id === id);

                if (table.status === 'FREE' || table.status === 'RESERVED') {
                    const res = await fetch(`${API_BASE}/orders`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tableId: id, waiterId: appState.currentUser.id })
                    });
                    appState.context.activeOrder = await res.json();
                    appState.context.tableId = id;
                    notify(`Assigned Table ${id}.`);
                    navigateTo('menu');
                } else if (table.status === 'OCCUPIED') {
                    // Show order summary popup instead of immediately navigating
                    const order = appState.orders.find(o => o.tableId === id && o.status !== 'PAID');
                    showTableModal(id, order);
                }
            });
        });

        // Admin: Add Table panel toggle
        const toggleBtn = document.getElementById('toggle-add-table');
        const panel = document.getElementById('add-table-panel');
        const cancelBtn = document.getElementById('cancel-add-table');

        toggleBtn?.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        cancelBtn?.addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // Admin: Add Table form submit
        document.getElementById('add-table-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('new-table-id').value.trim();
            const capacity = parseInt(document.getElementById('new-table-capacity').value);

            const res = await fetch(`${API_BASE}/tables`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, capacity })
            });

            if (res.ok) {
                notify(`Table ${id} (${capacity} seats) added to floor.`);
                navigateTo('tables');
            } else {
                const err = await res.json();
                notify(err.error || 'Failed to add table.', 'error');
            }
        });
    }

    // Tables: filter tabs
    if (view === 'tables') {
        document.querySelectorAll('.table-filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // update active style
                document.querySelectorAll('.table-filter-tab').forEach(t => {
                    t.style.color = '#94a3b8';
                    t.style.borderBottom = '2px solid transparent';
                });
                tab.style.color = '#ec5b13';
                tab.style.borderBottom = '2px solid #ec5b13';

                const filter = tab.getAttribute('data-tab');
                document.querySelectorAll('.table-card-new').forEach(card => {
                    const status = card.getAttribute('data-status');
                    card.style.display = (filter === 'all' || status === filter) ? '' : 'none';
                });
                // also hide/show the add new table card placeholder
                const addCard = document.getElementById('toggle-add-table-card');
                if (addCard) addCard.style.display = filter === 'all' ? '' : 'none';
            });
        });
    }


    if (view === 'menu') {
        // Toggle Visibility for Chef
        document.querySelectorAll('.toggle-availability').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const item = appState.menu.find(m => m.id === parseInt(id));
                await fetch(`${API_BASE}/menu/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isAvailable: !item.isAvailable })
                });
                navigateTo('menu');
            });
        });

        // Add Menu Item Toggle (Admin)
        document.getElementById('add-menu-item-toggle')?.addEventListener('click', () => {
            const form = document.getElementById('add-menu-form-container');
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('cancel-add-menu')?.addEventListener('click', () => {
            document.getElementById('add-menu-form-container').style.display = 'none';
        });

        document.getElementById('add-menu-item-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const body = Object.fromEntries(formData.entries());
            await fetch(`${API_BASE}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            notify("New dish added to terminal.");
            navigateTo('menu');
        });

        // Quantity logic (Flicker-free for both split-panel and card-only views)
        const updateQuantity = async (itemId, delta) => {
            const item = appState.menu.find(m => String(m.id) === String(itemId));
            if (!item) return notify("Dish not found in menu index.", "error");
            if (!appState.context.activeOrder) return notify("No active table session found.", "error");

            // Optimistic UI Update
            const qtyVals  = document.querySelectorAll(`.qty-val[data-id="${itemId}"]`);
            const badges   = document.querySelectorAll(`.qty-badge[data-id="${itemId}"]`);
            const firstVal = qtyVals[0];
            let nextQty = firstVal ? (parseInt(firstVal.textContent) || 0) + delta : delta;
            if (nextQty < 0) nextQty = 0;

            qtyVals.forEach(el => el.textContent = nextQty);
            badges.forEach(el => {
                el.textContent = nextQty;
                el.style.display = nextQty > 0 ? 'flex' : 'none';
            });

            try {
                const res = await fetch(`${API_BASE}/orders/${appState.context.activeOrder.id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: [{ mealItem: item, quantity: delta }] })
                });
                
                if (!res.ok) throw new Error("API rejection");
                
                const data = await res.json();
                appState.context.activeOrder = data;
                
                const cartCount = document.getElementById('cart-count');
                if (cartCount) cartCount.textContent = data.orderItems.reduce((a, b) => a + b.quantity, 0);
                
                navigateTo('menu');
            } catch (err) {
                notify("Failed to sync order. Please retry.", "error");
                navigateTo('menu');
            }
        };

        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); updateQuantity(parseInt(btn.getAttribute('data-id')), 1); });
        });
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            if (btn.getAttribute('data-remove') === 'true') return; // handled separately
            btn.addEventListener('click', (e) => { e.stopPropagation(); updateQuantity(parseInt(btn.getAttribute('data-id')), -1); });
        });

        // Waiter: + button on menu cards
        document.querySelectorAll('.menu-add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateQuantity(parseInt(btn.getAttribute('data-id')), 1);
            });
        });

        // Guest count adjustment (Visual/Persistent in context)
        document.querySelectorAll('.guest-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const el = btn.parentElement.previousElementSibling;
                let count = parseInt(el.textContent) + 1;
                appState.context.guestCount = count;
                el.textContent = count;
                notify(`Guests updated: ${count}`);
            });
        });
        document.querySelectorAll('.guest-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const el = btn.parentElement.previousElementSibling;
                let count = parseInt(el.textContent) - 1;
                if (count < 1) count = 1;
                appState.context.guestCount = count;
                el.textContent = count;
                notify(`Guests updated: ${count}`);
            });
        });

        // Remove item entirely from summary
        document.querySelectorAll('.qty-btn[data-remove="true"]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute('data-id'));
                const item = appState.menu.find(m => m.id === id);
                const orderItem = appState.context.activeOrder?.orderItems.find(oi => oi.mealItem.id === id);
                
                if (orderItem) {
                    await fetch(`${API_BASE}/orders/${appState.context.activeOrder.id}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: [{ mealItem: item, quantity: -orderItem.quantity }] })
                    });
                    navigateTo('menu');
                }
            });
        });

        document.getElementById('send-to-kitchen')?.addEventListener('click', async () => {
            const note = document.getElementById('order-notes')?.value?.trim() || '';
            appState.context.orderNote = note;
            if (!appState.context.activeOrder || appState.context.activeOrder.orderItems.length === 0) {
                return notify("Please add items to the order first.", "error");
            }

            // ── Compute delta: what NEW items were added since we clicked 'Add Items' ──
            const previousItems = appState.context.previousItems || [];
            const currentItems  = appState.context.activeOrder.orderItems || [];
            const deltaLines = currentItems
                .map(oi => {
                    const prev = previousItems.find(p => String(p.id) === String(oi.mealItem?.id));
                    const prevQty = prev ? prev.qty : 0;
                    const addedQty = oi.quantity - prevQty;
                    return addedQty > 0 ? `${addedQty}× ${oi.mealItem?.name}` : null;
                })
                .filter(Boolean);
            appState.context.previousItems = null; // clear snapshot

            // Build the final kitchen note
            let kitchenNote = note;
            if (deltaLines.length > 0 && previousItems.length > 0) {
                // Adding to an existing order — prepend the delta clearly for the chef
                const deltaStr = `🆕 EXTRA ITEMS ONLY: ${deltaLines.join(', ')}`;
                kitchenNote = kitchenNote ? `${deltaStr} | ${kitchenNote}` : deltaStr;
            }

            if (kitchenNote) {
                await fetch(`${API_BASE}/orders/${appState.context.activeOrder.id}/note`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ note: kitchenNote })
                }).catch(() => {});
            }

            // ── Set status back to PREPARING so it appears on KDS ──
            const isAddingToExisting = ['PREPARING', 'READY', 'SERVED'].includes(appState.context.activeOrder?.status);
            await fetch(`${API_BASE}/orders/${appState.context.activeOrder.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'PREPARING' })
            }).catch(() => {});

            notify(isAddingToExisting ? "Additional items sent to kitchen! 🔥" : "Order fired to kitchen successfully!");
            appState.context.orderNote = '';
            navigateTo(isAddingToExisting ? 'dashboard' : 'tables');
        });


        // Category filter pills
        document.querySelectorAll('.cat-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.cat-pill').forEach(p => {
                    p.style.background = 'rgba(255,255,255,0.08)';
                    p.style.color = '#94a3b8';
                });
                pill.style.background = '#ec5b13';
                pill.style.color = 'white';
                const cat = pill.getAttribute('data-cat');
                document.querySelectorAll('.menu-card-new').forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    card.style.display = (cat === 'all' || cardCat === cat) ? '' : 'none';
                });
            });
        });

        // Live search
        document.getElementById('menu-search')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.menu-card-new').forEach(card => {
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                card.style.display = name.includes(q) ? '' : 'none';
            });
        });
    }

    // Kitchen: Process Lifecycle
    if (view === 'kitchen') {
        const setStatus = async (orderId, status) => {
            await fetch(`${API_BASE}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            await appState.refresh();
            navigateTo('kitchen');
        };

        document.querySelectorAll('.mark-preparing').forEach(btn => {
            btn.addEventListener('click', () => setStatus(btn.getAttribute('data-id'), 'PREPARING'));
        });
        document.querySelectorAll('.mark-ready').forEach(btn => {
            btn.addEventListener('click', () => {
                setStatus(btn.getAttribute('data-id'), 'READY');
                notify("Order marked as READY. Waiter notified.");
            });
        });
        document.querySelectorAll('.mark-served').forEach(btn => {
            btn.addEventListener('click', () => {
                setStatus(btn.getAttribute('data-id'), 'SERVED');
                notify("Order delivered. Ready for checkout.");
                navigateTo('dashboard');
            });
        });

        // ── Live KDS Stopwatch ── tick every second, colour-code by urgency
        const tickTimers = () => {
            const now = Date.now();
            document.querySelectorAll('.order-timer[data-start]').forEach(el => {
                const start  = new Date(el.getAttribute('data-start')).getTime();
                const diffMs = Math.max(0, now - start);
                const mins   = Math.floor(diffMs / 60000);
                const secs   = Math.floor((diffMs % 60000) / 1000);
                el.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

                // Colour: white → amber (10 min) → red (20 min)
                if (mins >= 20) {
                    el.style.color = '#ef4444';
                    el.closest('.card-glass')?.querySelector('.timer-icon')?.style.setProperty('color', '#ef4444');
                } else if (mins >= 10) {
                    el.style.color = '#f59e0b';
                } else {
                    el.style.color = '#e2e8f0';
                }
            });
        };

        tickTimers(); // immediate first tick
        // Store ticker so stopLiveRefresh can kill it if needed
        if (window._kdsTickTimer) clearInterval(window._kdsTickTimer);
        window._kdsTickTimer = setInterval(tickTimers, 1000);
    }

    // Checkout
    if (view === 'checkout') {
        const orderId = params.orderId;
        const methodBtns = document.querySelectorAll('.payment-method-btn');
        const processArea = document.getElementById('payment-process-area');
        const confirmBtn = document.getElementById('confirm-payment-execution');
        const cancelBtn = document.getElementById('cancel-checkout');

        methodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                methodBtns.forEach(b => {
                    b.style.borderColor = 'rgba(255,255,255,0.1)';
                    b.style.background = 'transparent';
                    b.setAttribute('data-selected', 'false');
                });
                btn.style.borderColor = '#10b981';
                btn.style.background = 'rgba(16,185,129,0.1)';
                btn.setAttribute('data-selected', 'true');
                appState.context.selectedPaymentMethod = btn.getAttribute('data-method');
                processArea.style.display = 'block';
            });
        });

        confirmBtn?.addEventListener('click', async () => {
            const res = await fetch(`${API_BASE}/orders/${orderId}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ method: appState.context.selectedPaymentMethod, amount: 0 })
            });

            if (res.ok) {
                notify("Transaction Approved.");
                navigateTo('dashboard');
            }
        });

        cancelBtn?.addEventListener('click', () => {
            notify("Transaction Aborted.");
            navigateTo('dashboard');
        });
    }

    // Reservations
    if (view === 'reservations') {
        document.getElementById('reservation-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const body = {
                tableId: document.getElementById('table-select').value,
                customerId: document.getElementById('customer-name').value,
                reservationTime: document.getElementById('reservation-time').value,
                partySize: parseInt(document.getElementById('party-size').value)
            };
            const res = await fetch(`${API_BASE}/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                notify("RSVP Secured. Table will auto-lock 30 min before slot.");
                navigateTo('reservations');
            } else {
                notify("Conflict detected.", "error");
            }
        });

        // Cancel (void) reservation buttons
        document.querySelectorAll('.cancel-res').forEach(btn => {
            btn.addEventListener('click', async () => {
                const resId = btn.getAttribute('data-id');
                const res = await fetch(`${API_BASE}/reservations/${resId}`, { method: 'DELETE' });
                if (res.ok) {
                    notify("Reservation cancelled. Table released to FREE.");
                    navigateTo('reservations');
                } else {
                    notify("Could not cancel reservation.", "error");
                }
            });
        });
    }

    // Staff Management
    if (view === 'staff') {
        const toggleBtn = document.getElementById('toggle-staff-form');
        const panel = document.getElementById('staff-form-panel');
        const closeBtn = document.getElementById('close-staff-form');

        toggleBtn?.addEventListener('click', () => {
            panel.style.display = 'block';
        });

        closeBtn?.addEventListener('click', () => {
            panel.style.display = 'none';
        });

        document.getElementById('add-staff-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('staff-username').value;
            const role = document.getElementById('staff-role').value;
            const password = document.getElementById('staff-password').value;

            const res = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, role, password })
            });

            if (res.ok) {
                notify(`Staff account [${username}] initialized.`);
                panel.style.display = 'none';
                navigateTo('staff'); // Refresh view
            } else {
                notify("Failed to initialize account.", "error");
            }
        });

        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                if (id === appState.currentUser.id) {
                    notify("You cannot revoke your own access.", "error");
                    return;
                }
                const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    notify("Account access revoked.");
                    navigateTo('staff');
                }
            });
        });

        // Change Password Modal
        const pwModal = document.getElementById('change-pw-modal');
        document.querySelectorAll('.change-pw-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('change-pw-userid').value = btn.getAttribute('data-id');
                document.getElementById('change-pw-label').textContent = `Resetting password for: ${btn.getAttribute('data-name')}`;
                document.getElementById('change-pw-input').value = '';
                pwModal.style.display = 'flex';
            });
        });

        document.getElementById('close-pw-modal')?.addEventListener('click', () => {
            pwModal.style.display = 'none';
        });

        pwModal?.addEventListener('click', (e) => {
            if (e.target === pwModal) pwModal.style.display = 'none';
        });

        document.getElementById('change-pw-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('change-pw-userid').value;
            const newPassword = document.getElementById('change-pw-input').value;
            const res = await fetch(`${API_BASE}/users/${id}/password`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            });
            if (res.ok) {
                notify("Credentials updated successfully.");
                pwModal.style.display = 'none';
            } else {
                notify("Failed to update credentials.", "error");
            }
        });
    }
};

// Global Nav
navItems.forEach(item => {
    item.addEventListener('click', () => {
        appState.context.tableId = null;
        navigateTo(item.getAttribute('data-view'));
    });
});

document.getElementById('logout-btn')?.addEventListener('click', () => {
    appState.currentUser = null;
    appState.context.tableId = null;
    notify("Session Terminated.");
    navigateTo('login');
});

// Bootstrap
(() => {
    navigateTo('dashboard');
    
    // Background State Sync (every 5 seconds)
    setInterval(async () => {
        if (appState.currentUser && appState.currentView === 'kitchen') {
            const oldOrderCount = appState.orders.length;
            await appState.refresh();
            // Only re-render full view if orders count changed or status changed
            if (appState.orders.length !== oldOrderCount) {
                viewContainer.innerHTML = renderKitchen(appState);
                attachAllListeners('kitchen');
            }
        } else if (appState.currentUser) {
            await appState.refresh();
        }

        // 🔔 Waiter notification badge: count READY orders
        const badge = document.getElementById('ready-order-badge');
        if (badge && appState.currentUser?.role === UserRole.WAITER) {
            const readyCount = appState.orders.filter(o => o.status === 'READY').length;
            if (readyCount > 0 && appState.currentView !== 'kitchen') {
                badge.textContent = readyCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }, 5000);

    // High-frequency Timer Tick (every 1 second)
    // SURGICAL UPDATE: No more flickering by only updating text nodes
    setInterval(() => {
        // Update live clock in top-bar
        const clockEl = document.getElementById('live-clock');
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }

        if (appState.currentView === 'kitchen' && appState.currentUser) {
            // Update individual order timers
            document.querySelectorAll('.order-timer').forEach(el => {
                const startTime = el.getAttribute('data-start');
                if (!startTime) return;
                
                const start = new Date(startTime);
                const now = new Date();
                const diff = Math.max(0, Math.floor((now - start) / 1000));
                const mins = Math.floor(diff / 60);
                const secs = diff % 60;
                el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                
                // Optional: Add warning color for old tickets
                if (mins >= 10) el.style.color = '#ef4444';
            });

            // Update stats if elements exist
            const activeOrders = appState.orders.filter(o => o.status !== 'PAID' && o.status !== 'SERVED');
            const pendingCount = activeOrders.filter(o => o.status === 'RECEIVED').length;
            
            const activeEl = document.getElementById('stat-active-tickets');
            const pendingEl = document.getElementById('stat-pending-queue');
            if (activeEl) activeEl.textContent = activeOrders.length;
            if (pendingEl) pendingEl.textContent = pendingCount;
        }
    }, 1000);
})();
