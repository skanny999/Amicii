"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function dislike(userId, dislikedUserId) {
    const db = await db_1.getDB();
    const dislike = await db.dislikes.create({
        data: {
            userId: userId,
            dislikedUserId: dislikedUserId
        }
    });
}
exports.default = dislike;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzbGlrZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpc2xpa2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsS0FBSyxVQUFVLE9BQU8sQ0FBQyxNQUFjLEVBQUUsY0FBc0I7SUFDekQsTUFBTSxFQUFFLEdBQUcsTUFBTSxVQUFLLEVBQUUsQ0FBQTtJQUN4QixNQUFNLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ3JDLElBQUksRUFBRTtZQUNGLE1BQU0sRUFBRSxNQUFNO1lBQ2QsY0FBYyxFQUFFLGNBQWM7U0FDakM7S0FDSixDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsa0JBQWUsT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0REIgfSBmcm9tICcuL2RiJ1xuXG5hc3luYyBmdW5jdGlvbiBkaXNsaWtlKHVzZXJJZDogc3RyaW5nLCBkaXNsaWtlZFVzZXJJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gICAgY29uc3QgZGlzbGlrZSA9IGF3YWl0IGRiLmRpc2xpa2VzLmNyZWF0ZSh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgZGlzbGlrZWRVc2VySWQ6IGRpc2xpa2VkVXNlcklkXG4gICAgICAgIH1cbiAgICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNsaWtlIl19