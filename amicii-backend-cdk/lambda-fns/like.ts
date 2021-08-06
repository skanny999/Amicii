import { getDB } from './db'

async function like(userId: string, likedUserId: string) {
    const db = await getDB()
    const user = await db.likes.create({
        data : {
            userId: userId,
            likedUserId: likedUserId
        }
    })
}

export default like