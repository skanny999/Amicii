import { getDB } from './db'

async function dislikeUser(userId: string, dislikedUserId: string) {
  const db = await getDB()
  try {
    return await db.dislikes.create({
      data: {
        userId: userId,
        dislikedUserId: dislikedUserId,
      },
    })
  } catch (err) {
    console.log('MySQL error: ', err)
    return null
  }
}

export default dislikeUser
