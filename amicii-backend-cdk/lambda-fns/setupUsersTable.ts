import db from './db'
import { createUsersTableQuery } from './sqlCommands'

async function setupUsersTable() {
    try {
        await db.query(createUsersTableQuery)
        return true
    } catch (e) {
        console.log('MySQL error: ', e)
        return false
    }
}

export default setupUsersTable;