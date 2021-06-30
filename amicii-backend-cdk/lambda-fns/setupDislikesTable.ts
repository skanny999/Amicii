import db from './db'

async function setupDislikesTable() {
    try {
        const query = 'CREATE TABLE dislikes(\n' +
            '    userId integer,\n' +
            '    dislikedUserId integer\n' +
            ');'
        await db.query(query)
        return true
    } catch (e) {
        console.log('MySQL error: ', e)
        return false
    }
}

export default setupDislikesTable