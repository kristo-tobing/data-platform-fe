export function extractColumnsFromSql(sql) {
  if (!sql || typeof sql !== 'string') return [];

  // Remove comments (both -- and /* */)
  const cleanSql = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  // Match everything between SELECT and FROM
  // The 'i' flag makes it case-insensitive, 's' (or 'm' with [\s\S]) makes it match across newlines
  const match = cleanSql.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
  
  if (!match) return [];
  
  const selectPart = match[1];
  
  // Split by comma. We do a naive split here, ignoring complex nested functions with commas, 
  // but we can try to handle simple parentheses if needed. For now, a simple split is used,
  // followed by a cleanup of each part.
  const columnsRaw = selectPart.split(',');
  
  const columns = [];
  
  for (const rawCol of columnsRaw) {
    let col = rawCol.trim();
    if (!col || col === '*') continue;
    
    // Split by whitespace to find the alias
    const tokens = col.split(/\s+/);
    let colName = tokens[tokens.length - 1]; // The last word is usually the alias or column name
    
    // Remove quotes, backticks, brackets
    colName = colName.replace(/["'`\[\]]/g, '');
    
    // If it ends with a parenthesis, they probably didn't provide an alias.
    if (colName.endsWith(')')) {
      continue; // It's better to require an alias for expressions
    }
    
    // Split by dot in case of table.column (e.g. t.id)
    if (colName.includes('.')) {
      const parts = colName.split('.');
      colName = parts[parts.length - 1];
    }
    
    if (colName && colName !== '*') {
      columns.push(colName);
    }
  }
  
  // Return unique columns
  return [...new Set(columns)];
}
