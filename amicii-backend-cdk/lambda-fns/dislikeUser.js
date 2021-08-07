"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function dislikeUser(userId, dislikedUserId) {
    const db = await db_1.getDB();
    try {
        return await db.dislikes.create({
            data: {
                userId: userId,
                dislikedUserId: dislikedUserId
            }
        });
    }
    catch (err) {
        console.log('MySQL error: ', err);
        return null;
    }
}
exports.default = dislikeUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzbGlrZVVzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaXNsaWtlVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixLQUFLLFVBQVUsV0FBVyxDQUFDLE1BQWMsRUFBRSxjQUFzQjtJQUM3RCxNQUFNLEVBQUUsR0FBRyxNQUFNLFVBQUssRUFBRSxDQUFBO0lBQ3hCLElBQUk7UUFDQSxPQUFPLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDNUIsSUFBSSxFQUFFO2dCQUNGLE1BQU0sRUFBRSxNQUFNO2dCQUNkLGNBQWMsRUFBRSxjQUFjO2FBQ2pDO1NBQ0osQ0FBQyxDQUFBO0tBQ0w7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ2pDLE9BQU8sSUFBSSxDQUFBO0tBQ2Q7QUFDTCxDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0REIgfSBmcm9tICcuL2RiJ1xuXG5hc3luYyBmdW5jdGlvbiBkaXNsaWtlVXNlcih1c2VySWQ6IHN0cmluZywgZGlzbGlrZWRVc2VySWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0REIoKVxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBkYi5kaXNsaWtlcy5jcmVhdGUoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgICAgIGRpc2xpa2VkVXNlcklkOiBkaXNsaWtlZFVzZXJJZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZygnTXlTUUwgZXJyb3I6ICcsIGVycilcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpc2xpa2VVc2VyIl19