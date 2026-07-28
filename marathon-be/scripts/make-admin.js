/**
 * make-admin.js
 * Promotes a user account to the "admin" role.
 * Usage: node scripts/make-admin.js <email>
 * Example: node scripts/make-admin.js vijaymanoj0000@gmail.com
 */

import 'dotenv/config'
import mongoose from 'mongoose'

const email = process.argv[2]
if (!email) {
  console.error('❌  Usage: node scripts/make-admin.js <email>')
  process.exit(1)
}

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not set. Make sure .env exists in marathon-be/')
  process.exit(1)
}

await mongoose.connect(MONGODB_URI)
console.log('✅  Connected to MongoDB')

const result = await mongoose.connection
  .collection('users')
  .findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { role: 'admin' } },
    { returnDocument: 'after' }
  )

if (!result) {
  console.error(`❌  No user found with email: ${email}`)
  await mongoose.disconnect()
  process.exit(1)
}

console.log(`✅  Success! "${result.fullName}" (${result.email}) is now an admin.`)
await mongoose.disconnect()
process.exit(0)
