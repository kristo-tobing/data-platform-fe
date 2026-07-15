// ── Domain Labels ──────────────────────────────────────
export const LABELS = [
  { id: 'bizdev',      label: 'BizDev',      color: '#4f9cf9', bg: 'rgba(79,156,249,.15)' },
  { id: 'growth',      label: 'Growth',      color: '#f778ba', bg: 'rgba(247,120,186,.15)' },
  { id: 'collection',  label: 'Collection',  color: '#3fb950', bg: 'rgba(63,185,80,.15)' },
  { id: 'ops',         label: 'Ops',         color: '#d29922', bg: 'rgba(210,153,34,.15)' },
  { id: 'finance',     label: 'Finance',     color: '#bc8cff', bg: 'rgba(188,140,255,.15)' },
  { id: 'product',     label: 'Product',     color: '#39c5cf', bg: 'rgba(57,197,207,.15)' },
  { id: 'engineering', label: 'Engineering', color: '#f85149', bg: 'rgba(248,81,73,.15)' },
  { id: 'risk',        label: 'Risk',        color: '#e8c46a', bg: 'rgba(232,196,106,.15)' },
  { id: 'marketing',   label: 'Marketing',   color: '#a371f7', bg: 'rgba(163,113,247,.15)' },
];

// ── Users & Divisions ──────────────────────────────────
export const USERS = {
  'k.tobing':    { displayName: 'K. Tobing',    division: 'marketing' },
  'alice.smith': { displayName: 'Alice Smith',  division: 'marketing' },
  'bob.tan':     { displayName: 'Bob Tan',      division: 'marketing' },
  'carol.ng':    { displayName: 'Carol Ng',     division: 'marketing' },
  'david.wu':    { displayName: 'David Wu',     division: 'finance'   },
  'eve.lim':     { displayName: 'Eve Lim',      division: 'finance'   },
  'frank.oh':    { displayName: 'Frank Oh',     division: 'ops'       },
  'grace.lee':   { displayName: 'Grace Lee',    division: 'product'   },
  'henry.ko':    { displayName: 'Henry Ko',     division: 'product'   },
  'sara.wong':   { displayName: 'Sara Wong',    division: 'bizdev'    },
  'john.smith':  { displayName: 'John Smith',   division: 'ops'       },
  'jane.doe':    { displayName: 'Jane Doe',     division: 'ops'       },
};

export function getUserInfo(username) {
  return USERS[username] || { displayName: username, division: null };
}

// ── Ticket Statuses ────────────────────────────────────
export const STATUSES = {
  OPEN:        { label: 'Open',        color: '#4f9cf9', bg: 'rgba(79,156,249,.12)' },
  IN_PROGRESS: { label: 'In Progress', color: '#bc8cff', bg: 'rgba(188,140,255,.12)' },
  IN_REVIEW:   { label: 'In Review',   color: '#d29922', bg: 'rgba(210,153,34,.12)' },
  APPROVED:    { label: 'Approved',    color: '#3fb950', bg: 'rgba(63,185,80,.12)' },
  REJECTED:    { label: 'Rejected',    color: '#f85149', bg: 'rgba(248,81,73,.12)' },
  DONE:        { label: 'Done',        color: '#8b949e', bg: 'rgba(139,148,158,.12)' },
};

// ── Timezones ──────────────────────────────────────────
export const TIMEZONES = [
  { value: 'UTC',             label: 'UTC (UTC+0)' },
  { value: 'Asia/Jakarta',    label: 'WIB — Asia/Jakarta (UTC+7)' },
  { value: 'Asia/Makassar',   label: 'WITA — Asia/Makassar (UTC+8)' },
  { value: 'Asia/Jayapura',   label: 'WIT — Asia/Jayapura (UTC+9)' },
  { value: 'Asia/Singapore',  label: 'SGT — Asia/Singapore (UTC+8)' },
  { value: 'Asia/Bangkok',    label: 'ICT — Asia/Bangkok (UTC+7)' },
  { value: 'Asia/Kolkata',    label: 'IST — Asia/Kolkata (UTC+5:30)' },
  { value: 'Asia/Tokyo',      label: 'JST — Asia/Tokyo (UTC+9)' },
  { value: 'Europe/London',   label: 'GMT — Europe/London' },
  { value: 'Europe/Paris',    label: 'CET — Europe/Paris (UTC+1)' },
  { value: 'America/New_York',label: 'EST — America/New_York (UTC-5)' },
  { value: 'America/Chicago', label: 'CST — America/Chicago (UTC-6)' },
  { value: 'America/Los_Angeles', label: 'PST — America/Los_Angeles (UTC-8)' },
];

// ── Datasets & Tables ──────────────────────────────────
export const DATASETS = [
  {
    id: 'marketing_raw', locked: false, division: 'marketing', public: false,
    tables: [
      'marketing__order__daily',
      'marketing__campaign__daily',
      'marketing__click__hourly',
      'marketing__leads__daily',
      'marketing__attribution__daily',
      'marketing__retention__weekly',
    ],
  },
  {
    id: 'finance_raw', locked: false, division: 'finance', public: false,
    tables: ['finance__payment__monthly', 'finance__invoice__daily'],
  },
  {
    id: 'ops_raw', locked: false, division: 'ops', public: false,
    tables: ['ops__event__hourly'],
  },
  {
    id: 'product_raw', locked: false, division: 'product', public: false,
    tables: ['product__click__daily', 'product__view__hourly'],
  },
  {
    id: 'sales_raw', locked: false, division: 'growth', public: false,
    tables: ['sales__revenue__daily', 'sales__leads__hourly'],
  },
  {
    id: 'hr_raw', locked: false, division: 'bizdev', public: false,
    tables: ['hr__headcount__monthly', 'hr__attendance__daily'],
  },
  {
    id: 'shared_raw', locked: false, division: null, public: true,
    tables: ['shared__dim_date', 'shared__dim_region', 'shared__exchange_rate__daily'],
  },
  {
    id: 'analytics_raw', locked: false, division: null, public: true,
    tables: ['analytics__kpi__daily', 'analytics__funnel__weekly'],
  },
];

// ── Mock Tickets ───────────────────────────────────────
export const MOCK_TICKETS = {
  'marketing__order__daily': [
    {
      id: 'REQ002', name: 'Initial Order Pipeline', date: '2026-05-12', requester: 'k.tobing',
      operation: 'Create', domainLabels: ['marketing'], status: 'DONE',
      desc: 'Initial creation of the daily order table. Core marketing pipeline for revenue tracking.',
      schedule: '0 5 * * *', freq: 'daily', time: '05:00', timezone: 'UTC', endDate: '2026-09-30',
      updateStrategy: 'overwrite',
      dataset: 'marketing_raw', table: 'marketing__order__daily',
      sql: `SELECT order_id, order_date, amount\nFROM \`marketing_raw.orders\`\nWHERE DATE(order_date) = CURRENT_DATE()`,
      schema: [
        { id: 'sc1', name: 'order_id',   type: 'STRING',  desc: 'Unique order ID', nullable: false, categorical: { enabled: false, values: [] } },
        { id: 'sc2', name: 'order_date', type: 'DATE',    desc: 'Order date',      nullable: false, categorical: { enabled: false, values: [] } },
        { id: 'sc3', name: 'amount',     type: 'FLOAT64', desc: 'Order value',     nullable: true,  categorical: { enabled: false, values: [] } },
      ],
    },
    {
      id: 'REQ001', name: 'Update daily order aggregations', date: '2026-06-30', requester: 'alice.smith',
      operation: 'Update', domainLabels: ['marketing', 'collection'], status: 'IN_REVIEW',
      updateStrategy: 'merge',
      desc: 'Create daily order aggregation pipeline from marketing_raw.orders. Aggregates total order value, count, and distinct customers per day for BI consumption.',
      schedule: '0 6 * * *', freq: 'daily', time: '06:00', timezone: 'UTC', endDate: '2026-12-31',
      dataset: 'marketing_raw', table: 'marketing__order__daily',
      sql: `SELECT\n  order_id,\n  customer_id,\n  DATE(order_date) AS order_date,\n  SUM(amount) AS total_amount\nFROM \`marketing_raw.orders\`\nWHERE DATE(order_date) = CURRENT_DATE()\nGROUP BY 1, 2, 3`,
      schema: [
        { name: 'order_id',     type: 'STRING',  desc: 'Unique order ID', nullable: false },
        { name: 'customer_id',  type: 'STRING',  desc: 'Customer ref',    nullable: false },
        { name: 'order_date',   type: 'DATE',    desc: 'Date of order',   nullable: false },
        { name: 'total_amount', type: 'FLOAT64', desc: 'Sum of value',    nullable: true  },
      ],
    },
    {
      id: 'REQ023', name: 'Add customer PII to orders', date: '2026-07-10', requester: 'bob.tan',
      operation: 'Update', domainLabels: ['marketing'], status: 'REJECTED',
      rejectComment: 'Please do not include raw customer emails. You must use hashed equivalents (e.g. SHA256) per our PII compliance policy.',
      desc: 'Attempt to add plain-text customer emails to the order table. Rejected due to PII compliance.',
      schedule: '0 5 * * *', freq: 'daily', time: '05:00', timezone: 'UTC', endDate: '2026-09-30',
      updateStrategy: 'merge',
      dataset: 'marketing_raw', table: 'marketing__order__daily',
      sql: `SELECT order_id, order_date, amount, customer_email\nFROM \`marketing_raw.orders\``,
      schema: [],
    },
  ],
  'marketing__campaign__daily': [
    {
      id: 'REQ003', name: 'Campaign Performance Aggregation', date: '2026-07-01', requester: 'bob.tan',
      operation: 'Create', domainLabels: ['marketing', 'analytics'], status: 'DONE',
      updateStrategy: 'overwrite',
      desc: 'Campaign performance aggregation — daily impressions, clicks, and spend per campaign.',
      schedule: '0 7 * * *', freq: 'daily', time: '07:00', timezone: 'Asia/Jakarta', endDate: '2026-12-31',
      dataset: 'marketing_raw', table: 'marketing__campaign__daily',
      sql: `SELECT campaign_id, DATE(impression_date) AS dt,\n  SUM(impressions) AS total_impressions, SUM(clicks) AS total_clicks\nFROM \`marketing_raw.campaigns\`\nGROUP BY 1, 2`,
      schema: [],
    },
  ],
  'marketing__click__hourly': [
    {
      id: 'REQ004', name: 'Hourly Click Tracking', date: '2026-07-03', requester: 'carol.ng',
      operation: 'Create', domainLabels: ['marketing', 'collection'], status: 'DONE',
      updateStrategy: 'incremental',
      desc: 'Start hourly click tracking pipeline for real-time marketing attribution.',
      schedule: '0 * * * *', freq: 'hourly', time: '00:00', timezone: 'UTC', endDate: '2026-12-31',
      dataset: 'marketing_raw', table: 'marketing__click__hourly',
      sql: `SELECT\n  click_id,\n  user_id,\n  campaign_id,\n  TIMESTAMP_TRUNC(clicked_at, HOUR) AS hour_bucket,\n  source,\n  medium\nFROM \`marketing_raw.click_events\`\nWHERE clicked_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)`,
      schema: [],
    },
  ],
  'marketing__leads__daily': [
    {
      id: 'REQ020', name: 'Daily Leads Pipeline', date: '2026-06-10', requester: 'alice.smith',
      operation: 'Create', domainLabels: ['marketing'], status: 'DONE',
      updateStrategy: 'overwrite',
      desc: 'Daily lead ingestion from CRM. Tracks new leads, source channel, and qualification status.',
      schedule: '0 6 * * *', freq: 'daily', time: '06:00', timezone: 'Asia/Jakarta', endDate: '2026-12-31',
      dataset: 'marketing_raw', table: 'marketing__leads__daily',
      sql: `SELECT\n  lead_id,\n  DATE(created_at) AS lead_date,\n  source_channel,\n  qualification_status,\n  assigned_to\nFROM \`crm_raw.leads\`\nWHERE DATE(created_at) = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)`,
      schema: [
        { id: 'ld1', name: 'lead_id',              type: 'STRING', desc: 'Unique lead ID',          nullable: false, categorical: { enabled: false, values: [] } },
        { id: 'ld2', name: 'lead_date',            type: 'DATE',   desc: 'Date lead was created',   nullable: false, categorical: { enabled: false, values: [] } },
        { id: 'ld3', name: 'source_channel',       type: 'STRING', desc: 'Acquisition channel',     nullable: true,  categorical: { enabled: true,  values: ['organic_search', 'paid_search', 'social_media', 'email', 'referral', 'direct'] } },
        { id: 'ld4', name: 'qualification_status', type: 'STRING', desc: 'MQL / SQL / Unqualified', nullable: true,  categorical: { enabled: true,  values: ['unqualified', 'MQL', 'SQL', 'opportunity'] } },
        { id: 'ld5', name: 'assigned_to',          type: 'STRING', desc: 'SDR username',            nullable: true,  categorical: { enabled: false, values: [] } },
      ],
    },
  ],
  'marketing__attribution__daily': [
    {
      id: 'REQ021', name: 'Marketing Attribution Model', date: '2026-06-25', requester: 'bob.tan',
      operation: 'Create', domainLabels: ['marketing', 'analytics'], status: 'DONE',
      updateStrategy: 'overwrite',
      desc: 'Daily multi-touch attribution table. Distributes revenue credit across touchpoints using a linear model.',
      schedule: '0 8 * * *', freq: 'daily', time: '08:00', timezone: 'UTC', endDate: '2026-12-31',
      dataset: 'marketing_raw', table: 'marketing__attribution__daily',
      sql: `SELECT\n  touchpoint_id,\n  order_id,\n  campaign_id,\n  DATE(touchpoint_date) AS dt,\n  ROUND(order_revenue / touchpoint_count, 2) AS attributed_revenue\nFROM \`marketing_raw.touchpoints\`\nWHERE DATE(touchpoint_date) = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)`,
      schema: [
        { name: 'touchpoint_id',      type: 'STRING',  desc: 'Touchpoint event ID',  nullable: false },
        { name: 'order_id',           type: 'STRING',  desc: 'Linked order ID',       nullable: false },
        { name: 'campaign_id',        type: 'STRING',  desc: 'Campaign ref',          nullable: false },
        { name: 'dt',                 type: 'DATE',    desc: 'Attribution date',      nullable: false },
        { name: 'attributed_revenue', type: 'FLOAT64', desc: 'Linear-model revenue',  nullable: true  },
      ],
    },
  ],
  'marketing__retention__weekly': [
    {
      id: 'REQ022', name: 'Weekly Retention Cohort', date: '2026-07-07', requester: 'carol.ng',
      operation: 'Create', domainLabels: ['marketing', 'analytics'], status: 'DONE',
      updateStrategy: 'overwrite',
      desc: 'Weekly cohort retention analysis. Tracks % of users returning in weeks 1–12 after first purchase.',
      schedule: '0 5 * * 1', freq: 'weekly', time: '05:00', timezone: 'UTC', endDate: '2026-12-31',
      dataset: 'marketing_raw', table: 'marketing__retention__weekly',
      sql: `SELECT\n  cohort_week,\n  weeks_since_first,\n  COUNT(DISTINCT user_id) AS retained_users,\n  ROUND(COUNT(DISTINCT user_id) / cohort_size, 4) AS retention_rate\nFROM \`marketing_raw.retention_base\`\nGROUP BY 1, 2, cohort_size`,
      schema: [
        { name: 'cohort_week',       type: 'DATE',    desc: 'Week of first purchase', nullable: false },
        { name: 'weeks_since_first', type: 'INT64',   desc: 'Week number (0–12)',     nullable: false },
        { name: 'retained_users',    type: 'INT64',   desc: 'Returning user count',   nullable: false },
        { name: 'retention_rate',    type: 'FLOAT64', desc: 'Retention %',            nullable: true  },
      ],
    },
  ],
};

// ── Schedule helpers ───────────────────────────────────
export const FREQ_OPTIONS = [
  { value: 'daily',   label: 'Daily' },
  { value: 'hourly',  label: 'Hourly' },
  { value: 'weekly',  label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom',  label: 'Custom (cron)' },
];

export const TIME_OPTIONS = [
  '00:00','01:00','02:00','03:00','04:00','05:00',
  '06:00','07:00','08:00','09:00','10:00','12:00',
  '15:00','18:00','21:00',
];

export const DAYS = [
  { key: 'MON', label: 'M', num: 1 },
  { key: 'TUE', label: 'T', num: 2 },
  { key: 'WED', label: 'W', num: 3 },
  { key: 'THU', label: 'T', num: 4 },
  { key: 'FRI', label: 'F', num: 5 },
  { key: 'SAT', label: 'S', num: 6 },
  { key: 'SUN', label: 'S', num: 0 },
];

export function buildCron({ freq, time, days, dom, custom }) {
  const [hh, mm] = (time || '06:00').split(':').map(Number);
  switch (freq) {
    case 'hourly':  return '0 * * * *';
    case 'weekly':  return `${mm} ${hh} * * ${days?.length ? days.join(',') : '1'}`;
    case 'monthly': return `${mm} ${hh} ${dom || 1} * *`;
    case 'custom':  return custom || '0 6 * * *';
    default:        return `${mm} ${hh} * * *`;
  }
}

export function parseCronFreq(cron) {
  if (!cron) return 'daily';
  const p = cron.trim().split(/\s+/);
  if (p.length !== 5) return 'custom';
  if (p[1] === '*') return 'hourly';
  if (p[4] !== '*') return 'weekly';
  if (p[2] !== '*') return 'monthly';
  return 'daily';
}

let reqCounter = 11;
export function genId() {
  const num = String(reqCounter++).padStart(3, '0');
  return `REQ${num}`;
}

export function peekNextId() {
  const num = String(reqCounter).padStart(3, '0');
  return `REQ${num}`;
}

export function today() {
  return new Date().toISOString().split('T')[0];
}
