const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb://tharun:X6akpDpbpplogp4kpmlb8345@67.207.160.66:16560/admin?authSource=admin';

async function fetchConflictRecords() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully!\n');
    
    const db = client.db('cloudfuze');
    const collection = db.collection('FileFolderInfo');
    
    console.log('Fetching conflict records...\n');
    
    // Fetch 1000 records where processStatus is CONFLICT
    const conflicts = await collection
      .find({ processStatus: 'CONFLICT' })
      .limit(1000)
      .toArray();
    
    console.log(`Found ${conflicts.length} conflict records\n`);
    
    // Extract relevant fields for analysis
    const analyzableData = conflicts.map((record, index) => ({
      index: index + 1,
      errorDescription: record.errorDescription || 'No description',
      statusCode: record.statusCode || 0,
      retry: record.retry || 0,
      processStatus: record.processStatus,
      moveWorkSpaceId: record.moveWorkSpaceId?.toString() || 'N/A',
      fileName: record.fileName || 'N/A',
      itemType: record.itemType || 'N/A',
    }));
    
    // Save to JSON file
    const outputPath = path.join(__dirname, 'conflict-records.json');
    fs.writeFileSync(outputPath, JSON.stringify(analyzableData, null, 2));
    
    console.log(`✅ Data saved to: ${outputPath}\n`);
    
    // Show some statistics
    const uniqueErrors = new Set(conflicts.map(c => c.errorDescription));
    console.log(`📊 Statistics:`);
    console.log(`   Total records: ${conflicts.length}`);
    console.log(`   Unique error descriptions: ${uniqueErrors.size}`);
    console.log(`   Average error description length: ${Math.round(
      conflicts.reduce((sum, c) => sum + (c.errorDescription?.length || 0), 0) / conflicts.length
    )} characters\n`);
    
    // Show sample error descriptions
    console.log('📝 Sample Error Descriptions (first 10):\n');
    conflicts.slice(0, 10).forEach((record, idx) => {
      console.log(`${idx + 1}. [${record.statusCode || 'N/A'}] ${record.errorDescription?.substring(0, 150) || 'No description'}${(record.errorDescription?.length || 0) > 150 ? '...' : ''}`);
    });
    
    console.log('\n✨ Analysis complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

fetchConflictRecords();
