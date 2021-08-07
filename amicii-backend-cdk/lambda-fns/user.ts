import { getDB } from './db'

async function user(userId: string) {
    const db = await getDB()
    try {
        return await db.user.findUnique({ 
                where: { id: userId },
                include: {
                    features: {
                    select: {
                        emoji: true,
                    }
                }
             } 
            }
        )
      } catch (err) {
        console.log('MySQL error: ', err)
        return null
      }
}

export default user