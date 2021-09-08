import { getDB } from './db'

async function candidates(userId: string) {
  const db = await getDB()
  try {
    return await db.user.findMany({
      where: {
        id: {
          not: userId,
        },
        likedRelation: {
          none: {
            id: userId,
          },
        },
        dislikedRelation: {
          none: {
            id: userId,
          },
        },
        disliked: {
          none: {
            id: userId,
          },
        },
      },
      include: {
        features: true,
      },
    })
  } catch (err) {
    console.log(err)
    return []
  }
}

export default candidates
