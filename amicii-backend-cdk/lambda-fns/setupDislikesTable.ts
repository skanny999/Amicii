import { getDB } from './db'
import { createDislikesTableQuery } from './sqlCommands'

async function setupDislikesTable() {
  const db = await getDB()
  try {
    await db.$queryRaw(createDislikesTableQuery)
    return true
  } catch (e) {
    console.log('MySQL error: ', e)
    return false
  }
}

export default setupDislikesTable
