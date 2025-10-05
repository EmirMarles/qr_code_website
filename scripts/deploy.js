#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process...');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if build was successful
  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) {
    throw new Error('Build directory not found');
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Build files are ready in the build/ directory');
  console.log('');
  console.log('🎯 Next steps:');
  console.log('1. Push your code to GitHub/GitLab');
  console.log('2. Connect your repository to Render');
  console.log('3. Configure environment variables in Render');
  console.log('4. Deploy!');
  console.log('');
  console.log('📋 Environment variables to set in Render:');
  console.log('REACT_APP_API_URL=https://bookme-backend-536445311459.europe-central2.run.app/api');
  console.log('NODE_ENV=production');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
