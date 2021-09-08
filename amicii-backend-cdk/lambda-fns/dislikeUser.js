"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function dislikeUser(userId, dislikedUserId) {
    const db = await db_1.getDB();
    try {
        return await db.user.update({
            where: { id: userId },
            data: {
                disliked: {
                    connect: { id: dislikedUserId },
                },
            },
        });
    }
    catch (err) {
        console.log('MySQL error: ', err);
        return null;
    }
}
exports.default = dislikeUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzbGlrZVVzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaXNsaWtlVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixLQUFLLFVBQVUsV0FBVyxDQUFDLE1BQWMsRUFBRSxjQUFzQjtJQUMvRCxNQUFNLEVBQUUsR0FBRyxNQUFNLFVBQUssRUFBRSxDQUFBO0lBQ3hCLElBQUk7UUFDRixPQUFPLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDMUIsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtZQUNyQixJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFO29CQUNSLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUU7aUJBQ2hDO2FBQ0Y7U0FDRixDQUFDLENBQUE7S0FDSDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDakMsT0FBTyxJQUFJLENBQUE7S0FDWjtBQUNILENBQUM7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREQiB9IGZyb20gJy4vZGInXG5cbmFzeW5jIGZ1bmN0aW9uIGRpc2xpa2VVc2VyKHVzZXJJZDogc3RyaW5nLCBkaXNsaWtlZFVzZXJJZDogc3RyaW5nKSB7XG4gIGNvbnN0IGRiID0gYXdhaXQgZ2V0REIoKVxuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBkYi51c2VyLnVwZGF0ZSh7XG4gICAgICB3aGVyZTogeyBpZDogdXNlcklkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGRpc2xpa2VkOiB7XG4gICAgICAgICAgY29ubmVjdDogeyBpZDogZGlzbGlrZWRVc2VySWQgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coJ015U1FMIGVycm9yOiAnLCBlcnIpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNsaWtlVXNlclxuIl19