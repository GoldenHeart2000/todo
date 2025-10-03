#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying Collaborative TODO App Setup...\n');

// Check if required files exist
const requiredFiles = [
  'server/package.json',
  'client/package.json',
  'server/prisma/schema.prisma',
  'server/src/index.js',
  'client/src/App.jsx',
  'README.md'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check the setup.');
  process.exit(1);
}

// Check if node_modules exist
console.log('\n📦 Checking dependencies...');
if (fs.existsSync('server/node_modules')) {
  console.log('✅ Server dependencies installed');
} else {
  console.log('❌ Server dependencies not installed - run: cd server && npm install');
}

if (fs.existsSync('client/node_modules')) {
  console.log('✅ Client dependencies installed');
} else {
  console.log('❌ Client dependencies not installed - run: cd client && npm install');
}

// Check environment file
console.log('\n🔧 Checking environment setup...');
if (fs.existsSync('server/.env')) {
  console.log('✅ Server .env file exists');
} else {
  console.log('❌ Server .env file missing - copy .env.example and configure');
}

// Check Prisma client
console.log('\n🗄️ Checking database setup...');
if (fs.existsSync('server/node_modules/.prisma')) {
  console.log('✅ Prisma client generated');
} else {
  console.log('❌ Prisma client not generated - run: cd server && npm run prisma:generate');
}

console.log('\n🎉 Setup verification complete!');
console.log('\n📋 Next steps:');
console.log('1. Configure your .env file with database and Google OAuth credentials');
console.log('2. Run: npm run setup:db');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:5173');
