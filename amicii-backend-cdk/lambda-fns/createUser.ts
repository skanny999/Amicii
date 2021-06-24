import db from './db'
import User from './User'
const { v4: uuid } = require('uuid')

async function createUser(user: User) {
    if (!user.id) user.id = uuid()
    const { id, username, age, bio, profileEmojii } = user
    try {
        const query = 'INSERT INTO users (id, username, age, bio, profileEmojii) ' +
            'VALUES (:id, :username, :age, :bio, :profileEmojii)'
        await db.query(query,{ id, username, age, bio, profileEmojii })
        return user
    } catch (err) {
        console.log('MySQL error: ', err)
        return null
    }
}

export default createUser