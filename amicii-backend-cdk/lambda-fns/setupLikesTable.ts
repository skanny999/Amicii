import db from './db'

async function setupLikesTable() {
    try {
        const query = 'CREATE TABLE likes(\n' +
            '    userId integer,\n' +
            '    likedUserId integer\n' +
            ');'
        await db.query(query)
        return true
    } catch (e) {
        console.log('MySQL error: ', e)
        return false
    }
}

export default setupLikesTable