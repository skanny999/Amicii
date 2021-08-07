"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function likeUser(userId, likedUserId) {
    const db = await db_1.getDB();
    try {
        return await db.likes.create({
            data: {
                userId: userId,
                likedUserId: likedUserId
            }
        });
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
exports.default = likeUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlrZVVzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaWtlVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixLQUFLLFVBQVUsUUFBUSxDQUFDLE1BQWMsRUFBRSxXQUFtQjtJQUN2RCxNQUFNLEVBQUUsR0FBRyxNQUFNLFVBQUssRUFBRSxDQUFBO0lBQ3hCLElBQUk7UUFDQSxPQUFPLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxFQUFHO2dCQUNILE1BQU0sRUFBRSxNQUFNO2dCQUNkLFdBQVcsRUFBRSxXQUFXO2FBQzNCO1NBQ0osQ0FBQyxDQUFBO0tBQ0w7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDaEIsT0FBTyxJQUFJLENBQUE7S0FDZDtBQUNMLENBQUM7QUFFRCxrQkFBZSxRQUFRLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREQiB9IGZyb20gJy4vZGInXG5cbmFzeW5jIGZ1bmN0aW9uIGxpa2VVc2VyKHVzZXJJZDogc3RyaW5nLCBsaWtlZFVzZXJJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGRiLmxpa2VzLmNyZWF0ZSh7XG4gICAgICAgICAgICBkYXRhIDoge1xuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgICAgIGxpa2VkVXNlcklkOiBsaWtlZFVzZXJJZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBsaWtlVXNlciJdfQ==