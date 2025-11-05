/**
 * Test Authentication Protection on Admin APIs
 * This script tests that unauthorized access is properly blocked
 */

async function testAuthProtection() {
  const baseUrl = 'http://localhost:3000'
  
  console.log('🧪 Testing Admin API Authentication Protection\n')
  console.log('═'.repeat(50))
  
  const endpoints = [
    { method: 'GET', path: '/api/admin/blogs', description: 'Get all blogs (admin)' },
    { method: 'GET', path: '/api/admin/products', description: 'Get all products (admin)' },
    { method: 'POST', path: '/api/blogs', description: 'Create blog' },
  ]

  let passedTests = 0
  let failedTests = 0

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📍 Testing: ${endpoint.method} ${endpoint.path}`)
      console.log(`   Description: ${endpoint.description}`)
      
      const response = await fetch(`${baseUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const status = response.status
      const data = await response.json().catch(() => ({}))

      console.log(`   Status: ${status}`)
      console.log(`   Response:`, JSON.stringify(data, null, 2))

      // Check if access is properly denied (401 or 403)
      if (status === 401 || status === 403) {
        console.log('   ✅ PASS - Unauthorized access blocked')
        passedTests++
      } else {
        console.log('   ❌ FAIL - Expected 401/403 but got ' + status)
        failedTests++
      }
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`)
      failedTests++
    }
  }

  console.log('\n' + '═'.repeat(50))
  console.log('\n📊 Test Results:')
  console.log(`   ✅ Passed: ${passedTests}`)
  console.log(`   ❌ Failed: ${failedTests}`)
  console.log(`   📈 Total:  ${passedTests + failedTests}`)
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Admin APIs are properly protected.')
  } else {
    console.log('\n⚠️  Some tests failed. Please review the results above.')
  }
}

// Run the test
testAuthProtection().catch(console.error)
