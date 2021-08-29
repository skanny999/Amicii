import { getDB } from './db'

async function features(userId: string) {
  const db = await getDB()
  try {
    return await db.features.findMany({
      where: {
        A_User: {
          every: {
            id: userId,
          },
        },
      },
    })
  } catch (err) {
    console.log(err)
    return null
  }
}

export default features
