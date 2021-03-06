"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function createUser(userId, username) {
    const db = await db_1.getDB();
    let user = {
        id: userId,
        username: username,
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
            ],
        },
    };
    try {
        const newUser = await db.user.create({ data: user });
        return newUser;
    }
    catch (err) {
        console.log('MySQL error: ', err);
        return null;
    }
}
exports.default = createUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsS0FBSyxVQUFVLFVBQVUsQ0FBQyxNQUFjLEVBQUUsUUFBZ0I7SUFDeEQsTUFBTSxFQUFFLEdBQUcsTUFBTSxVQUFLLEVBQUUsQ0FBQTtJQUV4QixJQUFJLElBQUksR0FBRztRQUNULEVBQUUsRUFBRSxNQUFNO1FBQ1YsUUFBUSxFQUFFLFFBQVE7UUFDbEIsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDVCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ1QsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNULEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDVCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ1QsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNULEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDVCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ1QsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNULEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTthQUNYO1NBQ0Y7S0FDRixDQUFBO0lBRUQsSUFBSTtRQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUNwRCxPQUFPLE9BQU8sQ0FBQTtLQUNmO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUNqQyxPQUFPLElBQUksQ0FBQTtLQUNaO0FBQ0gsQ0FBQztBQUVELGtCQUFlLFVBQVUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlVXNlcih1c2VySWQ6IHN0cmluZywgdXNlcm5hbWU6IHN0cmluZykge1xuICBjb25zdCBkYiA9IGF3YWl0IGdldERCKClcblxuICBsZXQgdXNlciA9IHtcbiAgICBpZDogdXNlcklkLFxuICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICBmZWF0dXJlczoge1xuICAgICAgY29ubmVjdDogW1xuICAgICAgICB7IGlkOiAxIH0sXG4gICAgICAgIHsgaWQ6IDIgfSxcbiAgICAgICAgeyBpZDogMyB9LFxuICAgICAgICB7IGlkOiA0IH0sXG4gICAgICAgIHsgaWQ6IDUgfSxcbiAgICAgICAgeyBpZDogNiB9LFxuICAgICAgICB7IGlkOiA3IH0sXG4gICAgICAgIHsgaWQ6IDggfSxcbiAgICAgICAgeyBpZDogOSB9LFxuICAgICAgICB7IGlkOiAxMCB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBuZXdVc2VyID0gYXdhaXQgZGIudXNlci5jcmVhdGUoeyBkYXRhOiB1c2VyIH0pXG4gICAgcmV0dXJuIG5ld1VzZXJcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coJ015U1FMIGVycm9yOiAnLCBlcnIpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVVc2VyXG4iXX0=