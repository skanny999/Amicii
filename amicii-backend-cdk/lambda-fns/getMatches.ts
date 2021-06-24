import db from './db'

async function getMatches() {
    // Todo: implement get candidates
    try {
        const query = 'SELECT * FROM users'
        const result = await db.query(query)
        return result.records
    } catch (err) {
        console.log('MySQL error ', err)
        return null
    }
}

export default getMatches