import db from './db'
import { getCandidatesQuery } from './sqlCommands'

async function getCandidates() {
    // Todo: implement get candidates
    try {
        const result = await db.query(getCandidatesQuery)
        return result.records
    } catch (err) {
        console.log('MySQL error ', err)
        return null
    }
}

export default getCandidates