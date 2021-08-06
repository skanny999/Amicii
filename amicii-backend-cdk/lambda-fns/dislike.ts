import { getDB } from './db'

async function dislike(userId: string, dislikedUserId: string) {
    const db = await getDB()
    const dislike = await db.dislikes.create({
        data: {
            userId: userId,
            dislikedUserId: dislikedUserId
        }
    })
}

export default dislike