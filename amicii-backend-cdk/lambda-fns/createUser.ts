import db from './db'
import User from './User'
import { createUserQuery } from './sqlCommands'
const { v4: uuid } = require('uuid')

async function createUser(user: User) {
    if (!user.id) user.id = uuid()
    const { id, username, age, bio, profileEmoji } = user
    try {
        await db.query(createUserQuery,{ id, username, age, bio, profileEmoji })
        return user
    } catch (err) {
        console.log('MySQL error: ', err)
        return null
    }
}

export default createUser