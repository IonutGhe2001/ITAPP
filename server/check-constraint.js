/**
 * Diagnostic Script: Check Equipment Constraint Status
 * 
 * This script checks if the unique constraint on [tip, serie] still exists
 * in the database and provides information about the migration status.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkConstraintStatus() {
  console.log('🔍 Checking database constraint status...\n');

  try {
    // Check if constraint exists by querying database metadata
    const constraintCheck = await prisma.$queryRaw`
      SELECT 
        i.relname as index_name,
        a.attname as column_name,
        ix.indisunique as is_unique
      FROM 
        pg_class t,
        pg_class i,
        pg_index ix,
        pg_attribute a
      WHERE 
        t.oid = ix.indrelid
        AND i.oid = ix.indexrelid
        AND a.attrelid = t.oid
        AND a.attnum = ANY(ix.indkey)
        AND t.relkind = 'r'
        AND t.relname = 'Echipament'
        AND i.relname LIKE '%serie%'
      ORDER BY t.relname, i.relname;
    `;

    console.log('📊 Index/Constraint Status:');
    if (constraintCheck.length === 0) {
      console.log('✅ No unique constraint found on serie field');
      console.log('✅ Database is in correct state\n');
    } else {
      console.log('⚠️  Found constraints/indexes:');
      console.table(constraintCheck);
      console.log('');
    }

    // Check migration history
    const migrationHistory = await prisma.$queryRaw`
      SELECT 
        migration_name,
        finished_at,
        applied_steps_count
      FROM "_prisma_migrations"
      WHERE migration_name LIKE '%remove_equipment_unique_constraint%'
      ORDER BY finished_at DESC;
    `;

    console.log('📜 Migration History:');
    if (migrationHistory.length === 0) {
      console.log('❌ Migration "remove_equipment_unique_constraint" NOT found in history');
      console.log('   This means the migration was never applied to this database.\n');
    } else {
      console.log('✅ Migration found in history:');
      console.table(migrationHistory);
      console.log('');
    }

    // Try to insert duplicate N/A serial numbers to test
    console.log('🧪 Testing: Can we insert duplicate N/A serial numbers?');
    
    try {
      // Try to create two equipment with same type and N/A serial
      const testId1 = `test-${Date.now()}-1`;
      const testId2 = `test-${Date.now()}-2`;
      
      await prisma.echipament.create({
        data: {
          id: testId1,
          nume: 'Test Equipment 1',
          tip: 'TEST',
          serie: 'N/A',
          stare: 'Functional',
        },
      });

      await prisma.echipament.create({
        data: {
          id: testId2,
          nume: 'Test Equipment 2',
          tip: 'TEST',
          serie: 'N/A',
          stare: 'Functional',
        },
      });

      console.log('✅ SUCCESS: Can insert multiple equipment with same type and N/A serial');
      console.log('   The constraint has been successfully removed!\n');

      // Clean up test data
      await prisma.echipament.deleteMany({
        where: {
          id: { in: [testId1, testId2] },
        },
      });
      console.log('🧹 Test data cleaned up');

    } catch (error) {
      if (error.code === 'P2002') {
        console.log('❌ FAILED: Unique constraint violation');
        console.log('   The constraint still exists in the database!');
        console.log('   Error:', error.message);
        console.log('\n📝 See fix instructions below.\n');
      } else {
        console.log('⚠️  Test failed with unexpected error:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkConstraintStatus()
  .then(() => {
    console.log('✅ Diagnostic check complete');
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
