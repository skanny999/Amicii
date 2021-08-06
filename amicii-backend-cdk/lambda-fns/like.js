"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function like(userId, likedUserId) {
    const db = await db_1.getDB();
    const user = await db.likes.create({
        data: {
            userId: userId,
            likedUserId: likedUserId
        }
    });
}
exports.default = like;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlrZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpa2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsS0FBSyxVQUFVLElBQUksQ0FBQyxNQUFjLEVBQUUsV0FBbUI7SUFDbkQsTUFBTSxFQUFFLEdBQUcsTUFBTSxVQUFLLEVBQUUsQ0FBQTtJQUN4QixNQUFNLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksRUFBRztZQUNILE1BQU0sRUFBRSxNQUFNO1lBQ2QsV0FBVyxFQUFFLFdBQVc7U0FDM0I7S0FDSixDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsa0JBQWUsSUFBSSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0REIgfSBmcm9tICcuL2RiJ1xuXG5hc3luYyBmdW5jdGlvbiBsaWtlKHVzZXJJZDogc3RyaW5nLCBsaWtlZFVzZXJJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gICAgY29uc3QgdXNlciA9IGF3YWl0IGRiLmxpa2VzLmNyZWF0ZSh7XG4gICAgICAgIGRhdGEgOiB7XG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgIGxpa2VkVXNlcklkOiBsaWtlZFVzZXJJZFxuICAgICAgICB9XG4gICAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGlrZSJdfQ==