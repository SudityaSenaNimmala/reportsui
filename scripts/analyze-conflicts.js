const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'conflict-records.json'), 'utf8'));

console.log('📊 ANALYZING CONFLICT ERROR DESCRIPTIONS\n');
console.log('═══════════════════════════════════════════════════════\n');

// Group by exact error description
const errorGroups = {};
data.forEach(record => {
  const error = record.errorDescription;
  if (!errorGroups[error]) {
    errorGroups[error] = {
      count: 0,
      statusCodes: new Set(),
      retries: [],
      workspaces: new Set()
    };
  }
  errorGroups[error].count++;
  errorGroups[error].statusCodes.add(record.statusCode);
  errorGroups[error].retries.push(record.retry);
  errorGroups[error].workspaces.add(record.moveWorkSpaceId);
});

// Sort by count
const sorted = Object.entries(errorGroups)
  .map(([error, data]) => ({
    error,
    count: data.count,
    statusCodes: Array.from(data.statusCodes),
    avgRetry: data.retries.reduce((a, b) => a + b, 0) / data.retries.length,
    workspaceCount: data.workspaces.size
  }))
  .sort((a, b) => b.count - a.count);

console.log('🔍 UNIQUE ERROR DESCRIPTIONS:\n');
sorted.forEach((item, idx) => {
  console.log(`${idx + 1}. ERROR: "${item.error}"`);
  console.log(`   Count: ${item.count} records`);
  console.log(`   Status Codes: [${item.statusCodes.join(', ')}]`);
  console.log(`   Avg Retries: ${item.avgRetry.toFixed(2)}`);
  console.log(`   Workspaces: ${item.workspaceCount}`);
  console.log('');
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('💡 KEYWORD IDENTIFICATION:\n');

// Identify potential keywords/patterns
const keywords = [
  { keyword: '409 Conflict', pattern: /409 Conflict/i },
  { keyword: 'same name already exists', pattern: /same name already exists/i },
  { keyword: 'Unable to overwrite', pattern: /Unable to overwrite/i },
  { keyword: 'file in use', pattern: /file in use/i },
  { keyword: 'CloudConnectorException', pattern: /CloudConnectorException/i },
  { keyword: 'Duplicate object name', pattern: /Duplicate object name/i },
  { keyword: 'Destination file already exists', pattern: /Destination file already exists/i },
  { keyword: 'nameAlreadyExists', pattern: /nameAlreadyExists/i },
  { keyword: 'Version conflict', pattern: /Version conflict/i },
];

console.log('Analyzing keyword matches...\n');

keywords.forEach(({ keyword, pattern }) => {
  const matches = data.filter(record => pattern.test(record.errorDescription));
  if (matches.length > 0) {
    console.log(`"${keyword}": ${matches.length} records (${((matches.length / data.length) * 100).toFixed(1)}%)`);
  }
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('📋 SUGGESTED GROUPING STRATEGY:\n');

sorted.forEach((item, idx) => {
  let suggestedGroup = 'Other Conflicts';
  
  if (/409.*same name.*exists/i.test(item.error)) {
    suggestedGroup = '409 Conflict: A file with the same name already exists at destination';
  } else if (/Unable to overwrite.*file in use/i.test(item.error)) {
    suggestedGroup = 'Conflict: Unable to overwrite; file in use at destination';
  } else if (/CloudConnectorException.*409/i.test(item.error)) {
    suggestedGroup = 'CloudConnectorException: 409 Conflict during upload';
  } else if (/Duplicate object name/i.test(item.error)) {
    suggestedGroup = 'Duplicate object name at destination; conflict';
  } else if (/Destination file already exists/i.test(item.error)) {
    suggestedGroup = 'Destination file already exists; migration conflict';
  } else if (/nameAlreadyExists/i.test(item.error)) {
    suggestedGroup = 'nameAlreadyExists: Change the filename and try again';
  } else if (/Version conflict/i.test(item.error)) {
    suggestedGroup = 'Version conflict: file was modified at source and destination';
  }
  
  console.log(`${idx + 1}. "${item.error}"`);
  console.log(`   → Group as: "${suggestedGroup}"`);
  console.log(`   → Count: ${item.count}`);
  console.log('');
});

// Save analysis results
const analysisResult = {
  totalRecords: data.length,
  uniqueErrors: sorted.length,
  errorBreakdown: sorted,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, 'conflict-analysis.json'),
  JSON.stringify(analysisResult, null, 2)
);

console.log('✅ Analysis saved to conflict-analysis.json');
