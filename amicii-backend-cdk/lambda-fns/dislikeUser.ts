import { getDB } from './db'

async function dislikeUser(userId: string, dislikedUserId: string) {
  const db = await getDB()
  try {
    return await db.user.update({
      where: { id: userId },
      data: {
        disliked: {
          connect: { id: dislikedUserId },
        },
      },
    })
  } catch (err) {
    console.log('MySQL error: ', err)
    return null
  }
}

export default dislikeUser
