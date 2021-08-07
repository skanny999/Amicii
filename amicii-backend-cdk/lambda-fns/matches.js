"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const sqlCommands_1 = require("./sqlCommands");
async function matches(userId) {
    const db = await db_1.getDB();
    try {
        const allMatchesIds = await db.$queryRaw(sqlCommands_1.matchesQuery(userId));
        const allMatches = await db.user.findMany({
            where: {
                id: {
                    in: allMatchesIds.map((item) => item.ID)
                }
            }
        });
        return allMatches;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
exports.default = matches;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hdGNoZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsK0NBQTRDO0FBRTVDLEtBQUssVUFBVSxPQUFPLENBQUMsTUFBYztJQUNqQyxNQUFNLEVBQUUsR0FBRyxNQUFNLFVBQUssRUFBRSxDQUFBO0lBQ3hCLElBQUk7UUFDQSxNQUFNLGFBQWEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsMEJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBQzlELE1BQU0sVUFBVSxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDdEMsS0FBSyxFQUFFO2dCQUNILEVBQUUsRUFBRTtvQkFDQSxFQUFFLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQW9CLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7aUJBQzNEO2FBQ0o7U0FDSixDQUFDLENBQUE7UUFDRixPQUFPLFVBQVUsQ0FBQTtLQUNwQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNoQixPQUFPLElBQUksQ0FBQTtLQUNkO0FBQ0wsQ0FBQztBQUVELGtCQUFlLE9BQU8sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcbmltcG9ydCB7IG1hdGNoZXNRdWVyeSB9IGZyb20gJy4vc3FsQ29tbWFuZHMnXG5cbmFzeW5jIGZ1bmN0aW9uIG1hdGNoZXModXNlcklkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERCKClcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBhbGxNYXRjaGVzSWRzID0gYXdhaXQgZGIuJHF1ZXJ5UmF3KG1hdGNoZXNRdWVyeSh1c2VySWQpKVxuICAgICAgICBjb25zdCBhbGxNYXRjaGVzID0gYXdhaXQgZGIudXNlci5maW5kTWFueSh7XG4gICAgICAgICAgICB3aGVyZTogeyBcbiAgICAgICAgICAgICAgICBpZDoge1xuICAgICAgICAgICAgICAgICAgICBpbjogYWxsTWF0Y2hlc0lkcy5tYXAoKGl0ZW06IHsgSUQ6IHN0cmluZyB9KSA9PiBpdGVtLklEKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGFsbE1hdGNoZXNcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbWF0Y2hlcyJdfQ==