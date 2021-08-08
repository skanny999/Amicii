import { getDB } from './db'
import { matchesQuery } from './sqlCommands'

async function matches(userId: string) {
    const db = await getDB()
    try {
        const allMatchesIds = await db.$queryRaw(matchesQuery(userId))
        const allMatches = await db.user.findMany({
            where: { 
                id: {
                    in: allMatchesIds.map((item: { ID: string }) => item.ID)
                }
            },
            include: {
                features: true
            }
        })
        return allMatches
    } catch (err) {
        console.log(err)
        return null
    }
}

export default matches