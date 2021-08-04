import { getDB } from './db'
import { createLikesTableQuery } from './sqlCommands'

async function setupLikesTable() {
    const db = await getDB()
    try {
        await db.$queryRaw(createLikesTableQuery)
        return true
    } catch (e) {
        console.log('MySQL error: ', e)
        return false
    }
}

export default setupLikesTable