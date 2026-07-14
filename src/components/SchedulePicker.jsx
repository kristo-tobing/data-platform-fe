import { useState } from 'react';
import { FREQ_OPTIONS, TIME_OPTIONS, TIMEZONES, DAYS, buildCron } from '../data/mock.js';

const DEFAULT_STATE = {
  freq: 'daily',
  time: '06:00',
  timezone: 'UTC',
  startDate: '2026-06-01',
  endDate: '2026-12-31',
  catchup: false,
  days: ['1'],
  dom: '1',
  custom: '0 6 * * *',
};


export default function SchedulePicker({ value, onChange }) {
  const state = { ...DEFAULT_STATE, ...value };

  const update = (patch) => onChange({ ...state, ...patch });

  const toggleDay = (num) => {
    const s = String(num);
    const next = state.days.includes(s)
      ? state.days.filter(d => d !== s)
      : [...state.days, s];
    update({ days: next.length ? next : ['1'] });
  };

  const cron = buildCron(state);

  return (
    <div className="sched-box">
      <div className="sched-row">
        <span className="sched-lbl">Frequency</span>
        <select className="sched-sel" value={state.freq} onChange={e => update({ freq: e.target.value })}>
          {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {state.freq !== 'hourly' && state.freq !== 'custom' && (
          <>
            <span className="sched-lbl">At</span>
            <select className="sched-sel" value={state.time} onChange={e => update({ time: e.target.value })} style={{ maxWidth: 90 }}>
              {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
            </select>
          </>
        )}

        <span className="sched-lbl">Timezone</span>
        <select className="sched-sel" value={state.timezone} onChange={e => update({ timezone: e.target.value })} style={{ flex: 2 }}>
          {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
        </select>
      </div>

      <div className="sched-row">
        <span className="sched-lbl">Start</span>
        <input type="date" className="sched-date" value={state.startDate} onChange={e => update({ startDate: e.target.value })} />
        
        <span className="sched-lbl" style={{ marginLeft: 8 }}>End</span>
        <input type="date" className="sched-date" value={state.endDate} onChange={e => update({ endDate: e.target.value })} />

      </div>

      {state.freq === 'weekly' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span className="sched-lbl">Days</span>
          <div className="day-picker">
            {DAYS.map(d => (
              <button
                key={d.key} type="button"
                className={`day-btn${state.days.includes(String(d.num)) ? ' on' : ''}`}
                onClick={() => toggleDay(d.num)}
              >{d.label}</button>
            ))}
          </div>
        </div>
      )}

      {state.freq === 'monthly' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span className="sched-lbl">Day of month</span>
          <select className="sched-sel" value={state.dom} onChange={e => update({ dom: e.target.value })} style={{ maxWidth: 120 }}>
            {Array.from({ length: 28 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n}{['st','nd','rd'][n-1]||'th'}</option>
            ))}
          </select>
        </div>
      )}

      {state.freq === 'custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span className="sched-lbl">Cron</span>
          <input
            value={state.custom}
            onChange={e => update({ custom: e.target.value })}
            style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--purple)', flex: 1, background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '7px 10px', outline: 'none' }}
            placeholder="0 6 * * *"
          />
          <span style={{ fontSize: 11, color: 'var(--t3)' }}>min hr dom mon dow</span>
        </div>
      )}

      <div className="cron-out" style={{ display: 'none' }}>
        <span className="cron-tag">Cron</span>
        <span className="cron-val">{cron}</span>
        <span style={{ fontSize: 11, color: 'var(--t2)', marginLeft: 8 }}>{state.timezone}</span>
      </div>
    </div>
  );
}
