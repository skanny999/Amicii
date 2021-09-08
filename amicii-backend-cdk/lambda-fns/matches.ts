import { getDB } from './db'

async function matches(userId: string) {
  const db = await getDB()
  try {
    const myMatches = await db.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        liked: {
          where: {
            liked: {
              some: {
                id: userId,
              },
            },
          },
          include: {
            features: true,
          },
        },
      },
    })
    return myMatches?.liked
  } catch (err) {
    console.log(err)
    return []
  }
}

export default matches
