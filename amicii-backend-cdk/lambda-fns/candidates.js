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
                features: true,
            },
        });
    }
    catch (err) {
        console.log(err);
        return [];
    }
}
exports.default = candidates;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhbmRpZGF0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsS0FBSyxVQUFVLFVBQVUsQ0FBQyxNQUFjO0lBQ3RDLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFDeEIsSUFBSTtRQUNGLE9BQU8sTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM1QixLQUFLLEVBQUU7Z0JBQ0wsRUFBRSxFQUFFO29CQUNGLEdBQUcsRUFBRSxNQUFNO2lCQUNaO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUU7d0JBQ0osRUFBRSxFQUFFLE1BQU07cUJBQ1g7aUJBQ0Y7Z0JBQ0QsZ0JBQWdCLEVBQUU7b0JBQ2hCLElBQUksRUFBRTt3QkFDSixFQUFFLEVBQUUsTUFBTTtxQkFDWDtpQkFDRjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFO3dCQUNKLEVBQUUsRUFBRSxNQUFNO3FCQUNYO2lCQUNGO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGLENBQUMsQ0FBQTtLQUNIO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2hCLE9BQU8sRUFBRSxDQUFBO0tBQ1Y7QUFDSCxDQUFDO0FBRUQsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0REIgfSBmcm9tICcuL2RiJ1xuXG5hc3luYyBmdW5jdGlvbiBjYW5kaWRhdGVzKHVzZXJJZDogc3RyaW5nKSB7XG4gIGNvbnN0IGRiID0gYXdhaXQgZ2V0REIoKVxuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBkYi51c2VyLmZpbmRNYW55KHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIGlkOiB7XG4gICAgICAgICAgbm90OiB1c2VySWQsXG4gICAgICAgIH0sXG4gICAgICAgIGxpa2VkUmVsYXRpb246IHtcbiAgICAgICAgICBub25lOiB7XG4gICAgICAgICAgICBpZDogdXNlcklkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGRpc2xpa2VkUmVsYXRpb246IHtcbiAgICAgICAgICBub25lOiB7XG4gICAgICAgICAgICBpZDogdXNlcklkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGRpc2xpa2VkOiB7XG4gICAgICAgICAgbm9uZToge1xuICAgICAgICAgICAgaWQ6IHVzZXJJZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgZmVhdHVyZXM6IHRydWUsXG4gICAgICB9LFxuICAgIH0pXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUubG9nKGVycilcbiAgICByZXR1cm4gW11cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjYW5kaWRhdGVzXG4iXX0=