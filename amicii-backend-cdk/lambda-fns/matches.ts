import { getDB } from './db'

async function matches(userId: string) {
    const db = await getDB()

    const allMatchesIds = await db.$queryRaw`SELECT AU.ID
    FROM User  AU
    JOIN (SELECT B.USERID FROM
    Likes A
    JOIN
    Likes B
    ON A.USERID = B.LIKEDUSERID
    WHERE A.USERID = ${userId}
    AND B.USERID = A.LIKEDUSERID
    AND A.USERID = B.LIKEDUSERID) MU
    ON AU.ID = MU.USERID;`

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