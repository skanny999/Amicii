"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function matches(userId) {
    const db = await db_1.getDB();
    try {
        const myMatches = await db.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                liked: {
                    where: {
                        liked: {
                            some: {
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
                },
            },
        });
        return myMatches === null || myMatches === void 0 ? void 0 : myMatches.liked;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}
exports.default = matches;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hdGNoZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsS0FBSyxVQUFVLE9BQU8sQ0FBQyxNQUFjO0lBQ25DLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFDeEIsSUFBSTtRQUNGLE1BQU0sU0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDeEMsS0FBSyxFQUFFO2dCQUNMLEVBQUUsRUFBRSxNQUFNO2FBQ1g7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFO29CQUNMLEtBQUssRUFBRTt3QkFDTCxLQUFLLEVBQUU7NEJBQ0wsSUFBSSxFQUFFO2dDQUNKLEVBQUUsRUFBRSxNQUFNOzZCQUNYO3lCQUNGO3FCQUNGO29CQUNELE9BQU8sRUFBRTt3QkFDUCxRQUFRLEVBQUU7NEJBQ1IsTUFBTSxFQUFFO2dDQUNOLEtBQUssRUFBRSxJQUFJOzZCQUNaO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUE7UUFDRixPQUFPLFNBQVMsYUFBVCxTQUFTLHVCQUFULFNBQVMsQ0FBRSxLQUFLLENBQUE7S0FDeEI7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDaEIsT0FBTyxFQUFFLENBQUE7S0FDVjtBQUNILENBQUM7QUFFRCxrQkFBZSxPQUFPLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREQiB9IGZyb20gJy4vZGInXG5cbmFzeW5jIGZ1bmN0aW9uIG1hdGNoZXModXNlcklkOiBzdHJpbmcpIHtcbiAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gIHRyeSB7XG4gICAgY29uc3QgbXlNYXRjaGVzID0gYXdhaXQgZGIudXNlci5maW5kRmlyc3Qoe1xuICAgICAgd2hlcmU6IHtcbiAgICAgICAgaWQ6IHVzZXJJZCxcbiAgICAgIH0sXG4gICAgICBzZWxlY3Q6IHtcbiAgICAgICAgbGlrZWQ6IHtcbiAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgbGlrZWQ6IHtcbiAgICAgICAgICAgICAgc29tZToge1xuICAgICAgICAgICAgICAgIGlkOiB1c2VySWQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgaW5jbHVkZToge1xuICAgICAgICAgICAgZmVhdHVyZXM6IHtcbiAgICAgICAgICAgICAgc2VsZWN0OiB7XG4gICAgICAgICAgICAgICAgZW1vamk6IHRydWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pXG4gICAgcmV0dXJuIG15TWF0Y2hlcz8ubGlrZWRcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hdGNoZXNcbiJdfQ==