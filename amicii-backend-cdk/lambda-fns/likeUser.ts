import { getDB } from './db'

async function likeUser(userId: string, likedUserId: string) {
  const db = await getDB()
  try {
    return await db.user.update({
      where: { id: userId },
      data: {
        liked: {
          connect: { id: likedUserId },
        },
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export default likeUser
