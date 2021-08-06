// import db from './db'
import { getDB } from './db'
import { getCandidatesQuery } from './sqlCommands'

async function candidates(userId: string) {
    const db = await getDB()

    const allCandidatesIds = await db.$queryRaw`SELECT AU.ID
    FROM USER AU
    WHERE AU.ID NOT LIKE ${userId}          -- NOT ME
    AND AU.ID NOT IN (SELECT DISLIKEDUSERID -- NOT A USER I ALREADY LIKE
      FROM USER A, DISLIKES
      WHERE A.ID = ${userId}
      AND A.ID = DISLIKES.USERID)
    AND AU.ID NOT IN (SELECT ID             -- NOT A USER I DISLIKE
      FROM USER
      JOIN (SELECT DISTINCT LIKEDUSERID
            FROM USER A, LIKES
            WHERE A.ID = ${userId}
            AND A.ID = LIKES.USERID) B
      ON USER.ID = B.LIKEDUSERID)
    AND AU.ID NOT IN (SELECT U.ID           -- NOT A USER THAT DISLIKES ME
        FROM USER U, DISLIKES D
        WHERE U.ID = D.USERID
        AND D.DISLIKEDUSERID = ${userId});`

    const allCandidates = await db.user.findMany({
        where: { 
            id: {
                in: allCandidatesIds.map((item: { ID: string }) => item.ID)
            }
        }
    })
    return allCandidates
}

export default candidates