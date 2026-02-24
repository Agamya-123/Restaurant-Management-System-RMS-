import { OrderStatus } from '../../core/domain/enums/OrderStatus.js';
import { UserRole } from '../../core/domain/enums/UserRole.js';

export const renderLogin = () => `
    <div style="
        position: fixed; inset: 0;
        background-color: #0f172a;
        display: flex; align-items: center; justify-content: center;
        padding: 1rem; z-index: 1000;
        font-family: 'Inter', sans-serif;
    ">
        <div style="width: 100%; max-width: 448px;">

            <!-- Card -->
            <section style="
                background: rgba(30, 41, 59, 0.7);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                border-radius: 1.5rem;
                padding: 3rem;
            " class="fade-in">

                <!-- Brand Header -->
                <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:2.5rem;">
                    <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem;">
                        <div style="background:rgba(16,185,129,0.2); padding:0.5rem; border-radius:0.5rem;">
                            <svg width="32" height="32" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                            </svg>
                        </div>
                        <h1 style="font-size:1.875rem; font-weight:700; letter-spacing:0.1em; color:#fff; margin:0;">SAVORIA<span style="color:#34d399;">RMS</span></h1>
                    </div>
                    <p style="color:#94a3b8; font-size:0.75rem; font-weight:500; text-transform:uppercase; letter-spacing:0.2em; margin:0;">
                        Enterprise Hospitality Management
                    </p>
                </div>

                <!-- Form -->
                <form id="login-form" style="display:flex; flex-direction:column; gap:1.5rem;">

                    <!-- Username -->
                    <div>
                        <label for="username" style="
                            display:block; font-size:0.65rem; font-weight:700;
                            color:#94a3b8; text-transform:uppercase; letter-spacing:0.2em;
                            margin-bottom:0.5rem; margin-left:0.25rem;
                        ">Username</label>
                        <input
                            type="text" id="username" name="username"
                            placeholder="e.g. admin, waiter, chef" required
                            style="
                                width:100%; box-sizing:border-box;
                                background:#1e293b; border:1px solid #334155; color:#f8fafc;
                                padding:0.75rem 1rem; border-radius:0.75rem;
                                font-size:0.875rem; font-family:inherit;
                                transition: border-color 0.2s;
                                outline: none;
                            "
                            onfocus="this.style.borderColor='#10b981'"
                            onblur="this.style.borderColor='#334155'"
                        />
                    </div>

                    <!-- Password -->
                    <div>
                        <label for="password" style="
                            display:block; font-size:0.65rem; font-weight:700;
                            color:#94a3b8; text-transform:uppercase; letter-spacing:0.2em;
                            margin-bottom:0.5rem; margin-left:0.25rem;
                        ">Password</label>
                        <input
                            type="password" id="password" name="password"
                            placeholder="••••••" value="123" required
                            style="
                                width:100%; box-sizing:border-box;
                                background:#1e293b; border:1px solid #334155; color:#f8fafc;
                                padding:0.75rem 1rem; border-radius:0.75rem;
                                font-size:0.875rem; font-family:inherit;
                                transition: border-color 0.2s;
                                outline: none;
                            "
                            onfocus="this.style.borderColor='#10b981'"
                            onblur="this.style.borderColor='#334155'"
                        />
                    </div>

                    <!-- Submit -->
                    <div style="padding-top:1rem;">
                        <button type="submit" id="login-btn" style="
                            width:100%; padding:1rem;
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                            border:none; border-radius:0.75rem;
                            color:white; font-weight:700; font-size:0.875rem;
                            text-transform:uppercase; letter-spacing:0.2em;
                            font-family:inherit; cursor:pointer;
                            box-shadow: 0 10px 25px -5px rgba(16,185,129,0.25);
                            transition: filter 0.2s, transform 0.1s;
                        "
                        onmouseover="this.style.filter='brightness(1.1)'"
                        onmouseout="this.style.filter='brightness(1)'"
                        onmousedown="this.style.transform='scale(0.98)'"
                        onmouseup="this.style.transform='scale(1)'">
                            Access Terminal
                        </button>
                    </div>
                </form>

                <!-- Footer credentials pill -->
                <footer style="margin-top:2.5rem; text-align:center;">
                    <div style="
                        display:inline-block; padding:0.4rem 1rem;
                        background:rgba(30,41,59,0.5);
                        border-radius:999px; border:1px solid rgba(71,85,105,0.5);
                    ">
                        <p style="font-size:0.7rem; color:#94a3b8; font-weight:500; margin:0;">
                            Demo: <span style="color:#34d399;">admin / waiter / chef</span>
                            <span style="color:#475569;"> (pass: 123)</span>
                        </p>
                    </div>
                </footer>

            </section>

            <!-- App meta -->
            <div style="margin-top:2rem; text-align:center;">
                <p style="color:#1e293b; font-size:0.6rem; text-transform:uppercase; letter-spacing:0.2em; font-weight:700;">
                    © 2025 Savoria Systems Inc. v4.2.0
                </p>
            </div>

        </div>
    </div>
`;


export const renderDashboard = (state) => {
    const role = state.currentUser.role;
    const paidOrders = (state.orders || []).filter(o => o.status === 'PAID');
    const lifeTimeRevenue = paidOrders.reduce((a, o) => a + ((o.totalAmount || 0) * 1.17), 0);
    const occupied = state.tables.filter(t => t.status === 'OCCUPIED').length;
    const total = state.tables.length || 1;
    const occupancyPct = Math.round((occupied / total) * 100);
    const kdsBacklog = state.orders.filter(o => o.status === 'PREPARING').length;
    // SVG circular progress: r=20, circumference = 2π*20 ≈ 125.6
    const dashOffset = 125.6 - ((occupancyPct / 100) * 125.6);

    // ── Card style tokens ──
    const card = `background:#1e293b; border-radius:1rem; border:1px solid #1e3a5f; padding:1.5rem; transition: border-color 0.2s;`;
    const labelStyle = `font-size:0.65rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:1rem; display:block;`;
    const valueStyle = `font-size:1.5rem; font-weight:700; color:#f1f5f9;`;
    const subtextStyle = `font-size:0.65rem; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-top:0.25rem;`;
    const sectionCard = `background:#1e293b; border-radius:1rem; border:1px solid #1e3a5f; overflow:hidden; margin-top:1.5rem;`;
    const sectionHeader = `padding:1.25rem 1.5rem; border-bottom:1px solid #0f2744; display:flex; align-items:center; gap:0.75rem;`;
    const sectionTitle = `font-weight:700; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.15em; color:#f1f5f9;`;

    // ── Admin insights ──
    const adminDashboard = role === UserRole.ADMIN ? `

        <!-- Hero Revenue Banner -->
        <section style="display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:1.5rem; margin-bottom:2rem;">
            <div>
                <div style="${labelStyle} margin-bottom:0.4rem;">Lifetime Revenue (DB)</div>
                <div style="font-size:3.5rem; font-weight:900; color:#10b981; letter-spacing:-0.03em; line-height:1;" id="lifetime-revenue">
                    $${lifeTimeRevenue.toFixed(2)}
                </div>
            </div>
            <button id="view-billing-history" style="
                background:#10b981; color:#020617; font-weight:700; font-size:0.78rem;
                text-transform:uppercase; letter-spacing:0.12em;
                padding:0.65rem 1.4rem; border-radius:0.6rem; border:none; cursor:pointer;
                display:flex; align-items:center; gap:0.5rem;
                box-shadow: 0 4px 15px rgba(16,185,129,0.2);
                transition: background 0.2s;
            " onmouseover="this.style.background='#34d399'" onmouseout="this.style.background='#10b981'">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                    <path clip-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" fill-rule="evenodd"/>
                </svg>
                Billing History
            </button>
        </section>

        <!-- 4-Stat Grid -->
        <section style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:1.25rem; margin-bottom:0.5rem;">

            <!-- Today's Revenue -->
            <div style="${card}">
                <span style="${labelStyle}">Today's Revenue</span>
                <div style="display:flex; align-items:flex-end; justify-content:space-between;">
                    <div>
                        <div style="${valueStyle}">$${state.revenue.toFixed(2)}</div>
                        <div style="display:flex; align-items:center; gap:4px; color:#10b981; margin-top:0.3rem;">
                            <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
                                <path clip-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" fill-rule="evenodd"/>
                            </svg>
                            <span style="font-size:0.65rem; font-weight:700; letter-spacing:0.05em;">Live from POS</span>
                        </div>
                    </div>
                    <div style="padding:0.5rem; background:rgba(16,185,129,0.1); border-radius:0.5rem; color:#10b981;">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Table Occupancy -->
            <div style="${card}">
                <span style="${labelStyle}">Table Occupancy</span>
                <div style="display:flex; align-items:center; justify-content:space-between;">
                    <div>
                        <div style="${valueStyle}">${occupied}/${total}</div>
                        <div style="${subtextStyle}">${occupancyPct}% Capacity</div>
                    </div>
                    <div style="position:relative; width:52px; height:52px;">
                        <svg width="52" height="52" viewBox="0 0 52 52" style="transform:rotate(-90deg);">
                            <circle cx="26" cy="26" r="20" fill="transparent" stroke="#1e3a5f" stroke-width="5"/>
                            <circle cx="26" cy="26" r="20" fill="transparent" stroke="#10b981" stroke-width="5"
                                stroke-dasharray="125.6"
                                stroke-dashoffset="${dashOffset}"
                                stroke-linecap="round"/>
                        </svg>
                        <span style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:0.6rem; font-weight:700; color:#10b981;">
                            ${occupancyPct}%
                        </span>
                    </div>
                </div>
            </div>

            <!-- KDS Backlog -->
            <div style="${card}">
                <span style="${labelStyle}">KDS Backlog</span>
                <div style="display:flex; align-items:flex-end; justify-content:space-between;">
                    <div>
                        <div style="${valueStyle}">${kdsBacklog}</div>
                        <div style="${subtextStyle}">Items in fire</div>
                    </div>
                    <div style="padding:0.5rem; background:rgba(249,115,22,0.1); border-radius:0.5rem; color:#fb923c;">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7C14 13 12 19 12 19s-.5-2-1.5-3.5c-.711.318-1.304.755-1.742 1.274"/>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Total Bills Settled -->
            <div style="${card}">
                <span style="${labelStyle}">Total Bills Settled</span>
                <div style="display:flex; align-items:flex-end; justify-content:space-between;">
                    <div>
                        <div style="${valueStyle}">${paidOrders.length}</div>
                        <div style="${subtextStyle}">All time</div>
                    </div>
                    <div style="padding:0.5rem; background:rgba(99,102,241,0.1); border-radius:0.5rem; color:#818cf8;">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                </div>
            </div>

        </section>
    ` : `
        <!-- Non-admin simplified header -->
        <div style="margin-bottom:2rem;">
            <h2 style="font-size:1.4rem; font-weight:700; color:#f1f5f9;">Operating as <span style="color:#10b981;">${role}</span></h2>
        </div>
    `;

    // ── Waiter Console ──
    // Active = everything that hasn't been PAID yet (table stays visible until customer settles)
    const activeOrders = state.orders.filter(o => ['RECEIVED', 'PREPARING', 'READY', 'SERVED'].includes(o.status));

    const statusColors = {
        RECEIVED:  { bg: 'rgba(99,102,241,0.08)',   border: 'rgba(99,102,241,0.2)',   text: '#818cf8', label: '📋 Received' },
        PREPARING: { bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.2)',   text: '#f59e0b', label: '🔥 In Kitchen' },
        READY:     { bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.25)',  text: '#10b981', label: '✓ Ready to Serve' },
        SERVED:    { bg: 'rgba(251,146,60,0.08)',   border: 'rgba(251,146,60,0.25)',  text: '#fb923c', label: '💳 Awaiting Payment' },
    };

    const waiterConsoleHtml = (role === UserRole.ADMIN || role === UserRole.WAITER) ? `

        <!-- ① My Active Tables -->
        <div style="${sectionCard}">
            <div style="${sectionHeader}">
                <span style="font-size:1.2rem;">🍽️</span>
                <h4 style="${sectionTitle}">My Active Tables</h4>
                ${activeOrders.length > 0 ? `<span style="margin-left:auto; background:rgba(236,91,19,0.12); color:#ec5b13; font-size:0.6rem; font-weight:800; padding:2px 9px; border-radius:4px; text-transform:uppercase;">${activeOrders.length} live</span>` : ''}
            </div>
            <div style="padding:1.25rem;">
                ${activeOrders.length === 0 ? `
                    <div style="text-align:center; padding:2.5rem 1rem; opacity:0.5;">
                        <span class="material-symbols-outlined" style="font-size:2.5rem; color:#475569; display:block; margin-bottom:0.5rem;">table_restaurant</span>
                        <p style="color:#64748b; font-size:0.85rem; font-weight:600;">No active orders right now.</p>
                        <p style="color:#475569; font-size:0.72rem; margin-top:0.25rem;">Go to Tables to seat a new guest.</p>
                    </div>
                ` : `
                    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:1.1rem;">
                        ${activeOrders.map(o => {
                            const sc = statusColors[o.status] || statusColors.PREPARING;
                            const subtotal = (o.orderItems || []).reduce((s, i) => s + (i.priceAtPurchase * i.quantity), 0);
                            return `
                                <div style="background:${sc.bg}; border:1px solid ${sc.border}; border-radius:1rem; padding:1.25rem; display:flex; flex-direction:column; gap:0.85rem;">

                                    <!-- Header -->
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <div>
                                            <div style="font-size:1rem; font-weight:800; color:white;">Table ${o.tableId}</div>
                                            <div style="font-size:0.65rem; color:#64748b; margin-top:2px; font-weight:600;">${(o.orderItems || []).reduce((s,i)=>s+i.quantity,0)} items · $${(subtotal * 1.17).toFixed(2)} est.</div>
                                        </div>
                                        <span style="font-size:0.62rem; font-weight:800; color:${sc.text}; background:${sc.bg}; border:1px solid ${sc.border}; padding:3px 9px; border-radius:999px; text-transform:uppercase; letter-spacing:0.08em;">${sc.label}</span>
                                    </div>

                                    <!-- Items list -->
                                    <div style="display:flex; flex-direction:column; gap:0.3rem; padding:0.6rem 0; border-top:1px solid rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.05);">
                                        ${(o.orderItems || []).map(oi => `
                                            <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
                                                <span style="color:#e2e8f0; font-weight:600;">${oi.mealItem?.name || 'Item'}</span>
                                                <span style="color:#64748b; font-weight:700;">× ${oi.quantity}</span>
                                            </div>
                                        `).join('')}
                                    </div>

                                    <!-- Note -->
                                    ${o.note ? `
                                        <div style="display:flex; gap:6px; padding:0.45rem 0.65rem; background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.18); border-radius:0.5rem; font-size:0.75rem; color:#fbbf24; align-items:flex-start;">
                                            <span class="material-symbols-outlined" style="font-size:14px; flex-shrink:0; margin-top:1px;">warning</span>
                                            <span>${o.note}</span>
                                        </div>
                                    ` : ''}

                                    <!-- Actions -->
                                    <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">

                                        ${o.status === 'SERVED' ? `
                                        <!-- SERVED: Pay Bill is the primary action -->
                                        <button class="trigger-checkout" data-id="${o.id}" style="
                                            flex:2; height:40px; background:linear-gradient(135deg,#10b981,#059669); color:white;
                                            border:none; border-radius:0.6rem; font-weight:800;
                                            font-size:0.78rem; text-transform:uppercase; cursor:pointer;
                                            display:flex; align-items:center; justify-content:center; gap:6px;
                                            box-shadow:0 4px 15px rgba(16,185,129,0.25); transition:all 0.2s;
                                            letter-spacing:0.08em;
                                        " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                                            <span class="material-symbols-outlined" style="font-size:17px;">receipt</span>
                                            Pay Bill
                                        </button>
                                        <button class="trigger-add-items" data-id="${o.id}" data-table="${o.tableId}" style="
                                            flex:1; height:40px; background:rgba(59,130,246,0.12); color:#60a5fa;
                                            border:1px solid rgba(59,130,246,0.2); border-radius:0.6rem;
                                            font-weight:700; font-size:0.7rem; text-transform:uppercase;
                                            cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px;
                                            transition:background 0.2s;
                                        " onmouseover="this.style.background='rgba(59,130,246,0.22)'" onmouseout="this.style.background='rgba(59,130,246,0.12)'">
                                            <span class="material-symbols-outlined" style="font-size:15px;">add_circle</span>
                                            Add Items
                                        </button>
                                        ` : `
                                        <!-- PREPARING / READY / RECEIVED: Add Items only -->
                                        <button class="trigger-add-items" data-id="${o.id}" data-table="${o.tableId}" style="
                                            flex:1; height:36px; background:rgba(59,130,246,0.15); color:#60a5fa;
                                            border:1px solid rgba(59,130,246,0.25); border-radius:0.6rem;
                                            font-weight:700; font-size:0.72rem; text-transform:uppercase;
                                            letter-spacing:0.08em; cursor:pointer; display:flex;
                                            align-items:center; justify-content:center; gap:5px;
                                            transition:background 0.2s;
                                        " onmouseover="this.style.background='rgba(59,130,246,0.25)'" onmouseout="this.style.background='rgba(59,130,246,0.15)'">
                                            <span class="material-symbols-outlined" style="font-size:15px;">add_circle</span>
                                            Add Items
                                        </button>
                                        `}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        </div>

    ` : '';

    // ── Reservations Preview ──
    const reservationsHtml = (role === UserRole.ADMIN || role === UserRole.WAITER) ? `
        <div style="${sectionCard}">
            <div style="${sectionHeader}">
                <span style="font-size:1.2rem;">🗓️</span>
                <h4 style="${sectionTitle}">Today's Reservations</h4>
                ${role === UserRole.ADMIN ? `<span style="font-size:0.6rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.1em; margin-left:auto;">Admin View</span>` : `<span style="font-size:0.6rem; font-weight:800; color:#3b82f6; text-transform:uppercase; letter-spacing:0.1em; margin-left:auto; background:rgba(59,130,246,0.1); padding:2px 8px; border-radius:4px;">Read-Only</span>`}
            </div>
            <div style="padding:1.5rem;">
                ${state.reservations.length === 0 ? `
                    <div style="text-align:center; padding:2rem 1rem;">
                        <p style="color:#94a3b8; font-size:0.88rem; font-weight:500;">No bookings recorded for today.</p>
                        ${role === UserRole.ADMIN ? `
                        <button onclick="document.querySelector('[data-view=reservations]')?.click()" style="
                            margin-top:1rem; background:none; border:none; cursor:pointer;
                            color:#10b981; font-size:0.7rem; font-weight:700; text-transform:uppercase;
                            letter-spacing:0.12em; display:inline-flex; align-items:center; gap:0.4rem;
                        ">
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                                <path clip-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" fill-rule="evenodd"/>
                            </svg>
                            Create New Reservation
                        </button>` : `<p style="font-size:0.72rem; color:#475569; margin-top:0.5rem;">Contact management to book a table.</p>`}
                    </div>
                ` : `
                    <div style="display:flex; flex-direction:column; gap:0.75rem;">
                        ${state.reservations.map(res => {
                            const initials = (res.customerId || '??').substring(0,2).toUpperCase();
                            return `
                            <div style="display:flex; align-items:center; justify-content:space-between; padding:1rem 1.25rem; background:rgba(15,23,42,0.4); border-radius:0.75rem; border:1px solid #1e3a5f;">
                                <div style="display:flex; align-items:center; gap:1rem;">
                                    <div style="width:40px; height:40px; border-radius:50%; background:#334155; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.72rem; color:#cbd5e1;">${initials}</div>
                                    <div>
                                        <div style="font-size:0.88rem; font-weight:700; color:#f1f5f9;">${res.customerId}</div>
                                        <div style="font-size:0.72rem; color:#94a3b8;">Table ${res.tableId} &bull; ${res.partySize} Guests</div>
                                    </div>
                                </div>
                                <div style="text-align:right;">
                                    <div style="font-size:0.9rem; font-weight:700; color:#10b981;">${res.reservationTime}</div>
                                    <div style="font-size:0.6rem; color:#94a3b8; text-transform:uppercase; font-weight:700; margin-top:2px;">Confirmed</div>
                                </div>
                            </div>
                        `}).join('')}
                    </div>
                `}
            </div>
        </div>
    ` : '';

    // ── Chef Station Dashboard ──
    const now = new Date();
    const shiftHour = now.getHours();
    const shiftLabel = shiftHour < 12 ? 'Morning Shift 🌅' : shiftHour < 17 ? 'Afternoon Shift ☀️' : 'Evening Shift 🌙';
    const preparingOrders = state.orders.filter(o => o.status === 'PREPARING' || o.status === 'RECEIVED');
    const readyOrders = state.orders.filter(o => o.status === 'READY');
    const todayServed = state.orders.filter(o => o.status === 'SERVED' || o.status === 'PAID');
    const menuCount = state.menu?.length || 0;

    // Avg ticket age (minutes)
    const avgAgeMin = preparingOrders.length
        ? Math.round(preparingOrders.reduce((s, o) => {
            const started = o.updatedAt ? new Date(o.updatedAt) : now;
            return s + (now - started) / 60000;
          }, 0) / preparingOrders.length)
        : 0;

    // Count total items across preparing orders
    const itemsCooking = preparingOrders.reduce((s, o) =>
        s + (o.orderItems || []).reduce((ss, i) => ss + i.quantity, 0), 0);

    const chefDashboard = role === UserRole.CHEF ? `
        <!-- Chef Greeting Banner -->
        <section style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
            <div>
                <div style="font-size:0.62rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:0.25rem;">${shiftLabel}</div>
                <h2 style="font-size:2rem; font-weight:900; color:white; margin:0 0 0.25rem;">
                    Ready to cook, <span style="color:#ec5b13;">${state.currentUser?.username || 'Chef'}</span>? 👨‍🍳
                </h2>
                <p style="font-size:0.82rem; color:#64748b; margin:0;">${preparingOrders.length > 0 ? `${preparingOrders.length} active ticket${preparingOrders.length > 1 ? 's' : ''} on the pass — let's go!` : 'No active tickets. Kitchen is clear.'}</p>
            </div>
            <button onclick="document.querySelector('[data-view=kitchen]')?.click()" style="
                background:linear-gradient(135deg,#ec5b13,#f97316); color:white; border:none;
                border-radius:1rem; padding:0.9rem 1.75rem; font-weight:800; font-size:0.9rem;
                cursor:pointer; display:flex; align-items:center; gap:0.6rem;
                box-shadow:0 8px 30px rgba(236,91,19,0.35); transition:transform 0.15s;
                text-transform:uppercase; letter-spacing:0.08em;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                <span class="material-symbols-outlined" style="font-size:20px;">restaurant</span>
                Open KDS
            </button>
        </section>

        <!-- Chef KPI Row -->
        <section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px,1fr)); gap:1rem; margin-bottom:2rem;">
            ${[
                { icon: 'soup_kitchen', label: 'Active Tickets', value: preparingOrders.length, color: '#f59e0b', glow: preparingOrders.length > 0 },
                { icon: 'check_circle', label: 'Ready to Serve', value: readyOrders.length, color: '#10b981', glow: readyOrders.length > 0 },
                { icon: 'timer', label: 'Avg Ticket Age', value: avgAgeMin > 0 ? avgAgeMin + 'm' : '—', color: avgAgeMin > 15 ? '#ef4444' : '#3b82f6', glow: false },
                { icon: 'skillet', label: 'Items Cooking', value: itemsCooking, color: '#ec5b13', glow: false },
                { icon: 'task_alt', label: 'Served Today', value: todayServed.length, color: '#a855f7', glow: false },
                { icon: 'menu_book', label: 'Menu Items', value: menuCount, color: '#64748b', glow: false },
            ].map(k => `
                <div class="card-glass" style="padding:1.25rem; display:flex; align-items:center; gap:0.85rem; ${k.glow ? `box-shadow:0 0 20px ${k.color}22;` : ''}">
                    <div style="width:42px; height:42px; border-radius:12px; background:${k.color}18; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <span class="material-symbols-outlined" style="font-size:22px; color:${k.color};">${k.icon}</span>
                    </div>
                    <div>
                        <div style="font-size:0.58rem; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:2px;">${k.label}</div>
                        <div style="font-size:1.5rem; font-weight:900; color:white;">${k.value}</div>
                    </div>
                </div>
            `).join('')}
        </section>

        <!-- Active Ticket Queue -->
        <div style="${sectionCard}">
            <div style="${sectionHeader}">
                <span class="material-symbols-outlined" style="font-size:18px; color:#ec5b13;">receipt_long</span>
                <h4 style="${sectionTitle}">Active Ticket Queue</h4>
                ${preparingOrders.length > 0 ? `<span style="margin-left:auto; font-size:0.65rem; font-weight:800; color:#ec5b13; background:rgba(236,91,19,0.1); padding:2px 8px; border-radius:4px; text-transform:uppercase;">${preparingOrders.length} in queue</span>` : ''}
            </div>
            <div style="padding:1.25rem; display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:1rem;">
                ${preparingOrders.length === 0 ? `
                    <div style="grid-column:1/-1; padding:3rem; text-align:center; opacity:0.4;">
                        <span class="material-symbols-outlined" style="font-size:3rem; display:block; margin-bottom:0.75rem; color:#64748b;">check_circle</span>
                        <p style="color:#64748b; font-size:0.88rem; font-weight:600;">All tickets cleared — kitchen is clean 🧼</p>
                    </div>
                ` : preparingOrders.map(o => {
                    const startTime = o.updatedAt ? new Date(o.updatedAt) : now;
                    const ageMin = Math.floor((now - startTime) / 60000);
                    const isHot = ageMin >= 12;
                    return `
                        <div style="background:${isHot ? 'rgba(239,68,68,0.07)' : 'rgba(0,0,0,0.25)'}; border:1px solid ${isHot ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}; border-radius:1rem; padding:1.25rem; position:relative; overflow:hidden;">
                            ${isHot ? `<div style="position:absolute; top:0; right:0; background:#ef4444; color:white; font-size:0.55rem; font-weight:900; padding:3px 8px; border-radius:0 1rem 0 0.5rem; text-transform:uppercase; letter-spacing:0.1em;">⚠ OVERDUE</div>` : ''}
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                                <div>
                                    <div style="font-size:0.95rem; font-weight:800; color:white;">Table ${o.tableId}</div>
                                    <div style="font-size:0.65rem; color:#64748b; font-weight:600; margin-top:2px;">
                                        ${ageMin > 0 ? `${ageMin}m on pass` : 'Just fired'}
                                    </div>
                                </div>
                                <div style="width:36px; height:36px; border-radius:50%; background:${isHot ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.1)'}; display:flex; align-items:center; justify-content:center;">
                                    <span class="material-symbols-outlined" style="font-size:18px; color:${isHot ? '#ef4444' : '#f59e0b'};">timer</span>
                                </div>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:0.4rem; margin-bottom:${o.note ? '0.75rem' : '0'};">
                                ${(o.orderItems || []).map(oi => `
                                    <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
                                        <span style="color:#e2e8f0; font-weight:600;">${oi.mealItem?.name || 'Item'}</span>
                                        <span style="color:#64748b; font-weight:800;">× ${oi.quantity}</span>
                                    </div>
                                `).join('')}
                            </div>
                            ${o.note ? `
                                <div style="padding:0.5rem 0.75rem; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); border-radius:0.5rem; font-size:0.75rem; color:#fbbf24; display:flex; gap:6px; align-items:flex-start;">
                                    <span class="material-symbols-outlined" style="font-size:14px; flex-shrink:0; margin-top:1px;">warning</span>
                                    <span>${o.note}</span>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    ` : '';

    // ── Status Footer Bar ──
    const footerBar = `
        <footer style="
            margin-top:2rem; padding:0.6rem 1rem;
            background:rgba(2,6,23,0.8); border-radius:0.6rem;
            border:1px solid #0f2744;
            display:flex; justify-content:space-between; align-items:center;
            font-size:0.6rem; font-weight:700; text-transform:uppercase;
            letter-spacing:0.15em; color:#334155;
        ">
            <div>System Status: Operational</div>
            <div style="display:flex; gap:1.5rem;">
                <span>DB: MongoDB</span>
                <span>Version 4.2.0-Stable</span>
            </div>
        </footer>
    `;

    return `
        <div class="view-content-wrapper fade-in">
            ${adminDashboard}
            ${waiterConsoleHtml}
            ${chefDashboard}
            ${reservationsHtml}
            ${footerBar}
        </div>
    `;
};



export const renderTables = (state) => {
    const role = state.currentUser?.role;
    const isAdmin = role === UserRole.ADMIN;

    const existingNums = state.tables.map(t => parseInt(t.id.replace(/\D/g, ''))).filter(n => !isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
    const nextId = `T${nextNum}`;

    // ── Stats ──
    const total    = state.tables.length;
    const occupied = state.tables.filter(t => t.status === 'OCCUPIED').length;
    const free     = state.tables.filter(t => t.status === 'FREE').length;
    const reserved = state.tables.filter(t => t.status === 'RESERVED').length;
    const occPct   = total ? Math.round((occupied / total) * 100) : 0;

    const statsRow = `
        <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:1rem; margin-bottom:2rem;">
            <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(236,91,19,0.1); border-radius:1rem; padding:1.25rem;">
                <p style="font-size:0.72rem; font-weight:600; color:#94a3b8; margin:0 0 0.4rem; text-transform:uppercase; letter-spacing:0.08em;">Total Tables</p>
                <h3 style="font-size:2rem; font-weight:900; color:#f1f5f9; margin:0;">${total}</h3>
            </div>
            <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(236,91,19,0.1); border-radius:1rem; padding:1.25rem;">
                <p style="font-size:0.72rem; font-weight:600; color:#94a3b8; margin:0 0 0.4rem; text-transform:uppercase; letter-spacing:0.08em;">Occupied</p>
                <div style="display:flex; align-items:center; gap:0.6rem;">
                    <h3 style="font-size:2rem; font-weight:900; color:#ec5b13; margin:0;">${occupied}</h3>
                    <span style="font-size:0.72rem; font-weight:700; padding:2px 8px; background:rgba(236,91,19,0.15); color:#ec5b13; border-radius:999px;">${occPct}%</span>
                </div>
            </div>
            <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(236,91,19,0.1); border-radius:1rem; padding:1.25rem;">
                <p style="font-size:0.72rem; font-weight:600; color:#94a3b8; margin:0 0 0.4rem; text-transform:uppercase; letter-spacing:0.08em;">Free</p>
                <h3 style="font-size:2rem; font-weight:900; color:#10b981; margin:0;">${free}</h3>
            </div>
            ${reserved > 0 ? `
            <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(236,91,19,0.1); border-radius:1rem; padding:1.25rem;">
                <p style="font-size:0.72rem; font-weight:600; color:#94a3b8; margin:0 0 0.4rem; text-transform:uppercase; letter-spacing:0.08em;">Reserved</p>
                <h3 style="font-size:2rem; font-weight:900; color:#f59e0b; margin:0;">${reserved}</h3>
            </div>` : ''}
        </div>
    `;

    // ── Filter tabs ──
    const tabs = [
        { id: 'all',      label: 'All Tables' },
        { id: 'FREE',     label: 'Free' },
        { id: 'OCCUPIED', label: 'Occupied' },
        { id: 'RESERVED', label: 'Reserved' },
    ];
    const filterTabs = `
        <div style="display:flex; gap:0; border-bottom:1px solid rgba(236,91,19,0.2); margin-bottom:1.5rem; overflow-x:auto;">
            ${tabs.map((tab, i) => `
                <button class="table-filter-tab" data-tab="${tab.id}" style="
                    padding:0.75rem 1.5rem; border:none; background:transparent; cursor:pointer;
                    font-size:0.8rem; font-weight:700; white-space:nowrap;
                    color:${i === 0 ? '#ec5b13' : '#94a3b8'};
                    border-bottom:2px solid ${i === 0 ? '#ec5b13' : 'transparent'};
                    transition: color 0.15s, border-color 0.15s;
                ">${tab.label}</button>
            `).join('')}
        </div>
    `;

    // ── Cards ──
    const cards = state.tables.map(table => {
        const activeOrder = state.orders.find(o => o.tableId === table.id && o.status !== 'PAID');
        const isOcc = table.status === 'OCCUPIED';
        const isRes = table.status === 'RESERVED';
        const isFre = table.status === 'FREE';

        const sBg    = isOcc ? '#ec5b13' : isRes ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)';
        const sColor = isOcc ? 'white'   : isRes ? '#f59e0b'               : '#10b981';
        const sLabel = isOcc ? 'Occupied': isRes ? 'Reserved'              : 'Free';
        const idBg   = isOcc ? 'rgba(236,91,19,0.2)' : 'rgba(255,255,255,0.05)';
        const idBrd  = isOcc ? '1px solid rgba(236,91,19,0.3)' : '1px solid rgba(255,255,255,0.06)';
        const idClr  = isOcc ? '#ec5b13' : '#f1f5f9';
        const cBrd   = isOcc ? 'rgba(236,91,19,0.4)' : 'rgba(255,255,255,0.06)';

        const info = isOcc ? `
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;color:#94a3b8;margin-bottom:0.4rem;">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                ${activeOrder ? 'Order #' + activeOrder.id.split('-')[1] : 'Occupied'}
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;color:#94a3b8;">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                ${table.capacity}/${table.capacity} Seats
            </div>` : isRes ? `
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;color:#94a3b8;margin-bottom:0.4rem;">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Reserved
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;color:#94a3b8;">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ${table.capacity} Seats
            </div>` : `
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;color:#94a3b8;margin-bottom:0.4rem;">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                ${table.capacity} Seats
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;color:#94a3b8;">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Available
            </div>`;

        const btn = isFre ? `
            <button class="interactive-table" data-id="${table.id}" style="
                width:100%;padding:0.65rem;background:rgba(236,91,19,0.12);color:#ec5b13;
                border:none;border-radius:0.75rem;font-size:0.78rem;font-weight:700;cursor:pointer;
                transition:background 0.2s,color 0.2s;"
                onmouseover="this.style.background='#ec5b13';this.style.color='white'"
                onmouseout="this.style.background='rgba(236,91,19,0.12)';this.style.color='#ec5b13'">Dine In</button>
        ` : isRes ? `
            <button class="interactive-table" data-id="${table.id}" style="
                width:100%;padding:0.65rem;border:1px solid rgba(245,158,11,0.3);color:#f59e0b;
                background:transparent;border-radius:0.75rem;font-size:0.78rem;font-weight:700;cursor:pointer;
                transition:background 0.2s;"
                onmouseover="this.style.background='rgba(245,158,11,0.1)'"
                onmouseout="this.style.background='transparent'">Check-in Guest</button>
        ` : `
            <button class="interactive-table" data-id="${table.id}" style="
                width:100%;padding:0.65rem;background:rgba(0,0,0,0.35);color:#f1f5f9;
                border:none;border-radius:0.75rem;font-size:0.78rem;font-weight:700;cursor:pointer;
                transition:background 0.2s;"
                onmouseover="this.style.background='rgba(0,0,0,0.55)'"
                onmouseout="this.style.background='rgba(0,0,0,0.35)'">Open Menu</button>`;

        return `
        <div class="table-card-new" data-status="${table.status}" style="
            background:rgba(0,0,0,0.28);border:1px solid ${cBrd};border-radius:1rem;padding:1.25rem;
            transition:box-shadow 0.2s,transform 0.2s;"
            onmouseover="this.style.boxShadow='0 8px 28px rgba(236,91,19,0.09)';this.style.transform='translateY(-2px)'"
            onmouseout="this.style.boxShadow='none';this.style.transform='none'">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;">
                <div style="background:${idBg};border:${idBrd};border-radius:0.65rem;padding:0.45rem 0.75rem;">
                    <span style="font-size:1.5rem;font-weight:900;color:${idClr};line-height:1;">${table.id}</span>
                </div>
                <span style="font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;
                    padding:4px 10px;border-radius:0.4rem;background:${sBg};color:${sColor};">${sLabel}</span>
            </div>
            <div style="margin-bottom:1.1rem;">${info}</div>
            ${btn}
        </div>`;
    }).join('');

    // ── Dashed add-table card ──
    const addPlaceholder = `
        <div id="toggle-add-table-card" style="
            background:rgba(0,0,0,0.12);border:2px dashed rgba(236,91,19,0.2);border-radius:1rem;
            padding:1.25rem;display:flex;flex-direction:column;align-items:center;justify-content:center;
            min-height:200px;cursor:pointer;transition:border-color 0.2s,background 0.2s;"
            onmouseover="this.style.borderColor='#ec5b13';this.style.background='rgba(236,91,19,0.05)'"
            onmouseout="this.style.borderColor='rgba(236,91,19,0.2)';this.style.background='rgba(0,0,0,0.12)'"
            onclick="document.getElementById('toggle-add-table')?.click()">
            <div style="width:48px;height:48px;border-radius:50%;background:rgba(236,91,19,0.1);
                display:flex;align-items:center;justify-content:center;margin-bottom:0.75rem;">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20" style="color:#ec5b13;">
                    <path clip-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" fill-rule="evenodd"/>
                </svg>
            </div>
            <span style="font-size:0.82rem;font-weight:700;color:#94a3b8;">Add New Table</span>
        </div>`;

    // ── Admin form panel ──
    const adminPanel = isAdmin ? `
        <div id="add-table-panel" style="display:none;background:rgba(0,0,0,0.35);border:1px solid #ec5b13;
            border-radius:1rem;padding:1.5rem;margin-bottom:1.5rem;">
            <h3 style="font-size:0.88rem;font-weight:800;color:#f1f5f9;text-transform:uppercase;
                letter-spacing:0.06em;margin:0 0 1.2rem;">Configure New Table</h3>
            <form id="add-table-form" style="display:grid;grid-template-columns:1fr 1fr auto;gap:1rem;align-items:end;">
                <div>
                    <label style="display:block;font-size:0.7rem;font-weight:700;color:#94a3b8;
                        text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.4rem;">Table ID</label>
                    <input type="text" id="new-table-id" class="payment-input" placeholder="e.g. T7" value="${nextId}" required>
                </div>
                <div>
                    <label style="display:block;font-size:0.7rem;font-weight:700;color:#94a3b8;
                        text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.4rem;">Seat Capacity</label>
                    <input type="number" id="new-table-capacity" class="payment-input" placeholder="4" min="1" max="20" value="4" required>
                </div>
                <div style="display:flex;gap:0.5rem;">
                    <button type="submit" style="background:#ec5b13;color:white;border:none;border-radius:0.65rem;
                        padding:0.65rem 1.1rem;font-weight:700;font-size:0.78rem;cursor:pointer;
                        white-space:nowrap;text-transform:uppercase;">Confirm</button>
                    <button type="button" id="cancel-add-table" style="background:rgba(255,255,255,0.06);
                        color:#94a3b8;border:1px solid rgba(255,255,255,0.1);border-radius:0.65rem;
                        padding:0.65rem 0.8rem;font-weight:700;cursor:pointer;">✕</button>
                </div>
            </form>
        </div>` : '';

    return `
    <div class="view-content-wrapper fade-in">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;">
            <div>
                <h2 style="font-size:1.75rem;font-weight:900;color:#f1f5f9;margin:0 0 0.2rem;letter-spacing:-0.02em;">Floor Management</h2>
                <p style="font-size:0.82rem;color:#64748b;margin:0;">Real-time table occupancy and status overview</p>
            </div>
            ${isAdmin ? `
            <button id="toggle-add-table" style="display:flex;align-items:center;gap:0.4rem;
                background:#ec5b13;color:white;border:none;border-radius:0.75rem;
                padding:0.7rem 1.4rem;font-weight:700;font-size:0.82rem;cursor:pointer;
                box-shadow:0 4px 16px rgba(236,91,19,0.3);transition:opacity 0.2s;"
                onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
                <svg width="17" height="17" fill="currentColor" viewBox="0 0 20 20">
                    <path clip-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" fill-rule="evenodd"/>
                </svg>
                Add Table
            </button>` : ''}
        </div>

        ${statsRow}
        ${filterTabs}
        ${adminPanel}

        <div id="tables-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:1.25rem;">
            ${cards}
            ${isAdmin ? addPlaceholder : ''}
        </div>
    </div>
    </div>`;
};



export const renderMenu = (state, tableId) => {


    const role = state.currentUser.role;
    const activeOrder = tableId ? state.orders.find(o => o.tableId === tableId && o.status !== 'PAID') : null;
    const isAdmin = role === UserRole.ADMIN;
    const isChef  = role === UserRole.CHEF;

    // ── Style tokens ──
    const cardBase = `
        position:relative; background:#1e1008; border-radius:1rem;
        display:flex; flex-direction:column; min-height:430px;
        border:1px solid rgba(255,255,255,0.06);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;

    // ── Header ──
    const cartCount  = activeOrder?.orderItems.reduce((a, b) => a + b.quantity, 0) || 0;
    const table      = state.tables.find(t => t.id === tableId);
    
    const header = `
        <header style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; gap:1.5rem; 
                        padding:1.5rem 3.5rem 1rem; border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0;">
            <div style="display:flex; align-items:center; gap:1rem;">
                <button onclick="navigateTo('tables')" style="padding:0.5rem; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; width:36px; height:36px;">
                    <span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span>
                </button>
                <div>
                    <h2 style="font-size:1.25rem; font-weight:800; color:white; margin:0; line-height:1.2;">
                        ${tableId ? `Table ${tableId} — Ordering` : 'Menu Catalog'}
                    </h2>
                    <p style="font-size:0.75rem; color:#94a3b8; margin:0; font-weight:500;">
                        ${tableId ? `Wait Time: 12 min • ${state.context.guestCount || table?.capacity || 4} Guests` : 'View and manage all restaurant items'}
                    </p>
                </div>
            </div>
            
            <div style="flex:1; max-width:400px; position:relative;">
                <span class="material-symbols-outlined" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#64748b; font-size:20px;">search</span>
                <input id="menu-search" type="text" placeholder="Quick search menu items..."
                    style="width:100%; padding:0.65rem 1rem 0.65rem 3rem; background:rgba(255,255,255,0.05); border:none; border-radius:0.75rem; 
                           color:white; font-size:0.85rem; outline:none; transition: all 0.2s;"
                    onfocus="this.style.background='rgba(255,255,255,0.08)'; this.style.boxShadow='0 0 0 2px rgba(236,91,19,0.3)'" 
                    onblur="this.style.background='rgba(255,255,255,0.05)'; this.style.boxShadow='none'"/>
            </div>

            <div style="display:flex; align-items:center; gap:0.75rem;">
                <button style="position:relative; padding:0.65rem; border-radius:12px; background:rgba(255,255,255,0.05); border:none; color:#94a3b8; cursor:pointer; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
                    <span class="material-symbols-outlined">notifications</span>
                    <span style="position:absolute; top:8px; right:8px; width:8px; height:8px; background:#ef4444; border-radius:50%; border:2px solid #1e1008;"></span>
                </button>
                <button style="padding:0.65rem; border-radius:12px; background:rgba(255,255,255,0.05); border:none; color:#94a3b8; cursor:pointer; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
                    <span class="material-symbols-outlined">settings</span>
                </button>
            </div>
        </header>
    `;

    // ── Category Filter Bar with Icons ──
    const getCatIcon = (cat) => {
        const c = cat.toLowerCase();
        if (c.includes('mains') || c.includes('course')) return 'dinner_dining';
        if (c.includes('starter') || c.includes('appetizer')) return 'restaurant';
        if (c.includes('desert') || c.includes('sweet')) return 'icecream';
        if (c.includes('drink') || c.includes('beverage')) return 'local_bar';
        return 'grid_view';
    };

    const filterBar = `
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; overflow-x:auto; padding:0.75rem 2.5rem; scrollbar-width:none; flex-shrink:0;" class="custom-scrollbar">
            <button class="cat-pill active-pill" data-cat="all" style="
                display:flex; align-items:center; gap:0.5rem; padding:0.6rem 1.25rem; border-radius:1rem; border:none; cursor:pointer;
                background:#ec5b13; color:white; font-size:0.85rem; font-weight:700; white-space:nowrap; box-shadow:0 4px 12px rgba(236,91,19,0.3);
                min-height:40px;
            ">
                <span class="material-symbols-outlined" style="font-size:18px;">grid_view</span> All Items
            </button>
            ${[...new Set(state.menu.map(m => m.category))].map(cat => `
                <button class="cat-pill" data-cat="${cat}" style="
                    display:flex; align-items:center; gap:0.5rem; padding:0.6rem 1.25rem; border-radius:1rem; 
                    border:1px solid rgba(255,255,255,0.1); cursor:pointer; font-size:0.85rem; font-weight:600; 
                    background:rgba(255,255,255,0.08); color:#94a3b8; white-space:nowrap; transition: all 0.2s;
                    min-height:40px;
                ">
                    <span class="material-symbols-outlined" style="font-size:20px;">${getCatIcon(cat)}</span> ${cat}
                </button>
            `).join('')}
        </div>
    `;

    // ── Admin add-item form ──
    const adminForm = isAdmin ? `
        <div id="add-menu-form-container" style="display:none; margin-bottom:2rem; background:#2c1d15; border:1px solid #ec5b13; border-radius:0.75rem; padding:1.75rem;">
            <h3 style="font-size:1rem; font-weight:800; color:#f1f5f9; margin:0 0 1.25rem; text-transform:uppercase; letter-spacing:0.05em;">Create New Menu Item</h3>
            <form id="add-menu-item-form" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <input type="text"   name="name"        class="payment-input" placeholder="Dish Name" required>
                <input type="number" step="0.01" name="price" class="payment-input" placeholder="Price ($)" required>
                <input type="text"   name="category"    class="payment-input" placeholder="Category (e.g. Mains, Desserts)" required>
                <input type="text"   name="image"       class="payment-input" placeholder="Image URL">
                <textarea name="description" class="payment-input" style="grid-column:span 2; height:70px; resize:vertical;" placeholder="Description..." required></textarea>
                <div style="grid-column:span 2; display:flex; gap:0.75rem;">
                    <button type="submit" style="
                        background:#ec5b13; color:white; border:none; border-radius:0.6rem;
                        padding:0.65rem 1.4rem; font-weight:700; font-size:0.82rem; cursor:pointer;
                    ">ADD TO CATALOG</button>
                    <button type="button" id="cancel-add-menu" style="
                        background:rgba(255,255,255,0.07); color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:0.6rem;
                        padding:0.65rem 1.4rem; font-weight:700; font-size:0.82rem; cursor:pointer;
                    ">CANCEL</button>
                </div>
            </form>
        </div>
    ` : '';

    // ── Menu cards (waiter ordering view: shows + button only; other views show full controls) ──
    const cards = state.menu.map(item => {
        const orderItem = activeOrder?.orderItems.find(oi => oi.mealItem.id === item.id);
        const qty = orderItem ? orderItem.quantity : 0;
        const available = item.isAvailable !== false;

        const stockOverlay = !available ? `
            <div style="position:absolute; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:2;">
                <span style="background:#ef4444; color:white; font-size:0.6rem; font-weight:900; text-transform:uppercase;
                             padding:4px 12px; border-radius:999px; letter-spacing:0.15em; box-shadow:0 2px 8px rgba(0,0,0,0.4);">Out of Stock</span>
            </div>
        ` : '';

        // ── Toggle switch (Admin & Chef see this on the left of footer) ──
        const toggleSwitch = `
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                <div style="position:relative; width:36px; height:20px;">
                    <input type="checkbox" ${available ? 'checked' : ''} style="opacity:0; width:0; height:0; position:absolute;"
                        class="toggle-availability" data-id="${item.id}">
                    <div style="position:absolute; inset:0; border-radius:999px;
                        background:${available ? '#10b981' : '#334155'}; transition: background 0.2s;"></div>
                    <div style="position:absolute; top:2px; left:${available ? '18px' : '2px'}; width:16px; height:16px;
                        background:white; border-radius:50%; transition: left 0.2s; pointer-events:none;"></div>
                </div>
                <span style="font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em;
                             color:${available ? '#10b981' : '#94a3b8'}; white-space:nowrap;">
                    ${available ? 'Available' : 'Unavailable'}
                </span>
            </label>
        `;

        // ── Qty stepper (Waiter ordering / Admin ordering) ──
        const qtyControls = `
            <div style="display:flex; align-items:center; background:rgba(255,255,255,0.05);
                border:1px solid rgba(255,255,255,0.08); border-radius:0.6rem; overflow:hidden;">
                <button class="qty-btn minus" data-id="${item.id}" style="
                    width:30px; height:30px; background:transparent; border:none; color:#94a3b8;
                    font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center;
                " onmouseover="this.style.color='#ec5b13'" onmouseout="this.style.color='#94a3b8'">−</button>
                <span class="qty-val" data-id="${item.id}" style="
                    min-width:26px; text-align:center; font-weight:800; font-size:0.88rem; color:#f1f5f9;">${qty}</span>
                <button class="qty-btn plus" data-id="${item.id}" style="
                    width:30px; height:30px; background:transparent; border:none; color:#94a3b8;
                    font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center;
                " onmouseover="this.style.color='#ec5b13'" onmouseout="this.style.color='#94a3b8'">+</button>
            </div>
        `;

        // ── Footer logic per role ──
        // In waiter ordering mode: show a big circular + add button (qty handled in right panel)
        // Admin (catalog): toggle switch only
        // Admin (ordering): toggle + qty stepper
        // Chef: toggle only
        let footerLeft, footerRight;
        const isWaiterOrdering = !!tableId;
        if (isWaiterOrdering) {
            // waiter ordering: card footer = category tag + add button
            footerLeft  = `<span style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;background:rgba(236,91,19,0.12);color:#ec5b13;padding:3px 10px;border-radius:999px;">${item.category}</span>`;
            footerRight = available ? `
                <button class="menu-add-btn" data-id="${item.id}" style="
                    width:36px;height:36px;border-radius:0.75rem;border:none;cursor:pointer;
                    background:#ec5b13;color:white;display:flex;align-items:center;justify-content:center;
                    box-shadow:0 2px 10px rgba(236,91,19,0.4);transition:transform 0.15s,opacity 0.15s;
                " onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path clip-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" fill-rule="evenodd"/></svg>
                </button>` : `<span style="font-size:0.65rem;color:#ef4444;font-weight:700;">Unavailable</span>`;
        } else if (isAdmin) {
            footerLeft  = toggleSwitch;
            footerRight = (tableId && available) ? qtyControls : '';
        } else if (isChef) {
            footerLeft  = toggleSwitch;
            footerRight = '';
        } else {
            footerLeft  = `<span style="font-size:0.7rem; color:#475569; font-style:italic;">Catalog Mode</span>`;
            footerRight = '';
        }

        // ── Admin edit icon — floats in image area, top-left below qty badge ──
        const editIcon = isAdmin ? `
            <button title="Edit item" style="
                position:absolute; bottom:8px; right:8px; z-index:4;
                width:28px; height:28px; border-radius:0.4rem;
                background:rgba(0,0,0,0.55); backdrop-filter:blur(6px);
                border:1px solid rgba(255,255,255,0.1); cursor:pointer;
                color:#94a3b8; display:flex; align-items:center; justify-content:center;
                transition: background 0.15s, color 0.15s;
            " onmouseover="this.style.background='rgba(236,91,19,0.8)'; this.style.color='white'"
               onmouseout="this.style.background='rgba(0,0,0,0.55)'; this.style.color='#94a3b8'">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        ` : '';

        return `
            <div class="menu-card-new group" data-item-id="${item.id}" data-category="${item.category}" style="${cardBase}">
                <!-- Image area -->
                <div style="position:relative; height:180px; overflow:hidden; ${!available ? 'filter:grayscale(0.5); opacity:0.7;' : ''}">
                    <!-- Price Tag Top Left -->
                    <div style="position:absolute; top:12px; left:12px; z-index:3;
                        background:rgba(255,255,255,0.9); backdrop-filter:blur(8px);
                        padding:4px 10px; border-radius:0.5rem; color:#ec5b13;
                        font-weight:800; font-size:0.85rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                        $${item.price.toFixed(2)}
                    </div>

                    <img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;
                        transition: transform 0.6s ease;" class="menu-hero-img">
                    

                    ${stockOverlay}
                    ${editIcon}
                </div>

                <!-- Content -->
                <div style="padding:1.5rem; flex:1; display:flex; flex-direction:column;">
                    <h3 style="font-size:1.1rem; font-weight:800; color:white; margin:0 0 0.25rem; line-height:1.2;">${item.name}</h3>
                    <p style="font-size:0.75rem; color:#94a3b8; margin:0 0 1rem; line-height:1.4;
                        display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                        ${item.description}
                    </p>

                    <!-- Footer row -->
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-top:auto; padding-top:1rem;">
                        <span style="font-size:0.65rem; font-weight:900; text-transform:uppercase; letter-spacing:0.1em; background:rgba(236,91,19,0.1); color:#ec5b13; padding:4px 10px; border-radius:0.5rem; white-space:nowrap;">
                            ${item.category}
                        </span>
                        
                        <div style="display:flex; gap:0.5rem; align-items:center;">
                            ${tableId ? (
                                (item.isAvailable !== false) ? `
                                    <button class="menu-add-btn" data-id="${item.id}" style="
                                        width:42px; height:42px; border-radius:0.75rem; border:none; cursor:pointer;
                                        background:#ec5b13; color:white; display:flex; align-items:center; justify-content:center;
                                        box-shadow:0 6px 15px rgba(236,91,19,0.3); transition: all 0.2s;"
                                        onmouseover="this.style.transform='scale(1.1)'; this.style.background='#ff7b39'" 
                                        onmouseout="this.style.transform='scale(1)'; this.style.background='#ec5b13'">
                                        <span class="material-symbols-outlined" style="font-size:24px; font-variation-settings:'FILL' 1;">add</span>
                                    </button>
                                ` : `<span style="font-size:0.7rem; color:#ef4444; font-weight:800; background:rgba(239,68,68,0.1); padding:4px 8px; border-radius:4px;">SOLD OUT</span>`
                            ) : `
                                <div style="flex-shrink:0;">${footerLeft}</div>
                                ${footerRight ? `<div style="flex-shrink:0; margin-left:8px;">${footerRight}</div>` : ''}
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // ── Add New Dish placeholder card ──
    const addCard = isAdmin ? `
        <button id="add-dish-card" onclick="document.getElementById('add-menu-item-toggle')?.click()" style="
            display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem;
            min-height:340px; border:2px dashed rgba(255,255,255,0.1); border-radius:0.75rem;
            background:rgba(255,255,255,0.02); cursor:pointer;
            transition: border-color 0.2s, background 0.2s;
        " onmouseover="this.style.borderColor='rgba(236,91,19,0.4)'; this.style.background='rgba(236,91,19,0.04)'"
           onmouseout="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.02)'">
            <div style="width:56px; height:56px; border-radius:50%; background:rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:center; transition: background 0.2s;">
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 20 20" style="color:#ec5b13;">
                    <path clip-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" fill-rule="evenodd"/>
                </svg>
            </div>
            <div style="text-align:center;">
                <p style="font-weight:700; color:#f1f5f9; margin:0 0 0.25rem; font-size:0.9rem;">Add New Dish</p>
                <p style="font-size:0.72rem; color:#64748b; margin:0;">Click to open the form</p>
            </div>
        </button>
    ` : '';

    // ── Order Summary Panel (waiter ordering mode) ──
    const orderItems = activeOrder?.orderItems || [];
    const subtotal = orderItems.reduce((sum, oi) => sum + oi.mealItem.price * oi.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    const tableData = state.tables.find(t => t.id === tableId);

    const orderPanel = tableId ? `
        <aside class="receipt-zigzag" style="width:400px; min-width:400px; background:#1e1008; border-left:1px solid rgba(236,91,19,0.15); display:flex; flex-direction:column; flex-shrink:0; box-shadow:-10px 0 30px rgba(0,0,0,0.5);">
            <!-- Panel header -->
            <div style="padding:1.5rem; border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <h2 style="font-size:1.5rem; font-weight:800; color:white; margin:0;">Order Summary</h2>
                    <span style="font-size:0.65rem; font-weight:800; padding:4px 10px; 
                        background:${activeOrder?.status === 'PREPARING' ? 'rgba(245,158,11,0.15)' : activeOrder?.status === 'READY' ? 'rgba(16,185,129,0.15)' : 'rgba(236,91,19,0.15)'}; 
                        color:${activeOrder?.status === 'PREPARING' ? '#f59e0b' : activeOrder?.status === 'READY' ? '#10b981' : '#ec5b13'}; 
                        border-radius:999px; text-transform:uppercase; tracking:0.1em;">
                        ${activeOrder?.status === 'PREPARING' ? '🔥 In Kitchen' : activeOrder?.status === 'READY' ? '✓ Ready' : 'Current Order'}
                    </span>
                </div>
                <div style="display:flex; gap:0.75rem;">
                    <div style="flex:1; padding:1rem; border-radius:1rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);">
                        <p style="font-size:0.65rem; color:#64748b; text-transform:uppercase; font-weight:800; tracking:0.1em; margin:0 0 0.5rem;">Guests</p>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <p style="font-size:1.5rem; font-weight:900; color:white; margin:0;">${state.context.guestCount || tableData?.capacity || 4}</p>
                            <div style="display:flex; gap:0.4rem;">
                                <button class="guest-btn minus h-6 w-6 rounded flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-primary transition-all cursor-pointer">
                                    <span class="material-symbols-outlined" style="font-size:16px;">remove</span>
                                </button>
                                <button class="guest-btn plus h-6 w-6 rounded flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-primary transition-all cursor-pointer">
                                    <span class="material-symbols-outlined" style="font-size:16px;">add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style="flex:1; padding:1rem; border-radius:1rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);">
                        <p style="font-size:0.65rem; color:#64748b; text-transform:uppercase; font-weight:800; tracking:0.1em; margin:0 0 0.5rem;">Table</p>
                        <p style="font-size:1.5rem; font-weight:900; color:#ec5b13; margin:0;">${tableId}</p>
                    </div>
                </div>
            </div>

            <!-- Items list -->
            <div id="order-items-list" style="flex:1; overflow-y:auto; padding:1.5rem; display:flex; flex-direction:column; gap:1.25rem;" class="custom-scrollbar">
                ${orderItems.length === 0 ? `
                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; opacity:0.3; text-align:center;">
                        <span class="material-symbols-outlined" style="font-size:4rem; color:#94a3b8; margin-bottom:1rem;">receipt_long</span>
                        <p style="font-size:0.9rem; font-weight:600; color:#94a3b8;">Add items to start order</p>
                    </div>
                ` : orderItems.map(oi => `
                    <div style="display:flex; align-items:center; gap:1rem; position:relative;" class="group">
                        <img src="${oi.mealItem.image}" alt="${oi.mealItem.name}" 
                             style="width:64px; height:64px; border-radius:1rem; object-fit:cover; border:1px solid rgba(255,255,255,0.1); shrink:0;">
                        <div style="flex:1; min-width:0;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <h4 style="font-size:0.95rem; font-weight:800; color:white; margin:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; padding-right:8px;">${oi.mealItem.name}</h4>
                                <p style="font-size:1rem; font-weight:800; color:white; margin:0;">$${(oi.mealItem.price * oi.quantity).toFixed(2)}</p>
                            </div>
                            <p style="font-size:0.7rem; color:#64748b; margin:2px 0 8px;">Standard Prep</p>
                            <div style="display:flex; align-items:center; gap:0.75rem;">
                                <div style="display:flex; align-items:center; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); rounded:0.5rem; overflow:hidden;">
                                    <button class="qty-btn minus" data-id="${oi.mealItem.id}" style="width:28px; height:28px; background:none; border:none; color:#94a3b8; cursor:pointer;" onmouseover="this.style.color='#ec5b13'" onmouseout="this.style.color='#94a3b8'">
                                        <span class="material-symbols-outlined" style="font-size:18px;">remove</span>
                                    </button>
                                    <span class="qty-val" data-id="${oi.mealItem.id}" style="min-width:28px; text-align:center; font-size:0.85rem; font-weight:800; color:white;">${oi.quantity}</span>
                                    <button class="qty-btn plus" data-id="${oi.mealItem.id}" style="width:28px; height:28px; background:none; border:none; color:#94a3b8; cursor:pointer;" onmouseover="this.style.color='#ec5b13'" onmouseout="this.style.color='#94a3b8'">
                                        <span class="material-symbols-outlined" style="font-size:18px;">add</span>
                                    </button>
                                </div>
                                <button class="qty-btn" data-id="${oi.mealItem.id}" data-remove="true" style="font-size:0.75rem; font-weight:800; color:#ef4444; background:none; border:none; cursor:pointer; padding:0;">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Footer Totals -->
            <div style="padding:0.75rem 1rem 1rem; background:rgba(0,0,0,0.2); border-top:1px solid rgba(255,255,255,0.06); gap:0.35rem; display:flex; flex-direction:column; flex-shrink:0;">
                <div style="display:flex; justify-content:space-between; font-size:0.78rem;">
                    <span style="color:#94a3b8; font-weight:500;">Subtotal</span>
                    <span style="color:white; font-weight:700;">$${subtotal.toFixed(2)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.78rem;">
                    <span style="color:#94a3b8; font-weight:500;">Tax (8%)</span>
                    <span style="color:white; font-weight:700;">$${tax.toFixed(2)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding-top:0.4rem; border-top:1px solid rgba(255,255,255,0.06); font-size:1rem;">
                    <span style="color:white; font-weight:800;">Total</span>
                    <span style="color:#ec5b13; font-weight:900;">$${total.toFixed(2)}</span>
                </div>

                <!-- Order Notes -->
                <div style="margin-top:0.4rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:0.6rem; padding:0.5rem 0.65rem;">
                    <label style="font-size:0.55rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.1em; display:block; margin-bottom:0.25rem;">
                        <span class="material-symbols-outlined" style="font-size:12px; vertical-align:middle; margin-right:3px;">edit_note</span>Kitchen Notes
                    </label>
                    <textarea id="order-notes" rows="1" placeholder="e.g. No onions, allergens…" style="
                        width:100%; background:transparent; border:none; color:#e2e8f0; font-size:0.75rem;
                        resize:none; outline:none; font-family:'Inter',sans-serif; line-height:1.4;
                    ">${state.context?.orderNote || ''}</textarea>
                </div>

                <button id="send-to-kitchen" style="
                    width:100%; margin-top:0.5rem; padding:0.65rem;
                    background:${activeOrder?.status === 'PREPARING' ? '#d97706' : activeOrder?.status === 'READY' ? '#059669' : '#ec5b13'};
                    color:white; border:none; border-radius:0.75rem;
                    font-size:0.82rem; font-weight:900; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem;
                    box-shadow:0 6px 18px rgba(236,91,19,0.25); transition:all 0.2s; letter-spacing:0.01em;"
                    onmouseover="this.style.transform='translateY(-1px)'; this.style.opacity='0.9'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.opacity='1'">
                    <span class="material-symbols-outlined" style="font-size:16px;">${activeOrder?.status === 'PREPARING' || activeOrder?.status === 'READY' ? 'add_circle' : 'send'}</span>
                    ${activeOrder?.status === 'PREPARING' || activeOrder?.status === 'READY' ? 'Send Additional Items' : 'Place Order'}
                </button>

                <div style="display:flex; gap:0.4rem; margin-top:0.3rem;">
                    <button style="flex:1; padding:0.4rem; border:1px solid rgba(255,255,255,0.05); border-radius:0.5rem; font-size:0.65rem; font-weight:700; color:#64748b; background:transparent; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">Split Bill</button>
                    <button style="flex:1; padding:0.4rem; border:1px solid rgba(255,255,255,0.05); border-radius:0.5rem; font-size:0.65rem; font-weight:700; color:#64748b; background:transparent; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">Print Preview</button>
                </div>
            </div>
        </aside>
    ` : '';

    // ── Layout ──
    if (tableId) {
        return `
        <div class="fade-in" style="display:flex; height:100%; margin:0; background:transparent; overflow:hidden;">
            <!-- Left: Main Content Scrollable Area -->
            <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
                ${header}
                ${filterBar}
                <div id="menu-grid" style="flex:1; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:2rem; padding:0 3.5rem 3rem; align-content:start;" class="custom-scrollbar">
                    ${cards}
                </div>
            </div>
            ${orderPanel}
        </div>`;
    }

    // ── Catalog / Admin / Chef view ──
    return `
    <div class="view-content-wrapper fade-in">
        ${header}
        ${filterBar}
        ${adminForm}
        <div id="menu-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:1.25rem; padding-bottom:2.5rem;">
            ${state.menu.length === 0 ? `
                <div style="grid-column:1/-1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:6rem 2rem; text-align:center; border:1px dashed rgba(255,255,255,0.07); border-radius:1.5rem; gap:1rem;">
                    <div style="width:72px; height:72px; border-radius:50%; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center;">
                        <span class="material-symbols-outlined" style="font-size:2.5rem; color:#475569;">menu_book</span>
                    </div>
                    <div>
                        <p style="font-weight:800; color:#e2e8f0; margin:0 0 0.4rem;">No Menu Items Yet</p>
                        <p style="font-size:0.82rem; color:#64748b; margin:0; max-width:280px;">The catalog is empty. An Admin can add dishes using the form above.</p>
                    </div>
                </div>
            ` : cards}
            ${addCard}
        </div>
    </div>
    `;
};



export const renderKitchen = (state) => {
    const role = state.currentUser.role;
    const isWaiter = role === UserRole.WAITER;

    // ── Timer Helpers ──
    const getTimeElapsed = (timestamp) => {
        if (!timestamp) return '00:00';
        const start = new Date(timestamp);
        const now = new Date();
        const diff = Math.max(0, Math.floor((now - start) / 1000));
        const mins = Math.floor(diff / 60);
        const secs = diff % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateAvgLeadTime = (orders) => {
        const closedOrders = orders.filter(o => ['READY', 'SERVED', 'PAID'].includes(o.status));
        if (closedOrders.length === 0) return '14m';
        const totalLeadTime = closedOrders.reduce((sum, o) => {
            const start = new Date(o.createdAt);
            const end = o.paidAt ? new Date(o.paidAt) : new Date(o.updatedAt || o.createdAt);
            return sum + (end - start);
        }, 0);
        const avgMs = totalLeadTime / closedOrders.length;
        const mins = Math.round(avgMs / 60000);
        return `${mins <= 0 ? 1 : mins}m`;
    };

    // ── Stats Calculation ──
    const activeOrders = state.orders.filter(o => o.status !== 'PAID' && o.status !== 'SERVED');
    const pendingCount = activeOrders.filter(o => o.status === 'RECEIVED').length;
    const avgLeadTime  = calculateAvgLeadTime(state.orders);

    const kitchenStats = `
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:1.5rem; margin-bottom:3rem;">
            <!-- Active Tickets -->
            <div class="card-glass" style="padding:1.25rem 1.75rem; display:flex; align-items:center; gap:1.25rem; position:relative; overflow:hidden;">
                <div style="position:absolute; right:0; top:0; height:100%; width:4px; background:#f97316;"></div>
                <div style="width:48px; height:48px; border-radius:12px; background:rgba(249,115,22,0.1); color:#f97316; display:flex; align-items:center; justify-content:center;">
                    <span class="material-symbols-outlined" style="font-size:24px;">receipt_long</span>
                </div>
                <div>
                    <p style="font-[10px]; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#94a3b8; margin:0 0 4px;">Active Tickets</p>
                    <div style="display:flex; align-items:baseline; gap:8px;">
                        <span id="stat-active-tickets" style="font-size:1.75rem; font-weight:900; color:white;">${activeOrders.length}</span>
                        <span style="font-size:0.7rem; font-weight:700; color:#ef4444; background:rgba(239,68,68,0.1); padding:2px 6px; border-radius:4px;">+2 NEW</span>
                    </div>
                </div>
            </div>

            <!-- Pending Items -->
            <div class="card-glass" style="padding:1.25rem 1.75rem; display:flex; align-items:center; gap:1.25rem; position:relative; overflow:hidden;">
                <div style="position:absolute; right:0; top:0; height:100%; width:4px; background:#3b82f6;"></div>
                <div style="width:48px; height:48px; border-radius:12px; background:rgba(59,130,246,0.1); color:#3b82f6; display:flex; align-items:center; justify-content:center;">
                    <span class="material-symbols-outlined" style="font-size:24px;">hourglass_top</span>
                </div>
                <div>
                    <p style="font-[10px]; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#94a3b8; margin:0 0 4px;">Pending Queue</p>
                    <div style="display:flex; align-items:baseline; gap:8px;">
                        <span id="stat-pending-queue" style="font-size:1.75rem; font-weight:900; color:white;">${pendingCount}</span>
                        <span style="font-size:0.7rem; font-weight:700; color:#94a3b8; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">STABLE</span>
                    </div>
                </div>
            </div>

            <!-- Lead Time -->
            <div class="card-glass" style="padding:1.25rem 1.75rem; display:flex; align-items:center; gap:1.25rem; position:relative; overflow:hidden;">
                <div style="position:absolute; right:0; top:0; height:100%; width:4px; background:#10b981;"></div>
                <div style="width:48px; height:48px; border-radius:12px; background:rgba(16,185,129,0.1); color:#10b981; display:flex; align-items:center; justify-content:center;">
                    <span class="material-symbols-outlined" style="font-size:24px;">schedule</span>
                </div>
                <div>
                    <p style="font-[10px]; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:#94a3b8; margin:0 0 4px;">Avg. Lead Time</p>
                    <div style="display:flex; align-items:baseline; gap:8px;">
                        <span id="stat-avg-lead-time" style="font-size:1.75rem; font-weight:900; color:white;">${avgLeadTime}</span>
                        <span style="font-size:0.7rem; font-weight:700; color:#10b981; background:rgba(16,185,129,0.1); padding:2px 6px; border-radius:4px;">OPTIMIZED</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (isWaiter) {
        return `
            <div class="view-content-wrapper fade-in" style="height:100%; overflow-y:auto;">
                ${kitchenStats}
                <div style="margin-bottom:2rem; display:flex; align-items:center; gap:1rem;">
                    <h3 style="font-size:1.25rem; font-weight:800; color:white; margin:0;">Pickup Center</h3>
                    <span style="padding:4px 12px; background:rgba(59,130,246,0.1); color:#3b82f6; border-radius:999px; font-size:0.65rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">Waiter Notification</span>
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap:1.5rem; padding-bottom:4rem;">
                    ${state.orders.filter(o => o.status === 'READY').map(order => `
                        <div class="card-glass" style="padding:0; border-radius:1.25rem; overflow:hidden; border-top: 5px solid #3b82f6;">
                            <div style="padding:1.5rem; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05);">
                                <div>
                                    <span style="font-weight:900; font-size:1.3rem; color:white; display:block;">TABLE ${order.tableId}</span>
                                    <span style="font-size:0.7rem; color:#64748b; font-family:monospace;">ORDER #${order.id.split('-')[1]}</span>
                                </div>
                                <span style="background:#3b82f6; color:white; padding:4px 12px; border-radius:8px; font-size:0.75rem; font-weight:800;">READY</span>
                            </div>
                            <div style="padding:1.5rem;">
                                <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
                                    ${order.orderItems.map(item => `
                                        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.03);">
                                            <div style="display:flex; align-items:center; gap:10px;">
                                                <div style="width:24px; height:24px; border-radius:6px; background:rgba(255,255,255,0.05); color:white; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.8rem;">${item.quantity}</div>
                                                <span style="font-size:0.95rem; font-weight:500; color:#e2e8f0;">${item.mealItem.name}</span>
                                            </div>
                                            <span style="font-size:0.65rem; font-weight:700; color:#94a3b8; text-transform:uppercase; opacity:0.6;">${item.mealItem.category}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                <button class="mark-served" data-id="${order.id}" style="width:100%; height:52px; background:#3b82f6; color:white; border:none; border-radius:12px; font-weight:800; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.2s;" onmouseover="this.style.background='#2563eb'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#3b82f6'; this.style.transform='translateY(0)'">
                                    <span class="material-symbols-outlined">done_all</span>
                                    Deliver to Table
                                </button>
                            </div>
                        </div>
                    `).join('') || `
                        <div style="grid-column: 1/-1; padding:6rem; text-align:center; border:2px dashed rgba(255,255,255,0.05); border-radius:1.5rem; opacity:0.4;">
                            <span class="material-symbols-outlined" style="font-size:3rem; margin-bottom:1rem; display:block;">notifications_off</span>
                            <p style="font-size:0.9rem;">No orders currently awaiting pickup.</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    return `
    <div class="view-content-wrapper fade-in" style="height:100%; overflow-y:auto;">
        ${kitchenStats}
        <div style="margin-bottom:2rem;">
            <h3 style="font-size:1.25rem; font-weight:800; color:white; margin:0;">Kitchen Tickets</h3>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap:2rem; padding-bottom:4rem;">
            ${activeOrders.map(order => {
                let statusColor = '#94a3b8'; // RECEIVED
                let leftBorder  = '#3b82f6'; // blue for sync
                let actionBtn   = '';

                if (order.status === 'RECEIVED') {
                    statusColor = '#3b82f6';
                    leftBorder  = '#3b82f6';
                    actionBtn = `<button class="mark-preparing" data-id="${order.id}" style="width:100%; height:52px; background:#3b82f6; color:white; border:none; border-radius:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; font-size:0.8rem;">
                                    <span class="material-symbols-outlined">play_arrow</span> Start Cooking
                                 </button>`;
                } else if (order.status === 'PREPARING') {
                    statusColor = '#f97316';
                    leftBorder  = '#f97316';
                    actionBtn = `<button class="mark-ready" data-id="${order.id}" style="width:100%; height:52px; background:#1e293b; color:white; border:1px solid #334155; border-radius:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; font-size:0.8rem;" onmouseover="this.style.background='rgba(16,185,129,0.1)'; this.style.borderColor='#10b981'; this.style.color='#10b981'" onmouseout="this.style.background='#1e293b'; this.style.borderColor='#334155'; this.style.color='white'">
                                    <span class="material-symbols-outlined icon-filled">check_circle</span> Mark as Ready
                                 </button>`;
                } else if (order.status === 'READY') {
                    statusColor = '#10b981';
                    leftBorder  = '#10b981';
                    actionBtn = `<div style="text-align:center; padding:1rem; background:rgba(16,185,129,0.05); border-radius:12px; border:1px dashed rgba(16,185,129,0.2);">
                                    <span style="font-size:0.75rem; font-weight:800; color:#10b981; text-transform:uppercase;">Waiting for Pickup</span>
                                 </div>`;
                }

                return `
                    <div class="card-glass" style="padding:0; border-radius:1.5rem; overflow:hidden; position:relative; border-top:1px solid rgba(255,255,255,0.05);">
                        <div style="position:absolute; left:0; top:0; bottom:0; width:6px; background:${leftBorder}; box-shadow:0 0 15px ${leftBorder}80; z-index:10;"></div>
                        
                        <!-- Card Header -->
                        <div style="padding:1.25rem 1.25rem 1.25rem 2rem; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05);">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <h3 style="font-size:1.4rem; font-weight:900; color:white; margin:0; letter-spacing:-0.01em;">TABLE ${order.tableId}</h3>
                                <span style="font-family:monospace; font-size:0.7rem; color:#64748b; background:rgba(255,255,255,0.05); padding:2px 8px; border-radius:4px;">#${order.id.split('-')[1]}</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px; background:rgba(0,0,0,0.3); padding:4px 10px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
                                <span class="material-symbols-outlined" style="font-size:16px; color:${statusColor}; ${order.status === 'PREPARING' ? 'animation: pulse 1.5s infinite;' : ''}">timer</span>
                                <span class="order-timer" data-start="${order.createdAt}" style="font-family:monospace; font-weight:800; font-size:0.85rem; color:#e2e8f0;">${getTimeElapsed(order.createdAt)}</span>
                            </div>
                        </div>

                        ${order.status === 'PREPARING' ? `
                            <div style="width:100%; height:4px; background:rgba(255,255,255,0.05);">
                                <div style="width:75%; height:100%; background:#f97316; box-shadow:0 0 10px rgba(249,115,22,0.5);"></div>
                            </div>
                        ` : ''}

                        <!-- Items Body -->
                        <div style="padding:1.5rem 1.5rem 1.5rem 2rem;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.75rem;">
                                <span style="font-size:0.65rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:${statusColor}; background:${statusColor}20; padding:3px 10px; border-radius:6px; border:1px solid ${statusColor}40;">
                                    ${order.status}
                                </span>
                                <span style="font-size:0.75rem; color:#64748b; font-weight:600;">Server: <strong style="color:#e2e8f0;">Alex D.</strong></span>
                            </div>

                            <div style="display:flex; flex-direction:column; gap:1rem; margin-bottom:2rem;">
                                ${order.orderItems.map(item => `
                                    <div style="display:flex; align-items:start; gap:16px;">
                                        <div style="width:32px; height:32px; flex-shrink:0; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.9rem;">
                                            ${item.quantity}
                                        </div>
                                        <div style="flex:1;">
                                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                                <span style="font-size:1rem; font-weight:700; color:#f1f5f9;">${item.mealItem.name}</span>
                                                <span style="font-size:0.6rem; font-weight:800; text-transform:uppercase; color:#64748b; background:rgba(255,255,255,0.04); padding:2px 8px; border-radius:4px; border:1px solid rgba(255,255,255,0.05);">
                                                    ${item.mealItem.category || 'Mains'}
                                                </span>
                                            </div>
                                            ${item.quantity > 1 ? `<p style="font-size:0.75rem; color:#10b981; font-weight:600; margin:4px 0 0;">🔥 Priority Multi-Order</p>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            ${order.note ? `
                                <div style="margin-bottom:1.25rem; padding:0.6rem 0.85rem; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.25); border-radius:0.75rem; display:flex; align-items:center; gap:8px;">
                                    <span class="material-symbols-outlined" style="font-size:16px; color:#f59e0b;">warning</span>
                                    <span style="font-size:0.78rem; color:#fbbf24; font-weight:600;">${order.note}</span>
                                </div>
                            ` : ''}

                            ${actionBtn}
                        </div>
                    </div>
                `;
            }).join('') || `
                <div style="grid-column: 1/-1; padding:8rem; text-align:center; border:2px dashed rgba(255,255,255,0.05); border-radius:2rem; opacity:0.4;">
                    <div style="width:100px; height:100px; background:rgba(255,255,255,0.03); border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:2rem;">
                        <span class="material-symbols-outlined" style="font-size:3.5rem;">soup_kitchen</span>
                    </div>
                    <h3 style="font-size:1.5rem; font-weight:800; color:white; margin:0 0 0.5rem;">Station Idle</h3>
                    <p style="font-size:0.95rem;">No active tickets in the kitchen right now.</p>
                </div>
            `}
        </div>
    </div>
    `;
};

export const renderReservations = (state) => {
    const role = state.currentUser.role;
    const isAdmin = role === UserRole.ADMIN;
    
    // ── Helper to get initials ──
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const registryList = state.reservations.map(res => {
        const [h, m] = (res.reservationTime || '00:00').split(':').map(Number);
        const now = new Date();
        const slot = new Date(now);
        slot.setHours(h, m, 0, 0);
        const diffMin = (slot - now) / 60000;
        
        let statusLabel = 'Confirmed';
        let statusColor = '#10b981'; // primary
        let statusBg = 'rgba(16,185,129,0.1)';
        
        if (diffMin <= 15 && diffMin > -15) {
            statusLabel = 'Arriving Soon';
            statusColor = '#f59e0b'; // yellow/orange
            statusBg = 'rgba(245,158,11,0.1)';
        } else if (diffMin <= -15) {
            statusLabel = 'Seated / Expired';
            statusColor = '#94a3b8'; // grey
            statusBg = 'rgba(148,163,184,0.1)';
        }

        return `
            <div class="card-glass group hover:bg-white/[0.04] transition-all cursor-pointer" style="padding:1.25rem; border-left:4px solid ${statusColor}; border-radius:0 1rem 1rem 0;">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:1rem;">
                    <div style="display:flex; align-items:center; gap:0.85rem;">
                        <div style="width:40px; height:40px; border-radius:50%; background:${statusBg}; color:${statusColor}; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem;">
                            ${getInitials(res.customerId)}
                        </div>
                        <div>
                            <h4 style="font-weight:800; color:white; margin:0; font-size:1rem;" class="group-hover:text-primary transition-colors">${res.customerId}</h4>
                            <span style="font-size:0.75rem; color:#94a3b8;">${res.phone || '+1 (555) 000-0000'}</span>
                        </div>
                    </div>
                    <span style="padding:4px 10px; background:${statusBg}; color:${statusColor}; font-size:0.6rem; font-weight:800; text-transform:uppercase; border-radius:6px; letter-spacing:0.05em;">
                        ${statusLabel}
                    </span>
                </div>
                
                <div style="display:flex; align-items:center; justify-content:space-between; margin-top:0.75rem;">
                    <div style="display:flex; gap:1rem; align-items:center; color:#64748b; font-size:0.8rem; font-weight:500;">
                        <span style="display:flex; align-items:center; gap:4px;">
                            <span class="material-symbols-outlined" style="font-size:16px;">schedule</span> ${res.reservationTime}
                        </span>
                        <span style="display:flex; align-items:center; gap:4px;">
                            <span class="material-symbols-outlined" style="font-size:16px;">people</span> ${res.partySize} Guests
                        </span>
                    </div>
                    <div style="font-family:monospace; font-size:0.7rem; background:rgba(255,255,255,0.05); color:#cbd5e1; padding:3px 10px; border-radius:6px; font-weight:700;">
                        TABLE ${res.tableId}
                    </div>
                </div>

                ${isAdmin ? `
                    <div style="border-top:1px solid rgba(255,255,255,0.05); margin-top:1rem; padding-top:0.75rem; display:flex; justify-content:flex-end;">
                        <button class="cancel-res" data-id="${res.id}" style="background:transparent; border:none; color:#ef4444; font-size:0.7rem; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:4px;">
                            <span class="material-symbols-outlined" style="font-size:14px;">close</span> Cancel Visit
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('') || `
        <div style="padding:4rem; text-align:center; border:2px dashed rgba(255,255,255,0.05); border-radius:1.5rem; opacity:0.5;">
            <span class="material-symbols-outlined" style="font-size:3rem; margin-bottom:1rem; display:block;">event_available</span>
            <p style="font-size:0.9rem;">Guest registry is currently empty.</p>
        </div>
    `;

    return `
    <div class="view-content-wrapper fade-in" style="height:100%; display:flex; flex-direction:column; overflow:hidden;">
        <div style="max-width:1440px; margin:0 auto; width:100%; height:100%; display:grid; grid-template-columns: 1.2fr 0.8fr; gap:4rem; padding-bottom:2rem; overflow:hidden;">
            
            <!-- Left: Hostess Desk Form -->
            <div style="display:flex; flex-direction:column; overflow:hidden;">
                <div style="margin-bottom:1rem;">
                    <h3 style="font-size:1.5rem; font-weight:800; color:white; margin:0 0 0.2rem;">Hostess Desk</h3>
                    <p style="font-size:0.8rem; color:#64748b; margin:0;">Create new reservation or manage walk-ins</p>
                </div>
                
                <div class="card-glass" style="flex:1; padding:1.5rem 2rem; overflow-y:auto; border-radius:1.5rem; box-shadow:0 10px 40px rgba(0,0,0,0.4);" class="custom-scrollbar">
                    ${role === UserRole.ADMIN ? `
                        <form id="reservation-form" style="display:flex; flex-direction:column; gap:1.25rem;">
                            <!-- Identity section -->
                            <div>
                                <label style="display:block; font-size:0.6rem; font-weight:800; text-transform:uppercase; color:#94a3b8; letter-spacing:0.1em; margin-bottom:0.75rem;">Customer Identity</label>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:0.75rem;">
                                    <input type="text" id="customer-name" class="payment-input" placeholder="Full Name" style="background:rgba(0,0,0,0.2); padding:0.8rem 1rem;" required>
                                    <input type="tel" id="customer-phone" class="payment-input" placeholder="Phone Number" style="background:rgba(0,0,0,0.2); padding:0.8rem 1rem;">
                                </div>
                                <input type="email" id="customer-email" class="payment-input" placeholder="Email Address (Optional)" style="background:rgba(0,0,0,0.2); padding:0.8rem 1rem;">
                            </div>

                            <!-- Timing & Size section -->
                            <div>
                                <label style="display:block; font-size:0.6rem; font-weight:800; text-transform:uppercase; color:#94a3b8; letter-spacing:0.1em; margin-bottom:0.75rem;">Timing & Size</label>
                                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:1rem;">
                                    <input type="date" id="reservation-date" class="payment-input" value="${new Date().toISOString().split('T')[0]}" style="background:rgba(0,0,0,0.2); padding:0.8rem 1rem;">
                                    <input type="time" id="reservation-time" class="payment-input" value="19:00" style="background:rgba(0,0,0,0.2); padding:0.8rem 1rem;" required>
                                    <div style="position:relative;">
                                        <input type="number" id="party-size" value="2" min="1" class="payment-input" style="background:rgba(0,0,0,0.2); padding:0.8rem 2.5rem 0.8rem 1rem;">
                                        <span class="material-symbols-outlined" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#64748b; font-size:18px;">people</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Assignment -->
                            <div>
                                <label style="display:block; font-size:0.6rem; font-weight:800; text-transform:uppercase; color:#94a3b8; letter-spacing:0.1em; margin-bottom:0.75rem;">Assign Table</label>
                                <select id="table-select" class="payment-input" style="background:rgba(0,0,0,0.2); padding:0.8rem 1rem;">
                                    <option value="" disabled selected>Select an optimized table...</option>
                                    ${state.tables.filter(t => t.status === 'FREE').map(t => `<option value="${t.id}">${t.id} (Min Cap: ${t.capacity})</option>`).join('')}
                                </select>
                            </div>

                            <!-- Special Requests -->
                            <div>
                                <label style="display:block; font-size:0.6rem; font-weight:800; text-transform:uppercase; color:#94a3b8; letter-spacing:0.1em; margin-bottom:0.75rem;">Special Requests</label>
                                <textarea id="special-requests" class="payment-input" rows="2" placeholder="Allergies, high chair..." style="background:rgba(0,0,0,0.2); resize:none; padding-top:0.75rem;"></textarea>
                            </div>

                            <div style="margin-top:0.5rem;">
                                <button type="submit" style="width:100%; background:#10b981; color:white; border:none; border-radius:1rem; padding:1.1rem; font-weight:800; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.1em; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.75rem; box-shadow:0 8px 30px rgba(16,185,129,0.3); transition:all 0.2s;"
                                   onmouseover="this.style.background='#059669'; this.style.transform='translateY(-2px)'"
                                   onmouseout="this.style.background='#10b981'; this.style.transform='translateY(0)'">
                                    <span class="material-symbols-outlined">check_circle</span>
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    ` : `
                        <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
                            <div style="width:80px; height:80px; border-radius:50%; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; margin-bottom:2rem;">
                                <span class="material-symbols-outlined" style="font-size:2.5rem; opacity:0.3;">lock</span>
                            </div>
                            <h4 style="font-weight:800; color:white; margin:0 0 0.5rem;">Access Restricted</h4>
                            <p style="color:#64748b; font-size:0.85rem; max-width:280px;">The Guest Registry and Hostess Desk are managed exclusive by Administrative users.</p>
                        </div>
                    `}
                </div>
            </div>

            <!-- Right: Active Registry -->
            <div style="display:flex; flex-direction:column; overflow:hidden;">
                <div style="margin-bottom:2rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3 style="font-size:1.5rem; font-weight:800; color:white; margin:0 0 0.25rem;">Active Registry</h3>
                        <p style="font-size:0.75rem; color:#64748b; margin:0; display:flex; align-items:center; gap:4px;">
                            <span class="material-symbols-outlined" style="font-size:14px;">info</span>
                            Auto-reserved ±30 min around slot
                        </p>
                    </div>
                    <span style="font-size:0.65rem; font-weight:800; color:#10b981; background:rgba(16,185,129,0.1); padding:4px 10px; border-radius:6px; text-transform:uppercase;">TODAY</span>
                </div>
                
                <div id="registry-scroll" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:1rem; padding-right:0.5rem;" class="custom-scrollbar">
                    ${registryList}
                </div>
            </div>
        </div>
    </div>
    `;
};

export const renderCheckout = (state, orderId) => {
    // Shared Checkout view remains largely same but accessible to Admin & Waiter
    return renderOriginalCheckout(state, orderId); 
};

// Re-using the beautiful checkout logic but wrapping it
const renderOriginalCheckout = (state, orderId) => {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return `<div class="fade-in" style="padding:4rem; text-align:center;">Order not found.</div>`;

    const subtotal = order.orderItems.reduce((acc, item) => acc + (item.priceAtPurchase * item.quantity), 0);
    const serviceCharge = subtotal * 0.10;
    const tax = subtotal * 0.07;
    const grandTotal = subtotal + serviceCharge + tax;

    return `
    <div class="view-content-wrapper fade-in" style="height:100%; display:flex; flex-direction:column; overflow-y:auto;">
        <div style="display:grid; grid-template-columns: 1fr 420px; gap:6rem; max-width:1200px; margin:0 auto; width:100%;">
            <!-- Left: Settlement Summary -->
            <div class="card-glass" style="padding:3rem; border-radius:2.5rem; position:relative; overflow:hidden;">
                <div style="position:absolute; top:0; right:0; width:260px; height:260px; background:rgba(16,185,129,0.05); border-radius:50%; filter:blur(60px); transform:translate(30%, -30%); pointer-events:none;"></div>
                
                <h2 style="font-size:1.85rem; font-weight:900; margin-bottom:2.5rem; color:white; position:relative; z-index:10;">Settlement Summary</h2>
                
                <div style="display:flex; flex-direction:column; gap:1.5rem; position:relative; z-index:10;">
                    ${order.orderItems.map(item => `
                        <div style="display:flex; justify-content:space-between; align-items:start; font-size:1.1rem; font-weight:600;">
                            <span style="color:#e2e8f0; display:flex; align-items:center; gap:12px;">
                                <span style="color:#64748b; font-size:0.9rem; font-weight:400;">${item.quantity}×</span>
                                ${item.mealItem.name}
                            </span>
                            <span style="color:white; font-weight:800;">$${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}

                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#94a3b8; padding-top:0.5rem;">
                        <span style="padding-left:1.75rem;">Service Charge (10%)</span>
                        <span>$${serviceCharge.toFixed(2)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#94a3b8;">
                        <span style="padding-left:1.75rem;">Tax (7%)</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                </div>

                <div style="margin:2.5rem 0; height:1px; width:100%; border-bottom:2px dashed rgba(255,255,255,0.08); position:relative;"></div>

                <div style="background:rgba(255,255,255,0.02); border-radius:1.5rem; padding:2rem; display:flex; justify-content:space-between; align-items:center; box-shadow:inset 0 2px 10px rgba(0,0,0,0.2); position:relative; z-index:10;">
                    <span style="font-size:1.25rem; font-weight:900; color:#e2e8f0;">Grand Total</span>
                    <span style="font-size:3.5rem; font-weight:900; color:#10b981; letter-spacing:-0.02em; filter:drop-shadow(0 0 10px rgba(16,185,129,0.2));">$${grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <!-- Right: Authorization -->
            <div style="display:flex; flex-direction:column; gap:1.5rem; padding-top:1rem;">
                <h3 style="font-size:1rem; font-weight:900; text-transform:uppercase; letter-spacing:0.15em; color:#94a3b8; margin-bottom:0.5rem;">Authorization</h3>
                
                <div style="display:grid; gap:1rem;">
                    <button class="payment-method-btn" data-method="CREDIT_CARD" data-selected="false" style="width:100%; display:flex; align-items:center; justify-content:space-between; background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:1.5rem; padding:1.25rem; cursor:pointer; transition:all 0.2s; color:white;"
                        onmouseover="this.style.borderColor='#10b981'; this.style.background='rgba(16,185,129,0.05)'"
                        onmouseout="if(this.getAttribute('data-selected') !== 'true') { this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='transparent'; }">
                        <div style="display:flex; align-items:center; gap:1rem;">
                            <div style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center;">
                                <span class="material-symbols-outlined" style="font-size:20px; color:#94a3b8;">credit_card</span>
                            </div>
                            <span style="font-size:1.1rem; font-weight:800;">Digital Card (Chip/Pin)</span>
                        </div>
                        <span class="material-symbols-outlined" style="color:#64748b;">chevron_right</span>
                    </button>

                    <button class="payment-method-btn" data-method="CASH" data-selected="false" style="width:100%; display:flex; align-items:center; justify-content:space-between; background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:1.5rem; padding:1.25rem; cursor:pointer; transition:all 0.2s; color:white;"
                        onmouseover="this.style.borderColor='#10b981'; this.style.background='rgba(16,185,129,0.05)'"
                        onmouseout="if(this.getAttribute('data-selected') !== 'true') { this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='transparent'; }">
                        <div style="display:flex; align-items:center; gap:1rem;">
                            <div style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center;">
                                <span class="material-symbols-outlined" style="font-size:20px; color:#94a3b8;">payments</span>
                            </div>
                            <span style="font-size:1.1rem; font-weight:800;">Currency (Manual)</span>
                        </div>
                        <span class="material-symbols-outlined" style="color:#64748b;">chevron_right</span>
                    </button>

                    <button class="payment-method-btn" data-method="MOBILE" data-selected="false" style="width:100%; display:flex; align-items:center; justify-content:space-between; background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:1.5rem; padding:1.25rem; cursor:pointer; transition:all 0.2s; color:white;"
                        onmouseover="this.style.borderColor='#10b981'; this.style.background='rgba(16,185,129,0.05)'"
                        onmouseout="if(this.getAttribute('data-selected') !== 'true') { this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='transparent'; }">
                        <div style="display:flex; align-items:center; gap:1rem;">
                            <div style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center;">
                                <span class="material-symbols-outlined" style="font-size:20px; color:#94a3b8;">phone_iphone</span>
                            </div>
                            <span style="font-size:1.1rem; font-weight:800;">Mobile Pay</span>
                        </div>
                        <span class="material-symbols-outlined" style="color:#64748b;">chevron_right</span>
                    </button>

                    <button class="payment-method-btn" data-method="SPLIT" data-selected="false" style="width:100%; display:flex; align-items:center; justify-content:space-between; background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:1.5rem; padding:1.25rem; cursor:pointer; transition:all 0.2s; color:white; opacity:0.7;"
                        onmouseover="this.style.borderColor='#10b981'; this.style.background='rgba(16,185,129,0.05)'"
                        onmouseout="if(this.getAttribute('data-selected') !== 'true') { this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='transparent'; }">
                        <div style="display:flex; align-items:center; gap:1rem;">
                            <div style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center;">
                                <span class="material-symbols-outlined" style="font-size:20px; color:#94a3b8;">call_split</span>
                            </div>
                            <span style="font-size:1.1rem; font-weight:800;">Split Bill</span>
                        </div>
                        <span class="material-symbols-outlined" style="color:#64748b;">chevron_right</span>
                    </button>
                </div>

                <div id="payment-process-area" style="margin-top:2rem; display:none;">
                     <button class="btn btn-primary" id="confirm-payment-execution" style="width:100%; padding:1.25rem; border-radius:1.25rem; font-weight:900;">CONFIRM SETTLEMENT</button>
                </div>

                <div style="margin-top:auto; padding-top:2rem; border-top:1px solid rgba(255,255,255,0.05);">
                    <button id="cancel-checkout" style="width:100%; padding:1rem; background:transparent; border:none; color:#ef4444; font-weight:700; font-size:0.85rem; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; border-radius:1rem; transition:all 0.2s;" onmouseover="this.style.background='rgba(239,68,68,0.1)'" onmouseout="this.style.background='transparent'">
                        <span class="material-symbols-outlined" style="font-size:18px;">cancel</span>
                        Cancel Transaction
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
};

export const renderBillingHistory = (bills) => {
    const totalRevenue = bills.reduce((a, b) => a + ((b.totalAmount || 0) * 1.17), 0);

    return `
    <div class="view-content-wrapper fade-in">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2.5rem;">
            <div>
                <h2>Billing Ledger</h2>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem;">${bills.length} transactions • All time revenue: <strong style="color:var(--primary-color);">$${totalRevenue.toFixed(2)}</strong></p>
            </div>
            <button class="btn btn-outline" id="back-to-dashboard">← Back</button>
        </div>

        ${bills.length === 0 ? `
            <div style="text-align:center; padding:6rem; border:1px dashed var(--glass-border); border-radius:20px; opacity:0.5;">
                <span style="font-size:3rem;">🧾</span>
                <p style="margin-top:1rem;">No bills settled yet.</p>
            </div>
        ` : `
            <div style="display:flex; flex-direction:column; gap:1rem;">
                ${[...bills].reverse().map(bill => {
                    const date = bill.createdAt ? new Date(bill.createdAt).toLocaleString() : '—';
                    const grand = ((bill.totalAmount || 0) * 1.17).toFixed(2);
                    return `
                    <div class="card-glass" style="padding:1.5rem; display:grid; grid-template-columns: auto 1fr auto auto; gap:1.5rem; align-items:center;">
                        <div style="width:44px; height:44px; background:rgba(16,185,129,0.1); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.3rem;">🧾</div>
                        <div>
                            <div style="font-weight:800;">Table ${bill.tableId} &nbsp;•&nbsp; <span style="color:var(--text-secondary); font-size:0.85rem;">Order #${(bill.id || '').split('-')[1]}</span></div>
                            <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:3px;">${date} &nbsp;•&nbsp; ${bill.paymentMethod || 'N/A'} &nbsp;•&nbsp; ${bill.orderItems?.length || 0} items</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:1.4rem; font-weight:900; color:var(--primary-color);">$${grand}</div>
                            <div style="font-size:0.7rem; color:var(--text-secondary);">incl. 17% tax</div>
                        </div>
                        <span style="background:rgba(16,185,129,0.1); color:var(--primary-color); padding:4px 12px; border-radius:20px; font-size:0.7rem; font-weight:700;">PAID</span>
                    </div>
                `}).join('')}
            </div>
        `}
    </div>
    `;
};

export const renderStaff = (state) => {
    const users = state.users || [];
    const currentUserId = state.currentUser?.id;
    
    return `
    <div class="view-content-wrapper fade-in">
        
        <!-- Stats Row -->
        <section style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; margin-bottom:2.5rem;">
            <div class="card-glass" style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
                <div style="display:flex; justify-content:space-between; items:start;">
                    <div style="padding:10px; background:rgba(59,130,246,0.1); color:#3b82f6; border-radius:12px;">
                        <span class="material-symbols-outlined">group</span>
                    </div>
                </div>
                <div>
                    <p style="color:#64748b; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; margin:0;">Total Staff</p>
                    <h3 style="font-size:2rem; font-weight:900; color:white; margin:0.25rem 0 0;">${users.length}</h3>
                </div>
            </div>
            <div class="card-glass" style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
                <div style="display:flex; justify-content:space-between; items:start;">
                    <div style="padding:10px; background:rgba(16,185,129,0.1); color:#10b981; border-radius:12px;">
                        <span class="material-symbols-outlined">bolt</span>
                    </div>
                </div>
                <div>
                    <p style="color:#64748b; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; margin:0;">Active Sessions</p>
                    <h3 style="font-size:2rem; font-weight:900; color:white; margin:0.25rem 0 0;">0${Math.min(users.length, 3)}</h3>
                </div>
            </div>
            <div class="card-glass" style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem; cursor:pointer;" id="toggle-staff-form">
                <div style="display:flex; justify-content:space-between; items:start;">
                    <div style="padding:10px; background:rgba(236,91,19,0.1); color:#ec5b13; border-radius:12px;">
                        <span class="material-symbols-outlined">person_add</span>
                    </div>
                </div>
                <div>
                    <p style="color:#64748b; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; margin:0;">Action Required</p>
                    <h3 style="font-size:1.1rem; font-weight:900; color:#ec5b13; margin:0.5rem 0 0;">Onboard New Member →</h3>
                </div>
            </div>
        </section>

        <!-- Onboarding Panel (Hidden by default) -->
        <div id="staff-form-panel" class="card-glass" style="display:none; padding:2rem; border-radius:1.5rem; margin-bottom:2.5rem; border-left: 4px solid #ec5b13;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
                <h3 style="font-size:1.25rem; font-weight:800; color:white; margin:0;">Onboard New Staff Member</h3>
                <button id="close-staff-form" style="background:none; border:none; color:#64748b; cursor:pointer;"><span class="material-symbols-outlined">close</span></button>
            </div>
            <form id="add-staff-form" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem;">
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                    <label style="font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Full Username</label>
                    <input type="text" id="staff-username" placeholder="e.g. jdoe_waiter" required 
                        style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0.75rem; color:white;">
                </div>
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                    <label style="font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Access Level</label>
                    <select id="staff-role" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0.75rem; color:white;">
                        <option value="WAITER">Waiter / Service</option>
                        <option value="CHEF">Chef / Kitchen</option>
                        <option value="ADMIN">Administrator</option>
                    </select>
                </div>
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                    <label style="font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Temporary Password</label>
                    <input type="password" id="staff-password" placeholder="••••••" required 
                        style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0.75rem; color:white;">
                </div>
                <div style="display:flex; align-items:flex-end;">
                    <button type="submit" style="width:100%; height:46px; background:#ec5b13; color:white; border:none; border-radius:10px; font-weight:900; cursor:pointer;">Initialize Account</button>
                </div>
            </form>
        </div>

        <!-- Team Table -->
        <div class="card-glass" style="border-radius:1.5rem; overflow:hidden;">
            <div style="padding:1.5rem 2rem; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center;">
                <h3 style="font-size:1.1rem; font-weight:800; color:white; margin:0;">Team Directory</h3>
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; text-align:left; border-collapse:collapse;">
                    <thead>
                        <tr style="background:rgba(255,255,255,0.02); text-transform:uppercase; font-size:0.65rem; font-weight:800; color:#94a3b8; letter-spacing:0.1em;">
                            <th style="padding:1.25rem 2rem;">Member</th>
                            <th style="padding:1.25rem 2rem;">Designation</th>
                            <th style="padding:1.25rem 2rem;">Status</th>
                            <th style="padding:1.25rem 2rem;">ID Handle</th>
                            <th style="padding:1.25rem 2rem; text-align:right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody style="font-size:0.85rem;">
                        ${users.map(user => `
                            <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                                <td style="padding:1.25rem 2rem;">
                                    <div style="display:flex; align-items:center; gap:1rem;">
                                        <div style="width:36px; height:36px; border-radius:10px; background:${user.role === 'ADMIN' ? '#a855f7' : (user.role === 'CHEF' ? '#ec5b13' : '#3b82f6')}; color:white; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.75rem;">
                                            ${user.username.substring(0,2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style="font-weight:700; color:white;">${user.username}</div>
                                            <div style="font-size:0.75rem; color:#64748b;">Active Employee</div>
                                        </div>
                                    </div>
                                </td>
                                <td style="padding:1.25rem 2rem;">
                                    <span style="padding:4px 10px; border-radius:6px; font-size:0.65rem; font-weight:800; border:1px solid ${user.role === 'ADMIN' ? 'rgba(168,85,247,0.3)' : user.role === 'CHEF' ? 'rgba(236,91,19,0.3)' : 'rgba(59,130,246,0.3)'}; background:${user.role === 'ADMIN' ? 'rgba(168,85,247,0.1)' : user.role === 'CHEF' ? 'rgba(236,91,19,0.1)' : 'rgba(59,130,246,0.1)'}; color:${user.role === 'ADMIN' ? '#c084fc' : user.role === 'CHEF' ? '#ec5b13' : '#60a5fa'};">
                                        ${user.role}
                                    </span>
                                </td>
                                <td style="padding:1.25rem 2rem;">
                                    ${user.id === currentUserId ? `
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <div style="width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 10px #10b981;"></div>
                                        <span style="color:#10b981; font-weight:700; font-size:0.75rem;">Online (You)</span>
                                    </div>` : `
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <div style="width:8px; height:8px; border-radius:50%; background:#475569;"></div>
                                        <span style="color:#64748b; font-weight:700; font-size:0.75rem;">Registered</span>
                                    </div>`}
                                </td>
                                <td style="padding:1.25rem 2rem; color:#64748b; font-family:monospace;">${user.id}</td>
                                <td style="padding:1.25rem 2rem; text-align:right; display:flex; gap:0.5rem; justify-content:flex-end;">
                                    <button class="change-pw-btn" data-id="${user.id}" data-name="${user.username}" style="background:rgba(59,130,246,0.1); color:#60a5fa; border:none; padding:8px; border-radius:8px; cursor:pointer;" title="Reset Password">
                                        <span class="material-symbols-outlined" style="font-size:18px;">key</span>
                                    </button>
                                    <button class="delete-user-btn" data-id="${user.id}" style="background:rgba(239,68,68,0.1); color:#ef4444; border:none; padding:8px; border-radius:8px; cursor:pointer;" title="Revoke Access">
                                        <span class="material-symbols-outlined" style="font-size:18px;">delete</span>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Change Password Modal (fixed overlay) -->
    <div id="change-pw-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.75); backdrop-filter:blur(10px); align-items:center; justify-content:center;">
        <div class="card-glass" style="width:420px; padding:2.5rem; border-radius:2rem; position:relative;">
            <h3 style="font-size:1.25rem; font-weight:800; color:white; margin:0 0 0.5rem;">Reset Password</h3>
            <p id="change-pw-label" style="font-size:0.82rem; color:#64748b; margin:0 0 2rem;">–</p>
            <form id="change-pw-form" style="display:flex; flex-direction:column; gap:1rem;">
                <input type="hidden" id="change-pw-userid">
                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                    <label style="font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">New Password</label>
                    <input type="password" id="change-pw-input" placeholder="••••••" required
                        style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0.85rem; color:white; font-size:0.95rem; outline:none;">
                </div>
                <button type="submit" style="height:48px; background:#3b82f6; color:white; border:none; border-radius:12px; font-weight:900; font-size:0.95rem; cursor:pointer; margin-top:0.5rem;">Update Credentials</button>
                <button type="button" id="close-pw-modal" style="height:40px; background:transparent; color:#64748b; border:1px solid rgba(255,255,255,0.07); border-radius:12px; font-weight:700; cursor:pointer;">Cancel</button>
            </form>
        </div>
    </div>
    `;
};

// ─── Analytics / Intelligence Hub ────────────────────────────────────────────
export const renderAnalytics = (state) => {
    const orders = state.orders || [];
    const paidOrders = orders.filter(o => o.status === 'PAID');
    const users = state.users || [];
    const waiters = users.filter(u => u.role === 'WAITER');

    // ── KPIs ──
    const totalRevenue = paidOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const avgCheck = paidOrders.length ? (totalRevenue / paidOrders.length) : 0;

    // ── Revenue by day (last 7 days) ──
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayRevenue = Array(7).fill(0);
    paidOrders.forEach(o => {
        const d = new Date(o.createdAt || o.updatedAt);
        dayRevenue[d.getDay()] += (o.totalAmount || 0);
    });
    const maxRev = Math.max(...dayRevenue, 1);
    const chartH = 120;
    const barW = 28;
    const gap = 12;
    const svgW = (barW + gap) * 7 - gap;
    const bars = days.map((day, i) => {
        const h = Math.max(4, Math.round((dayRevenue[i] / maxRev) * chartH));
        const x = i * (barW + gap);
        const filled = dayRevenue[i] > 0;
        return `
            <g>
                <rect x="${x}" y="${chartH - h}" width="${barW}" height="${h}"
                    rx="6" fill="${filled ? '#ec5b13' : 'rgba(255,255,255,0.05)'}" opacity="${filled ? '1' : '0.4'}" />
                <text x="${x + barW/2}" y="${chartH + 16}" text-anchor="middle" font-size="10" fill="#64748b" font-family="'Outfit',sans-serif" font-weight="700">${day}</text>
                ${filled ? `<text x="${x + barW/2}" y="${chartH - h - 6}" text-anchor="middle" font-size="9" fill="#ec5b13" font-family="'Outfit',sans-serif" font-weight="800">$${dayRevenue[i].toFixed(0)}</text>` : ''}
            </g>`;
    }).join('');

    // ── Top 5 dishes ──
    const dishCounts = {};
    orders.forEach(o => {
        (o.orderItems || []).forEach(oi => {
            const name = oi.mealItem?.name || 'Unknown';
            dishCounts[name] = (dishCounts[name] || 0) + oi.quantity;
        });
    });
    const topDishes = Object.entries(dishCounts)
        .sort((a, b) => b[1] - a[1]).slice(0, 5);

    // ── Busiest table ──
    const tableCounts = {};
    orders.forEach(o => { tableCounts[o.tableId] = (tableCounts[o.tableId] || 0) + 1; });
    const busiestTable = Object.entries(tableCounts).sort((a, b) => b[1] - a[1])[0];

    // ── Waiter performance (today) ──
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const waiterPerf = waiters.map(w => {
        const myOrders = orders.filter(o =>
            o.waiterId === w.id &&
            o.status === 'SERVED' &&
            new Date(o.updatedAt || o.createdAt) >= today
        );
        let avgDelivery = '–';
        if (myOrders.length > 0) {
            const total = myOrders.reduce((s, o) => {
                const ready = o.readyAt ? new Date(o.readyAt) : null;
                const served = o.servedAt ? new Date(o.servedAt) : null;
                return s + (ready && served ? (served - ready) : 0);
            }, 0);
            const avgMs = total / myOrders.length;
            avgDelivery = avgMs > 0 ? `${Math.round(avgMs / 60000)}m` : '< 1m';
        }
        return { username: w.username, delivered: myOrders.length, avgDelivery };
    });

    return `
    <div class="view-content-wrapper fade-in">

        <!-- KPI Row -->
        <section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.25rem; margin-bottom:2.5rem;">
            ${[
                { icon: 'payments', label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: '#10b981' },
                { icon: 'receipt_long', label: 'Total Orders', value: orders.length, color: '#3b82f6' },
                { icon: 'check_circle', label: 'Paid Orders', value: paidOrders.length, color: '#ec5b13' },
                { icon: 'trending_up', label: 'Avg Check Size', value: `$${avgCheck.toFixed(2)}`, color: '#a855f7' },
            ].map(k => `
                <div class="card-glass" style="padding:1.5rem; display:flex; align-items:center; gap:1rem;">
                    <div style="width:48px; height:48px; border-radius:14px; background:${k.color}18; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <span class="material-symbols-outlined" style="font-size:24px; color:${k.color};">${k.icon}</span>
                    </div>
                    <div>
                        <div style="font-size:0.62rem; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;">${k.label}</div>
                        <div style="font-size:1.6rem; font-weight:900; color:white;">${k.value}</div>
                    </div>
                </div>
            `).join('')}
        </section>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">

            <!-- Revenue Bar Chart -->
            <div class="card-glass" style="padding:2rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.75rem;">
                    <div>
                        <h3 style="font-size:0.95rem; font-weight:800; color:white; margin:0 0 4px;">Revenue by Day</h3>
                        <p style="font-size:0.75rem; color:#475569; margin:0;">Week-to-date breakdown</p>
                    </div>
                    <span style="font-size:0.65rem; font-weight:800; color:#ec5b13; background:rgba(236,91,19,0.1); padding:4px 10px; border-radius:6px;">LIVE</span>
                </div>
                <svg viewBox="0 0 ${svgW + 20} ${chartH + 30}" width="100%" style="overflow:visible;">
                    <g transform="translate(10, 8)">
                        ${bars}
                    </g>
                </svg>
            </div>

            <!-- Top 5 Dishes -->
            <div class="card-glass" style="padding:2rem;">
                <h3 style="font-size:0.95rem; font-weight:800; color:white; margin:0 0 1.5rem;">🏆 Top Selling Dishes</h3>
                <div style="display:flex; flex-direction:column; gap:0.85rem;">
                    ${topDishes.length === 0
                        ? `<p style="color:#475569; font-size:0.85rem;">No order data yet.</p>`
                        : topDishes.map(([name, qty], i) => {
                            const maxQty = topDishes[0][1];
                            const pct = Math.round((qty / maxQty) * 100);
                            const rankColors = ['#f59e0b', '#94a3b8', '#b45309', '#10b981', '#3b82f6'];
                            return `
                                <div>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <span style="width:20px; height:20px; border-radius:6px; background:${rankColors[i]}20; color:${rankColors[i]}; font-size:0.65rem; font-weight:900; display:flex; align-items:center; justify-content:center;">${i+1}</span>
                                            <span style="font-size:0.85rem; font-weight:600; color:#e2e8f0;">${name}</span>
                                        </div>
                                        <span style="font-size:0.8rem; font-weight:800; color:white;">${qty} sold</span>
                                    </div>
                                    <div style="height:4px; background:rgba(255,255,255,0.05); border-radius:2px;">
                                        <div style="width:${pct}%; height:100%; background:${rankColors[i]}; border-radius:2px; transition:width 0.8s ease;"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                </div>
            </div>

        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">

            <!-- Busiest Table -->
            <div class="card-glass" style="padding:2rem;">
                <h3 style="font-size:0.95rem; font-weight:800; color:white; margin:0 0 1.5rem;">🔥 Busiest Table</h3>
                ${busiestTable ? `
                    <div style="display:flex; align-items:center; gap:1.5rem;">
                        <div style="width:80px; height:80px; border-radius:50%; background:rgba(236,91,19,0.1); border:2px solid #ec5b13; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                            <span style="font-size:1.4rem; font-weight:900; color:white;">${busiestTable[0]}</span>
                            <span style="font-size:0.6rem; color:#64748b; font-weight:700;">TABLE</span>
                        </div>
                        <div>
                            <div style="font-size:2rem; font-weight:900; color:#ec5b13;">${busiestTable[1]}</div>
                            <div style="font-size:0.75rem; color:#64748b; font-weight:600;">total orders placed</div>
                        </div>
                    </div>
                ` : `<p style="color:#475569; font-size:0.85rem;">No order data yet.</p>`}
            </div>

            <!-- Waiter Performance -->
            <div class="card-glass" style="padding:2rem;">
                <h3 style="font-size:0.95rem; font-weight:800; color:white; margin:0 0 1.5rem;">⏱️ Waiter Performance Today</h3>
                ${waiterPerf.length === 0
                    ? `<p style="color:#475569; font-size:0.85rem;">No waiter data available.</p>`
                    : `<table style="width:100%; border-collapse:collapse; font-size:0.82rem;">
                        <thead>
                            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
                                <th style="text-align:left; padding:0 0 0.75rem; color:#475569; font-weight:800; text-transform:uppercase; font-size:0.6rem; letter-spacing:0.08em;">Waiter</th>
                                <th style="text-align:center; padding:0 0 0.75rem; color:#475569; font-weight:800; text-transform:uppercase; font-size:0.6rem; letter-spacing:0.08em;">Delivered</th>
                                <th style="text-align:right; padding:0 0 0.75rem; color:#475569; font-weight:800; text-transform:uppercase; font-size:0.6rem; letter-spacing:0.08em;">Avg Delivery</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${waiterPerf.map(w => `
                                <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                                    <td style="padding:0.75rem 0; color:#e2e8f0; font-weight:700;">${w.username}</td>
                                    <td style="padding:0.75rem 0; text-align:center;">
                                        <span style="background:rgba(16,185,129,0.1); color:#10b981; padding:2px 10px; border-radius:999px; font-weight:800; font-size:0.78rem;">${w.delivered}</span>
                                    </td>
                                    <td style="padding:0.75rem 0; text-align:right; color:#f59e0b; font-weight:700;">${w.avgDelivery}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>`}
            </div>

        </div>
    </div>
    `;
};
