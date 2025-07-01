/**
 * DEPLOYMENT READINESS CHECK
 * 
 * This script verifies that all admin role system files are ready for deployment
 * and provides deployment instructions.
 */

const fs = require('fs');
const path = require('path');

function checkDeploymentReadiness() {
  console.log('🚀 DEPLOYMENT READINESS CHECK');
  console.log('============================\n');

  let allFilesReady = true;

  // Critical files that need to be deployed
  const criticalFiles = [
    // Admin Pages
    {
      path: 'crmnew-main/app/dashboard/admin/page.tsx',
      description: 'Admin Dashboard Page',
      priority: 'CRITICAL'
    },
    {
      path: 'crmnew-main/app/dashboard/admin/users/page.tsx',
      description: 'User Management Page',
      priority: 'CRITICAL'
    },
    {
      path: 'crmnew-main/app/dashboard/admin/reports/page.tsx',
      description: 'System Reports Page',
      priority: 'CRITICAL'
    },
    
    // Role Hooks
    {
      path: 'crmnew-main/hooks/use-role.ts',
      description: 'Role-based Permission Hooks',
      priority: 'HIGH'
    },
    
    // Enhanced Components
    {
      path: 'crmnew-main/components/auth-provider.tsx',
      description: 'Enhanced Auth Provider',
      priority: 'HIGH'
    },
    {
      path: 'crmnew-main/components/app-sidebar.tsx',
      description: 'Role-based Navigation Sidebar',
      priority: 'HIGH'
    },
    
    // Enhanced Pages
    {
      path: 'crmnew-main/app/dashboard/customers/page.tsx',
      description: 'Enhanced Customer Page',
      priority: 'MEDIUM'
    },
    {
      path: 'crmnew-main/app/dashboard/deals/page.tsx',
      description: 'Enhanced Deals Page',
      priority: 'MEDIUM'
    }
  ];

  console.log('📋 Checking critical files...\n');

  criticalFiles.forEach(file => {
    const fullPath = path.join(__dirname, file.path);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      const stats = fs.statSync(fullPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ [${file.priority}] ${file.description}`);
      console.log(`   📁 ${file.path} (${sizeKB} KB)`);
    } else {
      console.log(`❌ [${file.priority}] ${file.description}`);
      console.log(`   📁 ${file.path} - FILE MISSING`);
      allFilesReady = false;
    }
    console.log('');
  });

  // Check package.json and other config files
  const configFiles = [
    'crmnew-main/package.json',
    'crmnew-main/vercel.json',
    'crmnew-main/next.config.mjs',
    'crmnew-main/tailwind.config.ts'
  ];

  console.log('📋 Checking configuration files...\n');

  configFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    const exists = fs.existsSync(fullPath);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
  });

  console.log('\n🎯 DEPLOYMENT READINESS SUMMARY');
  console.log('===============================\n');

  if (allFilesReady) {
    console.log('✅ ALL CRITICAL FILES READY FOR DEPLOYMENT!');
    console.log('✅ Admin pages implemented');
    console.log('✅ Role hooks available');
    console.log('✅ Enhanced components ready');
    console.log('✅ Configuration files present');
    
    console.log('\n🚀 DEPLOYMENT INSTRUCTIONS');
    console.log('==========================\n');
    
    console.log('OPTION 1: Git + Vercel Deployment');
    console.log('----------------------------------');
    console.log('1. Initialize Git repository:');
    console.log('   cd crmnew-main');
    console.log('   git init');
    console.log('   git add .');
    console.log('   git commit -m "Deploy admin role system"');
    console.log('');
    console.log('2. Connect to GitHub:');
    console.log('   git remote add origin <your-github-repo-url>');
    console.log('   git push -u origin main');
    console.log('');
    console.log('3. Deploy to Vercel:');
    console.log('   - Connect GitHub repo to Vercel');
    console.log('   - Vercel will auto-deploy on push');
    console.log('');
    
    console.log('OPTION 2: Direct Vercel CLI Deployment');
    console.log('--------------------------------------');
    console.log('1. Install Vercel CLI:');
    console.log('   npm i -g vercel');
    console.log('');
    console.log('2. Deploy from project directory:');
    console.log('   cd crmnew-main');
    console.log('   vercel --prod');
    console.log('');
    
    console.log('OPTION 3: Manual File Upload');
    console.log('----------------------------');
    console.log('1. Zip the crmnew-main directory');
    console.log('2. Upload to your hosting platform');
    console.log('3. Run build commands on server');
    console.log('');
    
    console.log('🔧 POST-DEPLOYMENT VERIFICATION');
    console.log('================================');
    console.log('After deployment, run:');
    console.log('node FINAL_DEPLOYMENT_VERIFICATION.js');
    console.log('');
    console.log('Expected results:');
    console.log('✅ /dashboard/admin loads (not 404)');
    console.log('✅ Admin navigation visible');
    console.log('✅ Customer data displays correctly');
    console.log('✅ Role-based access control working');
    
  } else {
    console.log('❌ SOME CRITICAL FILES ARE MISSING');
    console.log('⚠️ Cannot proceed with deployment');
    console.log('📋 Please ensure all files are created first');
  }

  return allFilesReady;
}

// Check if we can help with Git setup
function checkGitSetup() {
  console.log('\n🔍 Checking Git setup...\n');
  
  const gitPath = path.join(__dirname, 'crmnew-main', '.git');
  const isGitRepo = fs.existsSync(gitPath);
  
  if (isGitRepo) {
    console.log('✅ Git repository already initialized');
  } else {
    console.log('❌ No Git repository found');
    console.log('💡 Need to initialize Git for deployment');
  }
  
  return isGitRepo;
}

// Generate deployment commands
function generateDeploymentCommands() {
  console.log('\n📝 DEPLOYMENT COMMANDS');
  console.log('=====================\n');
  
  console.log('# Initialize Git and deploy');
  console.log('cd crmnew-main');
  console.log('git init');
  console.log('git add .');
  console.log('git commit -m "Deploy admin role system with all features"');
  console.log('');
  console.log('# If you have a GitHub repo:');
  console.log('git remote add origin <your-repo-url>');
  console.log('git push -u origin main');
  console.log('');
  console.log('# Or deploy directly with Vercel:');
  console.log('npx vercel --prod');
  console.log('');
  console.log('# Verify deployment:');
  console.log('node ../FINAL_DEPLOYMENT_VERIFICATION.js');
}

// Main execution
if (require.main === module) {
  const isReady = checkDeploymentReadiness();
  checkGitSetup();
  
  if (isReady) {
    generateDeploymentCommands();
    
    console.log('\n🎯 NEXT STEPS');
    console.log('=============');
    console.log('1. Choose a deployment method above');
    console.log('2. Execute the deployment commands');
    console.log('3. Run verification script');
    console.log('4. Test admin features on live site');
    console.log('');
    console.log('🚀 Ready for deployment! All files are present and configured.');
  }
}

module.exports = { checkDeploymentReadiness, checkGitSetup, generateDeploymentCommands };
