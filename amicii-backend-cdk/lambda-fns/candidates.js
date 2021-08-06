"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import db from './db'
const db_1 = require("./db");
async function candidates(userId) {
    const db = await db_1.getDB();
    const allCandidatesIds = await db.$queryRaw `SELECT AU.ID
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
        AND D.DISLIKEDUSERID = ${userId});`;
    const allCandidates = await db.user.findMany({
        where: {
            id: {
                in: allCandidatesIds.map((item) => item.ID)
            }
        }
    });
    return allCandidates;
}
exports.default = candidates;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhbmRpZGF0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3QkFBd0I7QUFDeEIsNkJBQTRCO0FBRzVCLEtBQUssVUFBVSxVQUFVLENBQUMsTUFBYztJQUNwQyxNQUFNLEVBQUUsR0FBRyxNQUFNLFVBQUssRUFBRSxDQUFBO0lBRXhCLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFBOzsyQkFFcEIsTUFBTTs7O3FCQUdaLE1BQU07Ozs7OzsyQkFNQSxNQUFNOzs7Ozs7aUNBTUEsTUFBTSxJQUFJLENBQUE7SUFFdkMsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN6QyxLQUFLLEVBQUU7WUFDSCxFQUFFLEVBQUU7Z0JBQ0EsRUFBRSxFQUFFLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQW9CLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7YUFDOUQ7U0FDSjtLQUNKLENBQUMsQ0FBQTtJQUNGLE9BQU8sYUFBYSxDQUFBO0FBQ3hCLENBQUM7QUFFRCxrQkFBZSxVQUFVLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgZGIgZnJvbSAnLi9kYidcbmltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcbmltcG9ydCB7IGdldENhbmRpZGF0ZXNRdWVyeSB9IGZyb20gJy4vc3FsQ29tbWFuZHMnXG5cbmFzeW5jIGZ1bmN0aW9uIGNhbmRpZGF0ZXModXNlcklkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERCKClcblxuICAgIGNvbnN0IGFsbENhbmRpZGF0ZXNJZHMgPSBhd2FpdCBkYi4kcXVlcnlSYXdgU0VMRUNUIEFVLklEXG4gICAgRlJPTSBVU0VSIEFVXG4gICAgV0hFUkUgQVUuSUQgTk9UIExJS0UgJHt1c2VySWR9ICAgICAgICAgIC0tIE5PVCBNRVxuICAgIEFORCBBVS5JRCBOT1QgSU4gKFNFTEVDVCBESVNMSUtFRFVTRVJJRCAtLSBOT1QgQSBVU0VSIEkgQUxSRUFEWSBMSUtFXG4gICAgICBGUk9NIFVTRVIgQSwgRElTTElLRVNcbiAgICAgIFdIRVJFIEEuSUQgPSAke3VzZXJJZH1cbiAgICAgIEFORCBBLklEID0gRElTTElLRVMuVVNFUklEKVxuICAgIEFORCBBVS5JRCBOT1QgSU4gKFNFTEVDVCBJRCAgICAgICAgICAgICAtLSBOT1QgQSBVU0VSIEkgRElTTElLRVxuICAgICAgRlJPTSBVU0VSXG4gICAgICBKT0lOIChTRUxFQ1QgRElTVElOQ1QgTElLRURVU0VSSURcbiAgICAgICAgICAgIEZST00gVVNFUiBBLCBMSUtFU1xuICAgICAgICAgICAgV0hFUkUgQS5JRCA9ICR7dXNlcklkfVxuICAgICAgICAgICAgQU5EIEEuSUQgPSBMSUtFUy5VU0VSSUQpIEJcbiAgICAgIE9OIFVTRVIuSUQgPSBCLkxJS0VEVVNFUklEKVxuICAgIEFORCBBVS5JRCBOT1QgSU4gKFNFTEVDVCBVLklEICAgICAgICAgICAtLSBOT1QgQSBVU0VSIFRIQVQgRElTTElLRVMgTUVcbiAgICAgICAgRlJPTSBVU0VSIFUsIERJU0xJS0VTIERcbiAgICAgICAgV0hFUkUgVS5JRCA9IEQuVVNFUklEXG4gICAgICAgIEFORCBELkRJU0xJS0VEVVNFUklEID0gJHt1c2VySWR9KTtgXG5cbiAgICBjb25zdCBhbGxDYW5kaWRhdGVzID0gYXdhaXQgZGIudXNlci5maW5kTWFueSh7XG4gICAgICAgIHdoZXJlOiB7IFxuICAgICAgICAgICAgaWQ6IHtcbiAgICAgICAgICAgICAgICBpbjogYWxsQ2FuZGlkYXRlc0lkcy5tYXAoKGl0ZW06IHsgSUQ6IHN0cmluZyB9KSA9PiBpdGVtLklEKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYWxsQ2FuZGlkYXRlc1xufVxuXG5leHBvcnQgZGVmYXVsdCBjYW5kaWRhdGVzIl19