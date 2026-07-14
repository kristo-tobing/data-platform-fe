import React, { useState } from 'react';
import TopNav from '../components/TopNav.jsx';
import DatasetGrid from '../components/DatasetGrid.jsx';
import UpdateDrawer from '../components/UpdateDrawer.jsx';
import CreateModal from '../components/CreateModal.jsx';
import Toast from '../components/Toast.jsx';
import { useTickets } from '../hooks/useTickets.js';
import { useToast } from '../hooks/useToast.js';
import { getUserInfo } from '../data/mock.js';

export default function HomePage({ user, onLogout }) {
  const { datasets, tickets, getTicketsForTable, getLatestTicket, submitTicket } = useTickets();
  const { toasts, addToast } = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDs, setActiveDs] = useState(null);
  const [activeTbl, setActiveTbl] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [filterTblSearch, setFilterTblSearch] = useState('');

  const userInfo = getUserInfo(user);
  const division = userInfo.division;

  const handleCardClick = (dsId, tblName) => {
    setActiveDs(dsId);
    setActiveTbl(tblName);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setActiveDs(null);
    setActiveTbl(null);
  };

  const activeTickets = activeTbl ? getTicketsForTable(activeTbl) : [];

  // Split into division-owned vs public, filter by DONE status
  const { myDatasets, publicDatasets } = React.useMemo(() => {
    const applyFilters = (ds) => {
      let filtered = {
        ...ds,
        tables: ds.tables.filter(tbl => {
          const latest = getLatestTicket(tbl);
          if (!latest || latest.status !== 'DONE') return false;
          if (filterTblSearch && tbl !== filterTblSearch) return false;
          return true;
        }),
      };
      return filtered;
    };

    const mine = datasets
      .filter(ds => !ds.public && ds.division === division)
      .map(applyFilters)
      .filter(ds => ds.tables.length > 0);

    const pub = datasets
      .filter(ds => ds.public)
      .map(applyFilters)
      .filter(ds => ds.tables.length > 0);

    return { myDatasets: mine, publicDatasets: pub };
  }, [datasets, division, filterTblSearch, getLatestTicket]);

  const allVisibleTables = React.useMemo(() => {
    return Array.from(new Set([
      ...myDatasets.flatMap(ds => ds.tables),
      ...publicDatasets.flatMap(ds => ds.tables),
    ])).sort();
  }, [myDatasets, publicDatasets]);

  const divisionLabel = division
    ? division.charAt(0).toUpperCase() + division.slice(1)
    : 'My';

  return (
    <div className="page">
      <TopNav
        user={user}
        onLogout={onLogout}
        onCreateClick={() => setCreateOpen(true)}
      />

      <div className="home-body">
        <main className={`ds-main ${drawerOpen ? 'drawer-open' : ''}`}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div className="page-title">BigQuery Pipelines</div>
            <div className="page-sub">Select a table to manage its ETL ticket history or create a new request.</div>

            {/* Filter bar */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
              <select
                value={filterTblSearch}
                onChange={e => setFilterTblSearch(e.target.value)}
                style={{ width: 260 }}
              >
                <option value="">All Tables</option>
                {allVisibleTables.map(tbl => <option key={tbl} value={tbl}>{tbl}</option>)}
              </select>
            </div>
          </div>

          {/* My Division Datasets */}
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--accent)', padding: '3px 10px', borderRadius: 12,
                background: 'rgba(47,129,247,0.12)', border: '1px solid rgba(47,129,247,0.25)',
              }}>
                {divisionLabel} Division
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                Datasets owned by your team
              </div>
            </div>
          </div>

          {myDatasets.length > 0 ? (
            <DatasetGrid
              datasets={myDatasets}
              getTicketsForTable={getTicketsForTable}
              selectedTable={activeTbl}
              onCardClick={handleCardClick}
            />
          ) : (
            <div style={{ maxWidth: 1400, margin: '0 auto 32px', padding: '24px', background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
              No active tables in your division's datasets yet.
            </div>
          )}

          {/* Public Datasets */}
          <div style={{ maxWidth: 1400, margin: '24px auto 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--green)', padding: '3px 10px', borderRadius: 12,
                background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.25)',
              }}>
                Public
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                Shared datasets accessible by all divisions
              </div>
            </div>
          </div>

          {publicDatasets.length > 0 ? (
            <DatasetGrid
              datasets={publicDatasets}
              getTicketsForTable={getTicketsForTable}
              selectedTable={activeTbl}
              onCardClick={handleCardClick}
            />
          ) : (
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px', background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
              No public tables available.
            </div>
          )}
        </main>

        <UpdateDrawer
          open={drawerOpen}
          dataset={activeDs}
          table={activeTbl}
          tickets={activeTickets}
          onClose={closeDrawer}
          onSubmit={submitTicket}
          addToast={addToast}
        />
      </div>

      <CreateModal
        open={createOpen}
        user={user}
        onClose={() => setCreateOpen(false)}
        onSubmit={submitTicket}
        addToast={addToast}
        datasets={[...myDatasets, ...publicDatasets]}
        getLatestTicket={getLatestTicket}
      />

      <Toast toasts={toasts} />
    </div>
  );
}
