// import db from './db'
import { getDB } from './db'
import { createUsersTableQuery } from './sqlCommands'

async function setupUsersTable() {
    const db = await getDB()
    try {
        await db.$queryRaw(createUsersTableQuery)
        return true
    } catch (e) {
        console.log('MySQL error: ', e)
        return false
    }
}

export default setupUsersTable;