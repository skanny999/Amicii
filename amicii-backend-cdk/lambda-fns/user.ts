// import db from './db'
import candidates from './candidates'
import { getDB } from './db'
import matches from './matches'
import { getCandidatesQuery } from './sqlCommands'
import { User } from './types'

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