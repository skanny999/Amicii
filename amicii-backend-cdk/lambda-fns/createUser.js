"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function createUser(newUser) {
    const db = await db_1.getDB();
    let user = {
        id: newUser.id,
        features: {
            connect: [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
                { id: 5 },
                { id: 6 },
                { id: 7 },
                { id: 8 },
                { id: 9 },
                { id: 10 },
            ]
        }
    };
    try {
        await db.user.create({ data: user });
        return user;
    }
    catch (err) {
        console.log('MySQL error: ', err);
        return null;
    }
}
exports.default = createUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFHNUIsS0FBSyxVQUFVLFVBQVUsQ0FBQyxPQUFhO0lBQ25DLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFFeEIsSUFBSSxJQUFJLEdBQUc7UUFDUCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7UUFDZCxRQUFRLEVBQUU7WUFDTixPQUFPLEVBQUc7Z0JBQ04sRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDO2dCQUNSLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQztnQkFDUixFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUM7Z0JBQ1IsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDO2dCQUNSLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQztnQkFDUixFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUM7Z0JBQ1IsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDO2dCQUNSLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQztnQkFDUixFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUM7Z0JBQ1IsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFDO2FBQ1o7U0FDSjtLQUNKLENBQUE7SUFFRCxJQUFJO1FBQ0EsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO1FBQ25DLE9BQU8sSUFBSSxDQUFBO0tBQ2Q7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ2pDLE9BQU8sSUFBSSxDQUFBO0tBQ2Q7QUFDTCxDQUFDO0FBRUQsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0REIgfSBmcm9tICcuL2RiJ1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdHlwZXMnXG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVVzZXIobmV3VXNlcjogVXNlcikge1xuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0REIoKVxuXG4gICAgbGV0IHVzZXIgPSB7XG4gICAgICAgIGlkOiBuZXdVc2VyLmlkLFxuICAgICAgICBmZWF0dXJlczoge1xuICAgICAgICAgICAgY29ubmVjdCA6IFtcbiAgICAgICAgICAgICAgICB7IGlkOiAxfSxcbiAgICAgICAgICAgICAgICB7IGlkOiAyfSxcbiAgICAgICAgICAgICAgICB7IGlkOiAzfSxcbiAgICAgICAgICAgICAgICB7IGlkOiA0fSxcbiAgICAgICAgICAgICAgICB7IGlkOiA1fSxcbiAgICAgICAgICAgICAgICB7IGlkOiA2fSxcbiAgICAgICAgICAgICAgICB7IGlkOiA3fSxcbiAgICAgICAgICAgICAgICB7IGlkOiA4fSxcbiAgICAgICAgICAgICAgICB7IGlkOiA5fSxcbiAgICAgICAgICAgICAgICB7IGlkOiAxMH0sXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBkYi51c2VyLmNyZWF0ZSh7IGRhdGE6IHVzZXJ9KVxuICAgICAgICByZXR1cm4gdXNlclxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZygnTXlTUUwgZXJyb3I6ICcsIGVycilcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVVzZXIiXX0=