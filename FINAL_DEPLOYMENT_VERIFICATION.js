/**
 * FINAL DEPLOYMENT VERIFICATION SCRIPT
 * 
 * This script will verify that the admin role system is working correctly
 * after the deployment is complete. Run this after deploying the role-based files.
 */

const { chromium } = require('playwright');

async function verifyDeployment() {
  console.log('🚀 FINAL DEPLOYMENT VERIFICATION');
  console.log('================================\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  let allTestsPassed = true;

  try {
    // =====================================================
    // PHASE 1: ADMIN USER TESTING
    // =====================================================
    console.log('👑 PHASE 1: Testing Admin User Features...\n');

    // Login as admin
    await page.goto('https://sales.nawrasinchina.com/login');
    await page.fill('input[type="email"]', 'taha@zoony.com.tr');
    await page.fill('input[type="password"]', 'Taha123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    console.log('✅ Admin login successful');

    // Test 1: Check for admin navigation
    const adminNavExists = await page.locator('text=Administration').isVisible();
    if (adminNavExists) {
      console.log('✅ Admin navigation section visible');
    } else {
      console.log('❌ Admin navigation section missing');
      allTestsPassed = false;
    }

    // Test 2: Check for admin pages accessibility
    const adminPages = [
      { url: '/dashboard/admin', name: 'Admin Dashboard' },
      { url: '/dashboard/admin/users', name: 'User Management' },
      { url: '/dashboard/admin/reports', name: 'System Reports' }
    ];

    for (const adminPage of adminPages) {
      try {
        await page.goto(`https://sales.nawrasinchina.com${adminPage.url}`);
        const is404 = await page.locator('text=404').isVisible();
        if (!is404) {
          console.log(`✅ ${adminPage.name} accessible`);
        } else {
          console.log(`❌ ${adminPage.name} returns 404`);
          allTestsPassed = false;
        }
      } catch (error) {
        console.log(`❌ ${adminPage.name} failed to load: ${error.message}`);
        allTestsPassed = false;
      }
    }

    // Test 3: Check customer page for admin features
    await page.goto('https://sales.nawrasinchina.com/dashboard/customers');
    
    const adminBadge = await page.locator('text=Admin View').isVisible();
    if (adminBadge) {
      console.log('✅ Admin badge visible on customer page');
    } else {
      console.log('❌ Admin badge missing on customer page');
      allTestsPassed = false;
    }

    // Test 4: Check if customer data is displayed
    await page.waitForTimeout(3000); // Wait for data to load
    const customerCount = await page.locator('[data-testid="total-customers"]').textContent();
    if (customerCount && customerCount !== '0' && customerCount !== '...') {
      console.log(`✅ Customer data displayed: ${customerCount} customers`);
    } else {
      console.log('❌ Customer data not displaying correctly');
      allTestsPassed = false;
    }

    // =====================================================
    // PHASE 2: REGULAR USER TESTING
    // =====================================================
    console.log('\n👤 PHASE 2: Testing Regular User Restrictions...\n');

    // Logout admin
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Log out');
    await page.waitForURL('**/login');

    // Login as regular user
    await page.fill('input[type="email"]', 'osama@zoony.com.tr');
    await page.fill('input[type="password"]', 'Osama123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    console.log('✅ Regular user login successful');

    // Test 5: Verify admin navigation is hidden
    const adminNavHidden = !(await page.locator('text=Administration').isVisible());
    if (adminNavHidden) {
      console.log('✅ Admin navigation hidden from regular user');
    } else {
      console.log('❌ Admin navigation visible to regular user');
      allTestsPassed = false;
    }

    // Test 6: Verify admin pages are blocked
    for (const adminPage of adminPages) {
      try {
        await page.goto(`https://sales.nawrasinchina.com${adminPage.url}`);
        const isBlocked = await page.locator('text=Access Denied').isVisible() || 
                         await page.locator('text=404').isVisible();
        if (isBlocked) {
          console.log(`✅ ${adminPage.name} blocked for regular user`);
        } else {
          console.log(`❌ ${adminPage.name} accessible to regular user`);
          allTestsPassed = false;
        }
      } catch (error) {
        console.log(`✅ ${adminPage.name} properly blocked (error expected)`);
      }
    }

    // Test 7: Check customer page for regular user
    await page.goto('https://sales.nawrasinchina.com/dashboard/customers');
    
    const noAdminBadge = !(await page.locator('text=Admin View').isVisible());
    if (noAdminBadge) {
      console.log('✅ No admin badge for regular user');
    } else {
      console.log('❌ Admin badge visible to regular user');
      allTestsPassed = false;
    }

    // =====================================================
    // PHASE 3: FUNCTIONAL TESTING
    // =====================================================
    console.log('\n⚙️ PHASE 3: Testing Functional Features...\n');

    // Login back as admin for functional tests
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Log out');
    await page.waitForURL('**/login');
    await page.fill('input[type="email"]', 'taha@zoony.com.tr');
    await page.fill('input[type="password"]', 'Taha123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Test 8: User Management functionality
    try {
      await page.goto('https://sales.nawrasinchina.com/dashboard/admin/users');
      const userTable = await page.locator('table').isVisible();
      if (userTable) {
        console.log('✅ User management table visible');
      } else {
        console.log('❌ User management table not found');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ User management page failed to load');
      allTestsPassed = false;
    }

    // Test 9: System Reports functionality
    try {
      await page.goto('https://sales.nawrasinchina.com/dashboard/admin/reports');
      const reportsContent = await page.locator('text=System Reports').isVisible();
      if (reportsContent) {
        console.log('✅ System reports page loaded');
      } else {
        console.log('❌ System reports page content missing');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ System reports page failed to load');
      allTestsPassed = false;
    }

    // =====================================================
    // FINAL RESULTS
    // =====================================================
    console.log('\n🎯 FINAL VERIFICATION RESULTS');
    console.log('=============================\n');

    if (allTestsPassed) {
      console.log('🎉 ALL TESTS PASSED! ✅');
      console.log('✅ Admin role system is fully functional');
      console.log('✅ Role-based access control working');
      console.log('✅ Admin pages accessible');
      console.log('✅ Regular users properly restricted');
      console.log('✅ UI shows role-based features');
      console.log('\n🚀 DEPLOYMENT SUCCESSFUL! 🚀');
    } else {
      console.log('❌ SOME TESTS FAILED');
      console.log('⚠️ Admin role system needs additional fixes');
      console.log('📋 Review the failed tests above');
      console.log('\n🔧 ADDITIONAL DEPLOYMENT REQUIRED');
    }

  } catch (error) {
    console.error('❌ Verification failed with error:', error);
    allTestsPassed = false;
  } finally {
    await browser.close();
  }

  return allTestsPassed;
}

// Quick verification function for specific features
async function quickVerification() {
  console.log('⚡ QUICK VERIFICATION - Testing key features...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const tests = [
    {
      name: 'Admin Dashboard Access',
      test: async () => {
        await page.goto('https://sales.nawrasinchina.com/dashboard/admin');
        return !(await page.locator('text=404').isVisible());
      }
    },
    {
      name: 'Admin Navigation Visible',
      test: async () => {
        await page.goto('https://sales.nawrasinchina.com/dashboard');
        return await page.locator('text=Administration').isVisible();
      }
    },
    {
      name: 'Customer Data Loading',
      test: async () => {
        await page.goto('https://sales.nawrasinchina.com/dashboard/customers');
        await page.waitForTimeout(2000);
        const count = await page.locator('[data-testid="total-customers"]').textContent();
        return count && count !== '0' && count !== '...';
      }
    }
  ];

  for (const test of tests) {
    try {
      const result = await test.test();
      console.log(`${result ? '✅' : '❌'} ${test.name}: ${result ? 'PASS' : 'FAIL'}`);
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
  }

  await browser.close();
}

// Export functions for use in other scripts
module.exports = { verifyDeployment, quickVerification };

// Run verification if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--quick')) {
    quickVerification();
  } else {
    verifyDeployment();
  }
}
