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
                        features: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hdGNoZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsS0FBSyxVQUFVLE9BQU8sQ0FBQyxNQUFjO0lBQ25DLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFDeEIsSUFBSTtRQUNGLE1BQU0sU0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDeEMsS0FBSyxFQUFFO2dCQUNMLEVBQUUsRUFBRSxNQUFNO2FBQ1g7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFO29CQUNMLEtBQUssRUFBRTt3QkFDTCxLQUFLLEVBQUU7NEJBQ0wsSUFBSSxFQUFFO2dDQUNKLEVBQUUsRUFBRSxNQUFNOzZCQUNYO3lCQUNGO3FCQUNGO29CQUNELE9BQU8sRUFBRTt3QkFDUCxRQUFRLEVBQUUsSUFBSTtxQkFDZjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxTQUFTLGFBQVQsU0FBUyx1QkFBVCxTQUFTLENBQUUsS0FBSyxDQUFBO0tBQ3hCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2hCLE9BQU8sRUFBRSxDQUFBO0tBQ1Y7QUFDSCxDQUFDO0FBRUQsa0JBQWUsT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0REIgfSBmcm9tICcuL2RiJ1xuXG5hc3luYyBmdW5jdGlvbiBtYXRjaGVzKHVzZXJJZDogc3RyaW5nKSB7XG4gIGNvbnN0IGRiID0gYXdhaXQgZ2V0REIoKVxuICB0cnkge1xuICAgIGNvbnN0IG15TWF0Y2hlcyA9IGF3YWl0IGRiLnVzZXIuZmluZEZpcnN0KHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIGlkOiB1c2VySWQsXG4gICAgICB9LFxuICAgICAgc2VsZWN0OiB7XG4gICAgICAgIGxpa2VkOiB7XG4gICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgIGxpa2VkOiB7XG4gICAgICAgICAgICAgIHNvbWU6IHtcbiAgICAgICAgICAgICAgICBpZDogdXNlcklkLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgICAgIGZlYXR1cmVzOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pXG4gICAgcmV0dXJuIG15TWF0Y2hlcz8ubGlrZWRcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKVxuICAgIHJldHVybiBbXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hdGNoZXNcbiJdfQ==