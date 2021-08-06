// import db from './db'
import { getDB } from './db'

async function candidates(userId: string) {
    const db = await getDB()

    const allCandidatesIds = await db.$queryRaw`SELECT AU.ID
    FROM User AU
    WHERE AU.ID NOT LIKE ${userId}          -- NOT ME
    AND AU.ID NOT IN (SELECT DISLIKEDUSERID -- NOT A User I ALREADY LIKE
      FROM User A, Dislikes
      WHERE A.ID = ${userId}
      AND A.ID = Dislikes.USERID)
    AND AU.ID NOT IN (SELECT ID             -- NOT A User I DISLIKE
      FROM User
      JOIN (SELECT DISTINCT LIKEDUSERID
            FROM User A, Likes
            WHERE A.ID = ${userId}
            AND A.ID = Likes.USERID) B
      ON User.ID = B.LIKEDUSERID)
    AND AU.ID NOT IN (SELECT U.ID           -- NOT A User THAT Dislikes ME
        FROM User U, Dislikes D
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