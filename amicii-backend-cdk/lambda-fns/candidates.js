"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const sqlCommands_1 = require("./sqlCommands");
async function candidates(userId) {
    const db = await db_1.getDB();
    try {
        const allCandidatesIds = await db.$queryRaw(sqlCommands_1.candidatesQuery(userId));
        const allCandidates = await db.user.findMany({
            where: {
                id: {
                    in: allCandidatesIds.map((item) => item.ID)
                }
            }
        });
        return allCandidates;
    }
    catch (err) {
        return null;
    }
}
exports.default = candidates;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhbmRpZGF0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsK0NBQStDO0FBRS9DLEtBQUssVUFBVSxVQUFVLENBQUMsTUFBYztJQUNwQyxNQUFNLEVBQUUsR0FBRyxNQUFNLFVBQUssRUFBRSxDQUFBO0lBQ3hCLElBQUk7UUFDQSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyw2QkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDcEUsTUFBTSxhQUFhLEdBQUcsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN6QyxLQUFLLEVBQUU7Z0JBQ0gsRUFBRSxFQUFFO29CQUNBLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFvQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2lCQUM5RDthQUNKO1NBQ0osQ0FBQyxDQUFBO1FBQ0YsT0FBTyxhQUFhLENBQUE7S0FDdkI7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sSUFBSSxDQUFBO0tBQ2Q7QUFFTCxDQUFDO0FBRUQsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0REIgfSBmcm9tICcuL2RiJ1xuaW1wb3J0IHsgY2FuZGlkYXRlc1F1ZXJ5IH0gZnJvbSAnLi9zcWxDb21tYW5kcydcblxuYXN5bmMgZnVuY3Rpb24gY2FuZGlkYXRlcyh1c2VySWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0REIoKVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsbENhbmRpZGF0ZXNJZHMgPSBhd2FpdCBkYi4kcXVlcnlSYXcoY2FuZGlkYXRlc1F1ZXJ5KHVzZXJJZCkpXG4gICAgICAgIGNvbnN0IGFsbENhbmRpZGF0ZXMgPSBhd2FpdCBkYi51c2VyLmZpbmRNYW55KHtcbiAgICAgICAgICAgIHdoZXJlOiB7IFxuICAgICAgICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICAgICAgICAgIGluOiBhbGxDYW5kaWRhdGVzSWRzLm1hcCgoaXRlbTogeyBJRDogc3RyaW5nIH0pID0+IGl0ZW0uSUQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gYWxsQ2FuZGlkYXRlc1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBjYW5kaWRhdGVzIl19