import { getDB } from './db'
import { User } from './types'

async function createUser(newUser: User) {
    const db = await getDB()

    let user = {
        id: newUser.id,
        features: {
            connect : [
                { id: 1},
                { id: 2},
                { id: 3},
                { id: 4},
                { id: 5},
                { id: 6},
                { id: 7},
                { id: 8},
                { id: 9},
                { id: 10},
            ]
        }
    }

    try {
        await db.user.create({ data: user})
        return user
    } catch (err) {
        console.log('MySQL error: ', err)
        return null
    }
}

export default createUser