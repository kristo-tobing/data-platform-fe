import { extractColumnsFromSql, extractTablesFromSql, validateSqlSyntax } from './sqlParser.js';

/**
 * Runs all validation rules for the Query Validation Engine
 * @param {Object} params
 * @param {string} params.sql - The SQL query text
 * @param {Array} params.schema - The user-defined schema [{ name, desc }]
 * @param {string} params.userDivision - The user's division (e.g. 'marketing', 'finance')
 * @param {string} params.targetTable - The name of the table being created/updated
 * @returns {Object} result
 * @returns {boolean} result.isValid - true if NO blockers exist
 * @returns {Array} result.errors - List of blocking errors (strings)
 * @returns {Array} result.warnings - List of warnings (strings)
 * @returns {Object} result.stats - Simulated stats { bytesScanned, cost }
 */
export function runDryRunChecks({ sql, schema, userDivision, targetTable }) {
  const errors = [];
  const warnings = [];
  
  // 1. Basic Syntax Validation
  const syntaxCheck = validateSqlSyntax(sql);
  if (!syntaxCheck.valid) {
    errors.push(`Syntax Error: ${syntaxCheck.error}`);
    // If syntax is deeply broken, parsing further might fail, but we'll try anyway
  }
  
  // 2. Table Naming Convention Check (only if creating a new table)
  if (targetTable && targetTable !== 'NEW') {
    // Format should be domain__entity__freq
    // We'll enforce at least one underscore sequence
    if (!/^[a-z0-9_]+$/.test(targetTable)) {
      errors.push(`Naming Convention: Table name "${targetTable}" contains invalid characters (lowercase alphanumeric and underscores only).`);
    } else if (!targetTable.includes('__')) {
      errors.push(`Naming Convention: Table name "${targetTable}" should follow domain__entity__freq format (missing double underscores).`);
    }
  }

  // 3. Table Permissions Check
  const extractedTables = extractTablesFromSql(sql);
  const allowedDatasets = [`${userDivision}_raw`, 'shared_raw', 'analytics_raw'];
  
  extractedTables.forEach(fullTableName => {
    // Full table name is typically dataset.table (e.g., marketing_raw.orders)
    if (fullTableName.includes('.')) {
      const [dataset] = fullTableName.split('.');
      if (!allowedDatasets.includes(dataset)) {
        errors.push(`Access Denied: You do not have permission to read from dataset "${dataset}". Allowed datasets for your division: ${allowedDatasets.join(', ')}.`);
      }
    } else {
      warnings.push(`Ambiguous Table: "${fullTableName}" has no dataset prefix. Assuming it is within your allowed datasets.`);
    }
  });
  
  if (extractedTables.length === 0 && !errors.some(e => e.includes('Syntax Error'))) {
    warnings.push('No source tables detected in the query (did you forget the FROM clause?).');
  }

  // 4. Schema Match Check
  const sqlColumns = extractColumnsFromSql(sql);
  const schemaColumnNames = (schema || []).filter(s => s.name).map(s => s.name);
  
  if (schemaColumnNames.length > 0) {
    schemaColumnNames.forEach(schemaCol => {
      if (!sqlColumns.includes(schemaCol)) {
        errors.push(`Schema Mismatch: Column "${schemaCol}" is defined in the schema but missing from your SELECT statement.`);
      }
    });
  } else if (sqlColumns.length > 0) {
    warnings.push('Schema is empty, but your query returns columns. Consider defining a schema.');
  }

  // 5. Cost Estimation & PII Check (Simulated Dry Run APIs)
  const bytes = Math.floor(Math.random() * 800) + 50; // Random between 50MB and 850MB
  const cost = (bytes * 0.005).toFixed(4);
  
  if (bytes > 500) {
    warnings.push(`High Cost: This query will scan approximately ${bytes} MB, which exceeds the 500 MB soft limit.`);
  }
  
  const lowerSql = (sql || '').toLowerCase();
  if (lowerSql.includes('email') || lowerSql.includes('phone') || lowerSql.includes('ktp') || lowerSql.includes('password')) {
    warnings.push('PII Flagged: Potential sensitive data (email/phone/password) detected in the query. This will require DEA review.');
  }
  
  if (!lowerSql.includes('where')) {
    warnings.push('No Partition Filter: Query lacks a WHERE clause, which might cause a full table scan.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: { bytesScanned: bytes, cost }
  };
}
