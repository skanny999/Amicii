import { getDB } from './db'
import {
  addDislikedUsersForeingKeyA,
  addDislikedUsersForeingKeyB,
  addLikedUsersForeingKeyA,
  addLikedUsersForeingKeyB,
  createDislikedUsersRelationQuery,
  createLikedUsersRelationQuery,
  createUsersTableQuery,
} from './sqlCommands'

async function setupUsersTable() {
  const db = await getDB()
  try {
    await Promise.all([
      db.$queryRaw(createUsersTableQuery),
      db.$queryRaw(createLikedUsersRelationQuery),
      db.$queryRaw(createDislikedUsersRelationQuery),
      db.$queryRaw(addLikedUsersForeingKeyA),
      db.$queryRaw(addLikedUsersForeingKeyB),
      db.$queryRaw(addDislikedUsersForeingKeyA),
      db.$queryRaw(addDislikedUsersForeingKeyB),
    ])
    return true
  } catch (e) {
    console.log('MySQL error: ', e)
    return false
  }
}

export default setupUsersTable
