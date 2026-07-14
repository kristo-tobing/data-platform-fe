import { useState, useCallback } from 'react';
import { DATASETS, MOCK_TICKETS, genId, today } from '../data/mock.js';

export function useTickets() {
  const [datasets, setDatasets] = useState(() => JSON.parse(JSON.stringify(DATASETS)));
  const [tickets, setTickets] = useState(() => JSON.parse(JSON.stringify(MOCK_TICKETS)));

  const getTicketsForTable = useCallback((table) => tickets[table] || [], [tickets]);

  const getLatestTicket = useCallback((table) => {
    const list = tickets[table] || [];
    return list[0] || null;
  }, [tickets]);

  const submitTicket = useCallback((data) => {
    const { dataset, table } = data;
    const newTicket = { ...data, id: genId(), date: today(), status: 'OPEN' };

    setTickets(prev => ({
      ...prev,
      [table]: [newTicket, ...(prev[table] || [])],
    }));

    setDatasets(prev => prev.map(ds => {
      if (ds.id !== dataset) return ds;
      const hasTable = ds.tables.includes(table);
      return { ...ds, tables: hasTable ? ds.tables : [...ds.tables, table] };
    }));

    return newTicket;
  }, []);

  const tablesForDataset = useCallback((dsId) => {
    const ds = datasets.find(d => d.id === dsId);
    return ds ? ds.tables : [];
  }, [datasets]);

  return { datasets, tickets, getTicketsForTable, getLatestTicket, submitTicket, tablesForDataset };
}
