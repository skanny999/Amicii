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
                    }
                }
            }
        });
    }
    catch (err) {
        console.log('MySQL error: ', err);
        return null;
    }
}
exports.default = user;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw2QkFBNEI7QUFLNUIsS0FBSyxVQUFVLElBQUksQ0FBQyxNQUFjO0lBQzlCLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFDeEIsSUFBSTtRQUNBLE9BQU8sTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN4QixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO1lBQ3JCLE9BQU8sRUFBRTtnQkFDTCxRQUFRLEVBQUU7b0JBQ1YsTUFBTSxFQUFFO3dCQUNKLEtBQUssRUFBRSxJQUFJO3FCQUNkO2lCQUNKO2FBQ0g7U0FDRCxDQUNKLENBQUE7S0FDRjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDakMsT0FBTyxJQUFJLENBQUE7S0FDWjtBQUNQLENBQUM7QUFFRCxrQkFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgZGIgZnJvbSAnLi9kYidcbmltcG9ydCBjYW5kaWRhdGVzIGZyb20gJy4vY2FuZGlkYXRlcydcbmltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcbmltcG9ydCBtYXRjaGVzIGZyb20gJy4vbWF0Y2hlcydcbmltcG9ydCB7IGdldENhbmRpZGF0ZXNRdWVyeSB9IGZyb20gJy4vc3FsQ29tbWFuZHMnXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi90eXBlcydcblxuYXN5bmMgZnVuY3Rpb24gdXNlcih1c2VySWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0REIoKVxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBkYi51c2VyLmZpbmRVbmlxdWUoeyBcbiAgICAgICAgICAgICAgICB3aGVyZTogeyBpZDogdXNlcklkIH0sXG4gICAgICAgICAgICAgICAgaW5jbHVkZToge1xuICAgICAgICAgICAgICAgICAgICBmZWF0dXJlczoge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Q6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtb2ppOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZygnTXlTUUwgZXJyb3I6ICcsIGVycilcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlciJdfQ==