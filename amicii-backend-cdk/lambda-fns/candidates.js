"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function candidates(userId) {
    const db = await db_1.getDB();
    try {
        return await db.user.findMany({
            where: {
                id: {
                    not: userId,
                },
                likedRelation: {
                    none: {
                        id: userId,
                    },
                },
                dislikedRelation: {
                    none: {
                        id: userId,
                    },
                },
                disliked: {
                    none: {
                        id: userId,
                    },
                },
            },
            include: {
                features: {
                    select: {
                        emoji: true,
                    },
                },
            },
        });
    }
    catch (err) {
        console.log(err);
        return [];
    }
}
exports.default = candidates;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhbmRpZGF0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsS0FBSyxVQUFVLFVBQVUsQ0FBQyxNQUFjO0lBQ3RDLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFDeEIsSUFBSTtRQUNGLE9BQU8sTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM1QixLQUFLLEVBQUU7Z0JBQ0wsRUFBRSxFQUFFO29CQUNGLEdBQUcsRUFBRSxNQUFNO2lCQUNaO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUU7d0JBQ0osRUFBRSxFQUFFLE1BQU07cUJBQ1g7aUJBQ0Y7Z0JBQ0QsZ0JBQWdCLEVBQUU7b0JBQ2hCLElBQUksRUFBRTt3QkFDSixFQUFFLEVBQUUsTUFBTTtxQkFDWDtpQkFDRjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFO3dCQUNKLEVBQUUsRUFBRSxNQUFNO3FCQUNYO2lCQUNGO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFO29CQUNSLE1BQU0sRUFBRTt3QkFDTixLQUFLLEVBQUUsSUFBSTtxQkFDWjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFBO0tBQ0g7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDaEIsT0FBTyxFQUFFLENBQUE7S0FDVjtBQUNILENBQUM7QUFFRCxrQkFBZSxVQUFVLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREQiB9IGZyb20gJy4vZGInXG5cbmFzeW5jIGZ1bmN0aW9uIGNhbmRpZGF0ZXModXNlcklkOiBzdHJpbmcpIHtcbiAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRiLnVzZXIuZmluZE1hbnkoe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgaWQ6IHtcbiAgICAgICAgICBub3Q6IHVzZXJJZCxcbiAgICAgICAgfSxcbiAgICAgICAgbGlrZWRSZWxhdGlvbjoge1xuICAgICAgICAgIG5vbmU6IHtcbiAgICAgICAgICAgIGlkOiB1c2VySWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZGlzbGlrZWRSZWxhdGlvbjoge1xuICAgICAgICAgIG5vbmU6IHtcbiAgICAgICAgICAgIGlkOiB1c2VySWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZGlzbGlrZWQ6IHtcbiAgICAgICAgICBub25lOiB7XG4gICAgICAgICAgICBpZDogdXNlcklkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgaW5jbHVkZToge1xuICAgICAgICBmZWF0dXJlczoge1xuICAgICAgICAgIHNlbGVjdDoge1xuICAgICAgICAgICAgZW1vamk6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNhbmRpZGF0ZXNcbiJdfQ==