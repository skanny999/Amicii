"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function user(userId) {
    const db = await db_1.getDB();
    try {
        return await db.user.findUnique({
            where: { id: userId },
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
        console.log('MySQL error: ', err);
        return null;
    }
}
exports.default = user;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsS0FBSyxVQUFVLElBQUksQ0FBQyxNQUFjO0lBQ2hDLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFDeEIsSUFBSTtRQUNGLE9BQU8sTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUM5QixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO1lBQ3JCLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUU7b0JBQ1IsTUFBTSxFQUFFO3dCQUNOLEtBQUssRUFBRSxJQUFJO3FCQUNaO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUE7S0FDSDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDakMsT0FBTyxJQUFJLENBQUE7S0FDWjtBQUNILENBQUM7QUFFRCxrQkFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREQiB9IGZyb20gJy4vZGInXG5cbmFzeW5jIGZ1bmN0aW9uIHVzZXIodXNlcklkOiBzdHJpbmcpIHtcbiAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRiLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBpZDogdXNlcklkIH0sXG4gICAgICBpbmNsdWRlOiB7XG4gICAgICAgIGZlYXR1cmVzOiB7XG4gICAgICAgICAgc2VsZWN0OiB7XG4gICAgICAgICAgICBlbW9qaTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmxvZygnTXlTUUwgZXJyb3I6ICcsIGVycilcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZXJcbiJdfQ==