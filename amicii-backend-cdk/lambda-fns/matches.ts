import { getDB } from './db'
import { matchesQuery } from './sqlCommands'

async function matches(userId: string) {
    const db = await getDB()
    const allMatchesIds = await db.$queryRaw(matchesQuery(userId))
    const allMatches = await db.user.findMany({
        where: { 
            id: {
                in: allMatchesIds.map((item: { ID: string }) => item.ID)
            }
        }
    })
    return allMatches
}

export default matches