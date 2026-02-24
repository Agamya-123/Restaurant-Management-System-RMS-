import { mockData } from './mockData.js';

export const renderDashboard = () => `
    <div class="fade-in">
        <h2 style="margin-bottom: 2rem;">Overview</h2>
        <div class="dashboard-grid">
            <div class="stat-card">
                <span class="label">Total Revenue</span>
                <div class="value">${mockData.stats.totalRevenue}</div>
                <div class="trend up">↑ 12% from yesterday</div>
            </div>
            <div class="stat-card">
                <span class="label">Active Orders</span>
                <div class="value">${mockData.stats.activeOrders}</div>
                <div class="trend up">↑ 2 new in last 5m</div>
            </div>
            <div class="stat-card">
                <span class="label">Occupancy Rate</span>
                <div class="value">${mockData.stats.occupancy}</div>
                <div class="trend">6/8 tables filled</div>
            </div>
            <div class="stat-card">
                <span class="label">Waitlist</span>
                <div class="value">${mockData.stats.waitlist}</div>
                <div class="trend down">Average wait: 15m</div>
            </div>
        </div>

        <h3 style="margin-bottom: 1.5rem;">Quick Table View</h3>
        <div class="table-grid">
            ${mockData.tables.slice(0, 4).map(table => `
                <div class="table-item ${table.status}">
                    <span class="table-id">${table.id}</span>
                    <span class="table-status">${table.status}</span>
                </div>
            `).join('')}
        </div>
    </div>
`;

export const renderTables = () => `
    <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>Table Management</h2>
            <div style="display: flex; gap: 1rem;">
                <span style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 10px; height: 10px; background: var(--primary-color); border-radius: 50%;"></span> Free
                </span>
                <span style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 10px; height: 10px; background: var(--accent-red); border-radius: 50%;"></span> Occupied
                </span>
                <span style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 10px; height: 10px; background: var(--accent-blue); border-radius: 50%;"></span> Reserved
                </span>
            </div>
        </div>
        <div class="table-grid">
            ${mockData.tables.map(table => `
                <div class="table-item ${table.status}">
                    <span class="table-id">${table.id}</span>
                    <span class="table-status">${table.status}</span>
                    <span style="font-size: 0.7rem; color: var(--text-secondary);">Cap: ${table.capacity}</span>
                </div>
            `).join('')}
        </div>
    </div>
`;

export const renderMenu = () => `
    <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>Digital Menu</h2>
            <button class="btn btn-primary">+ Add Item</button>
        </div>
        <div class="menu-grid">
            ${mockData.menu.map(item => `
                <div class="menu-card">
                    <img src="${item.image}" alt="${item.name}" class="menu-image">
                    <div class="menu-content">
                        <div class="menu-header">
                            <span class="menu-title">${item.name}</span>
                            <span class="menu-price">$${item.price.toFixed(2)}</span>
                        </div>
                        <p class="menu-desc">${item.description}</p>
                        <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
                            <button class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background: rgba(255,255,255,0.05);">Edit</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
`;
