import { getDB } from './db'
import { candidatesQuery } from './sqlCommands'

async function candidates(userId: string) {
  const db = await getDB()
  try {
    const allCandidatesIds = await db.$queryRaw(candidatesQuery(userId))
    const allCandidates = await db.user.findMany({
      where: {
        id: {
          in: allCandidatesIds.map((item: { ID: string }) => item.ID),
        },
      },
      include: {
        features: true,
      },
    })
    return allCandidates
  } catch (err) {
    return null
  }
}

export default candidates
