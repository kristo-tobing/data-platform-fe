export function scheduleFromTicket(t) {
  return {
    freq: t.freq || 'daily',
    time: t.time || '06:00',
    timezone: t.timezone || 'UTC',
    startDate: t.startDate || '2026-06-01',
    endDate: t.endDate || '2026-12-31',
    catchup: t.catchup || false,
    days: ['1'],
    dom: '1',
    custom: t.schedule || '0 6 * * *',
  };
}
