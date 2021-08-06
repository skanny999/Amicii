import { getDB } from './db'

async function features(userId: string) {
    const db = await getDB()
    return await db.features.findMany({
        where: { 
            A_User: {
                every: {
                    id: userId,
                }
            }
        }
    })
}

export default features