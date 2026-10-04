#!/usr/bin/env node
/**
 * Password hashing utility for seeding admin accounts
 *
 * Usage:
 *   node scripts/hash-password.js "your-password-here"
 *
 * Output: Bcrypt hash ready for INSERT into admins table
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js "password"');
  process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
  console.log('Bcrypt hash:');
  console.log(hash);
  console.log('\nSQL to INSERT:');
  console.log(`INSERT INTO admins (username, password, created_at) VALUES ('admin', '${hash}', NOW());`);
}).catch(err => {
  console.error('Error hashing password:', err);
  process.exit(1);
});
