import { getDB } from './db'

async function likeUser(userId: string, likedUserId: string) {
    const db = await getDB()
    try {
        return await db.likes.create({
            data : {
                userId: userId,
                likedUserId: likedUserId
            }
        })
    } catch (err) {
        console.log(err)
        return null
    }
}

export default likeUser