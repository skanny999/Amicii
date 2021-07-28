// import db from './db'
import { getDB } from './db'
import User from './User'
import { createUserQuery } from './sqlCommands'
const { v4: uuid } = require('uuid')

async function createUser(user: User) {
    const db = await getDB()
    if (!user.id) user.id = uuid()
    const { id, username, age, bio, profileEmoji } = user
    try {
        await db.user.create({ data: user})
        return user
    } catch (err) {
        console.log('MySQL error: ', err)
        return null
    }
}

export default createUser