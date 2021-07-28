// import db from './db'
import { getDB } from './db'
import { getCandidatesQuery } from './sqlCommands'

async function getCandidates() {
    const db = await getDB()

    // try {
    //     return await db.user.findMany()
    // } catch (err) {
    //     console.log('MySQL error ', err)
    //     return null
    // }
}

export default getCandidates