import { db } from '../config/db.js';

const SENSITIVE_KEYS = new Set([
  'password',
  'password_hash',
  'token',
  'jwt',
  'secret',
  'authorization',
  'service_role',
  'service_role_key',
  'credential',
]);

function sanitizeMetadata(value) {
  if (!value || typeof value !== 'object') return value || {};
  if (Array.isArray(value)) return value.map(sanitizeMetadata);

  const clean = {};
  for (const [key, raw] of Object.entries(value)) {
    const normalized = key.toLowerCase();
    if ([...SENSITIVE_KEYS].some((sensitive) => normalized.includes(sensitive))) {
      clean[key] = '[REDACTED]';
    } else if (raw && typeof raw === 'object') {
      clean[key] = sanitizeMetadata(raw);
    } else {
      clean[key] = raw;
    }
  }
  return clean;
}

export async function writeAuditLog(req, {
  action,
  entityType = '',
  entityId = '',
  metadata = {},
  actor = null,
} = {}) {
  if (!action) return null;

  const actorUser = actor || req?.user || null;
  const record = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    actor_user_id: actorUser?.id || null,
    actor_email: actorUser?.email || metadata.email || null,
    actor_role: actorUser?.role || null,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata: sanitizeMetadata(metadata),
    ip_address:
      req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      req?.socket?.remoteAddress ||
      req?.ip ||
      '',
    user_agent: req?.headers?.['user-agent'] || '',
    created_at: new Date().toISOString(),
  };

  try {
    return await db.insert('audit_logs', record);
  } catch (err) {
    console.error('[AUDIT] Failed to write audit log:', err.message || err);
    return null;
  }
}

export async function queryAuditLogs({
  action,
  actor,
  entity,
  q,
  from,
  to,
  page = 1,
  limit = 25,
} = {}) {
  let logs = [...(await db.get('audit_logs') || [])];

  if (action && action !== 'ALL') {
    logs = logs.filter((log) => log.action === action);
  }

  if (actor) {
    const needle = actor.toLowerCase().trim();
    logs = logs.filter((log) =>
      `${log.actor_email || ''} ${log.actor_user_id || ''} ${log.actor_role || ''}`.toLowerCase().includes(needle)
    );
  }

  if (entity) {
    const needle = entity.toLowerCase().trim();
    logs = logs.filter((log) =>
      `${log.entity_type || ''} ${log.entity_id || ''}`.toLowerCase().includes(needle)
    );
  }

  if (q) {
    const needle = q.toLowerCase().trim();
    logs = logs.filter((log) =>
      `${log.action || ''} ${log.actor_email || ''} ${log.entity_type || ''} ${log.entity_id || ''} ${JSON.stringify(log.metadata || {})}`
        .toLowerCase()
        .includes(needle)
    );
  }

  if (from) {
    const fromDate = new Date(from);
    if (!Number.isNaN(fromDate.getTime())) {
      logs = logs.filter((log) => new Date(log.created_at) >= fromDate);
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (!Number.isNaN(toDate.getTime())) {
      logs = logs.filter((log) => new Date(log.created_at) <= toDate);
    }
  }

  logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
  const total = logs.length;
  const start = (pageNum - 1) * limitNum;

  return {
    logs: logs.slice(start, start + limitNum),
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
}
