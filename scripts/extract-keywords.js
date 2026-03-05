const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'conflict-records.json'), 'utf8'));

console.log('📊 ANALYZING CONFLICT ERROR DESCRIPTIONS - KEYWORD EXTRACTION\n');
console.log('═══════════════════════════════════════════════════════\n');

// Function to extract key error information
function extractErrorKeywords(errorDescription) {
  if (!errorDescription) return { type: 'Unknown Error', detail: 'No description' };
  
  const patterns = [
    // Uploading errors with status codes
    {
      pattern: /Exception while Uploading.*status code\s*:\s*(\d+).*Exception\s*:\s*["{]*([^"\\n]+)/i,
      extract: (match) => ({
        type: 'Exception while Uploading',
        statusCode: match[1],
        detail: match[2].substring(0, 100).trim()
      })
    },
    // Downloading errors with status codes
    {
      pattern: /Exception while Downloading.*status code\s*(\d+).*["']message["']\s*:\s*["']([^"']+)/i,
      extract: (match) => ({
        type: 'Exception while Downloading',
        statusCode: match[1],
        detail: match[2].substring(0, 100).trim()
      })
    },
    // Omitting partial file stream
    {
      pattern: /Omitting partial file stream/i,
      extract: () => ({
        type: 'Omitting partial file stream',
        statusCode: '0',
        detail: 'Partial file stream omitted during transfer'
      })
    },
    // Item not found
    {
      pattern: /itemNotFound/i,
      extract: () => ({
        type: 'Item Not Found',
        statusCode: '404',
        detail: 'The resource could not be found'
      })
    },
    // File not downloadable (Google Docs)
    {
      pattern: /fileNotDownloadable|Only files with binary content can be downloaded/i,
      extract: () => ({
        type: 'File Not Downloadable',
        statusCode: '403',
        detail: 'Google Docs/Sheets files require export, not download'
      })
    },
    // Authorization/Forbidden errors
    {
      pattern: /Forbidden|NotAuthorized|not authorized/i,
      extract: () => ({
        type: 'Authorization Failed',
        statusCode: '403',
        detail: 'Not authorized to perform this operation'
      })
    },
    // Bad Request
    {
      pattern: /Bad Request/i,
      extract: () => ({
        type: 'Bad Request',
        statusCode: '400',
        detail: 'Invalid request parameters'
      })
    },
    // Default
    {
      pattern: /.*/,
      extract: () => ({
        type: 'Other Error',
        statusCode: '0',
        detail: errorDescription.substring(0, 100)
      })
    }
  ];
  
  for (const { pattern, extract } of patterns) {
    const match = errorDescription.match(pattern);
    if (match) {
      return extract(match);
    }
  }
  
  return { type: 'Unknown Error', statusCode: '0', detail: 'No match found' };
}

// Extract keywords from all records
const analyzed = data.map(record => ({
  ...record,
  extracted: extractErrorKeywords(record.errorDescription)
}));

// Group by error type
const grouped = {};
analyzed.forEach(record => {
  const key = `${record.extracted.type}`;
  if (!grouped[key]) {
    grouped[key] = {
      type: record.extracted.type,
      count: 0,
      totalRetries: 0,
      statusCodes: new Set(),
      workspaces: new Set(),
      samples: []
    };
  }
  grouped[key].count++;
  grouped[key].totalRetries += record.retry;
  grouped[key].statusCodes.add(record.statusCode);
  grouped[key].workspaces.add(record.moveWorkSpaceId);
  if (grouped[key].samples.length < 2) {
    grouped[key].samples.push({
      detail: record.extracted.detail,
      errorDescription: record.errorDescription.substring(0, 300)
    });
  }
});

// Convert to array and sort
const sortedGroups = Object.values(grouped)
  .map(g => ({
    ...g,
    statusCodes: Array.from(g.statusCodes),
    workspaceCount: g.workspaces.size
  }))
  .sort((a, b) => b.count - a.count);

console.log('🔍 ERROR TYPES IDENTIFIED:\n');
sortedGroups.forEach((group, idx) => {
  console.log(`${idx + 1}. ${group.type}`);
  console.log(`   Count: ${group.count} records (${((group.count / data.length) * 100).toFixed(1)}%)`);
  console.log(`   Total Retries: ${group.totalRetries}`);
  console.log(`   Status Codes: [${group.statusCodes.join(', ')}]`);
  console.log(`   Workspaces: ${group.workspaceCount}`);
  console.log(`   Sample: "${group.samples[0]?.detail || 'N/A'}"`);
  console.log('');
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('💡 RECOMMENDED GROUPING FOR UI:\n');

sortedGroups.forEach((group, idx) => {
  let displayName = group.type;
  let description = '';
  
  switch(group.type) {
    case 'Exception while Uploading':
      displayName = 'Exception while Uploading';
      description = 'Errors during file upload to destination';
      break;
    case 'Exception while Downloading':
      displayName = 'Exception while Downloading';
      description = 'Errors during file download from source';
      break;
    case 'File Not Downloadable':
      displayName = 'File Not Downloadable (Google Docs)';
      description = 'Google Docs/Sheets files require export instead of download';
      break;
    case 'Omitting partial file stream':
      displayName = 'Omitting Partial File Stream';
      description = 'Partial file stream omitted during transfer';
      break;
    case 'Authorization Failed':
      displayName = 'Authorization Failed';
      description = 'Not authorized to access the resource';
      break;
    case 'Item Not Found':
      displayName = 'Item Not Found';
      description = 'The requested resource could not be found';
      break;
    case 'Bad Request':
      displayName = 'Bad Request';
      description = 'Invalid request parameters sent to cloud service';
      break;
    default:
      displayName = 'Other Conflicts';
      description = 'Other unclassified errors';
  }
  
  console.log(`${idx + 1}. Display Name: "${displayName}"`);
  console.log(`   Count: ${group.count}`);
  console.log(`   Description: ${description}`);
  console.log('');
});

// Save results
const output = {
  totalRecords: data.length,
  uniqueTypes: sortedGroups.length,
  groups: sortedGroups.map(g => ({
    type: g.type,
    count: g.count,
    percentage: ((g.count / data.length) * 100).toFixed(1),
    totalRetries: g.totalRetries,
    statusCodes: g.statusCodes,
    workspaceCount: g.workspaceCount,
    sample: g.samples[0]?.detail
  })),
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, 'conflict-keywords.json'),
  JSON.stringify(output, null, 2)
);

console.log('✅ Keyword analysis saved to conflict-keywords.json');
