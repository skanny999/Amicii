"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function likeUser(userId, likedUserId) {
    const db = await db_1.getDB();
    try {
        return await db.user.update({
            where: { id: userId },
            data: {
                liked: {
                    connect: { id: likedUserId },
                },
            },
        });
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
exports.default = likeUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlrZVVzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaWtlVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixLQUFLLFVBQVUsUUFBUSxDQUFDLE1BQWMsRUFBRSxXQUFtQjtJQUN6RCxNQUFNLEVBQUUsR0FBRyxNQUFNLFVBQUssRUFBRSxDQUFBO0lBQ3hCLElBQUk7UUFDRixPQUFPLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDMUIsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtZQUNyQixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFO29CQUNMLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUU7aUJBQzdCO2FBQ0Y7U0FDRixDQUFDLENBQUE7S0FDSDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNoQixPQUFPLElBQUksQ0FBQTtLQUNaO0FBQ0gsQ0FBQztBQUVELGtCQUFlLFFBQVEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcblxuYXN5bmMgZnVuY3Rpb24gbGlrZVVzZXIodXNlcklkOiBzdHJpbmcsIGxpa2VkVXNlcklkOiBzdHJpbmcpIHtcbiAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRiLnVzZXIudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiB1c2VySWQgfSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgbGlrZWQ6IHtcbiAgICAgICAgICBjb25uZWN0OiB7IGlkOiBsaWtlZFVzZXJJZCB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBsaWtlVXNlclxuIl19