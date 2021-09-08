"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function updateUser(user) {
    const db = await db_1.getDB();
    const disconnectPreviouslyConnectedFeatures = db.user.update({
        where: { id: user.id },
        data: {
            features: {
                set: [],
            },
        },
    });
    const connectOrCreateNewFeatures = db.user.update({
        where: { id: user.id },
        data: {
            id: user.id,
            username: user.username,
            age: user.age,
            bio: user.bio,
            genderM: user.genderM,
            genderF: user.genderF,
            profileEmoji: user.profileEmoji,
            createdOn: user.createdOn,
            features: {
                connectOrCreate: [
                    {
                        where: {
                            emoji: user.features[0].emoji,
                        },
                        create: {
                            emoji: user.features[0].emoji,
                        },
                    },
                    {
                        where: {
                            emoji: user.features[1].emoji,
                        },
                        create: {
                            emoji: user.features[1].emoji,
                        },
                    },
                    {
                        where: {
                            emoji: user.features[2].emoji,
                        },
                        create: {
                            emoji: user.features[2].emoji,
                        },
                    },
                    {
                        where: {
                            emoji: user.features[3].emoji,
                        },
                        create: {
                            emoji: user.features[3].emoji,
                        },
                    },
                    {
                        where: {
                            emoji: user.features[4].emoji,
                        },
                        create: {
                            emoji: user.features[4].emoji,
                        },
                    },
                    {
                        where: {
                            emoji: user.features[5].emoji,
                        },
                        create: {
                            emoji: user.features[5].emoji,
                        },
                    },
                    {
                        where: {
                            emoji: user.features[6].emoji,
                        },
                        create: {
                            emoji: user.features[6].emoji,
                        },
                    },
                    {
                        where: {
                            emoji: user.features[7].emoji,
                        },
                        create: {
                            emoji: user.features[7].emoji,
                        },
                    },
                    {
                        where: {
                            emoji: user.features[8].emoji,
                        },
                        create: {
                            emoji: user.features[8].emoji,
                        },
                    },
                    {
                        where: {
                            emoji: user.features[9].emoji,
                        },
                        create: {
                            emoji: user.features[9].emoji,
                        },
                    },
                ],
            },
        },
    });
    try {
        await db.$transaction([
            disconnectPreviouslyConnectedFeatures,
            connectOrCreateNewFeatures,
        ]);
        return user;
    }
    catch (err) {
        console.log('MySQL error: ', err);
        return null;
    }
}
exports.default = updateUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVwZGF0ZVVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2QkFBNEI7QUFFNUIsS0FBSyxVQUFVLFVBQVUsQ0FBQyxJQUFVO0lBQ2xDLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFFeEIsTUFBTSxxQ0FBcUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzRCxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtRQUN0QixJQUFJLEVBQUU7WUFDSixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLEVBQUU7YUFDUjtTQUNGO0tBQ0YsQ0FBQyxDQUFBO0lBRUYsTUFBTSwwQkFBMEIsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNoRCxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtRQUN0QixJQUFJLEVBQUU7WUFDSixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLFFBQVEsRUFBRTtnQkFDUixlQUFlLEVBQUU7b0JBQ2Y7d0JBQ0UsS0FBSyxFQUFFOzRCQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7eUJBQzlCO3dCQUNELE1BQU0sRUFBRTs0QkFDTixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FB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QUNILENBQUM7QUFFRCxrQkFBZSxVQUFVLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlVXNlcih1c2VyOiBVc2VyKSB7XG4gIGNvbnN0IGRiID0gYXdhaXQgZ2V0REIoKVxuXG4gIGNvbnN0IGRpc2Nvbm5lY3RQcmV2aW91c2x5Q29ubmVjdGVkRmVhdHVyZXMgPSBkYi51c2VyLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IHVzZXIuaWQgfSxcbiAgICBkYXRhOiB7XG4gICAgICBmZWF0dXJlczoge1xuICAgICAgICBzZXQ6IFtdLFxuICAgICAgfSxcbiAgICB9LFxuICB9KVxuXG4gIGNvbnN0IGNvbm5lY3RPckNyZWF0ZU5ld0ZlYXR1cmVzID0gZGIudXNlci51cGRhdGUoe1xuICAgIHdoZXJlOiB7IGlkOiB1c2VyLmlkIH0sXG4gICAgZGF0YToge1xuICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICB1c2VybmFtZTogdXNlci51c2VybmFtZSxcbiAgICAgIGFnZTogdXNlci5hZ2UsXG4gICAgICBiaW86IHVzZXIuYmlvLFxuICAgICAgZ2VuZGVyTTogdXNlci5nZW5kZXJNLFxuICAgICAgZ2VuZGVyRjogdXNlci5nZW5kZXJGLFxuICAgICAgcHJvZmlsZUVtb2ppOiB1c2VyLnByb2ZpbGVFbW9qaSxcbiAgICAgIGNyZWF0ZWRPbjogdXNlci5jcmVhdGVkT24sXG4gICAgICBmZWF0dXJlczoge1xuICAgICAgICBjb25uZWN0T3JDcmVhdGU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBlbW9qaTogdXNlci5mZWF0dXJlc1swXS5lbW9qaSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmVhdGU6IHtcbiAgICAgICAgICAgICAgZW1vamk6IHVzZXIuZmVhdHVyZXNbMF0uZW1vamksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgZW1vamk6IHVzZXIuZmVhdHVyZXNbMV0uZW1vamksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlOiB7XG4gICAgICAgICAgICAgIGVtb2ppOiB1c2VyLmZlYXR1cmVzWzFdLmVtb2ppLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgIGVtb2ppOiB1c2VyLmZlYXR1cmVzWzJdLmVtb2ppLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZToge1xuICAgICAgICAgICAgICBlbW9qaTogdXNlci5mZWF0dXJlc1syXS5lbW9qaSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBlbW9qaTogdXNlci5mZWF0dXJlc1szXS5lbW9qaSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmVhdGU6IHtcbiAgICAgICAgICAgICAgZW1vamk6IHVzZXIuZmVhdHVyZXNbM10uZW1vamksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgZW1vamk6IHVzZXIuZmVhdHVyZXNbNF0uZW1vamksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlOiB7XG4gICAgICAgICAgICAgIGVtb2ppOiB1c2VyLmZlYXR1cmVzWzRdLmVtb2ppLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgIGVtb2ppOiB1c2VyLmZlYXR1cmVzWzVdLmVtb2ppLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZToge1xuICAgICAgICAgICAgICBlbW9qaTogdXNlci5mZWF0dXJlc1s1XS5lbW9qaSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBlbW9qaTogdXNlci5mZWF0dXJlc1s2XS5lbW9qaSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmVhdGU6IHtcbiAgICAgICAgICAgICAgZW1vamk6IHVzZXIuZmVhdHVyZXNbNl0uZW1vamksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgZW1vamk6IHVzZXIuZmVhdHVyZXNbN10uZW1vamksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlOiB7XG4gICAgICAgICAgICAgIGVtb2ppOiB1c2VyLmZlYXR1cmVzWzddLmVtb2ppLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgIGVtb2ppOiB1c2VyLmZlYXR1cmVzWzhdLmVtb2ppLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZToge1xuICAgICAgICAgICAgICBlbW9qaTogdXNlci5mZWF0dXJlc1s4XS5lbW9qaSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICBlbW9qaTogdXNlci5mZWF0dXJlc1s5XS5lbW9qaSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmVhdGU6IHtcbiAgICAgICAgICAgICAgZW1vamk6IHVzZXIuZmVhdHVyZXNbOV0uZW1vamksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pXG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBkYi4kdHJhbnNhY3Rpb24oW1xuICAgICAgZGlzY29ubmVjdFByZXZpb3VzbHlDb25uZWN0ZWRGZWF0dXJlcyxcbiAgICAgIGNvbm5lY3RPckNyZWF0ZU5ld0ZlYXR1cmVzLFxuICAgIF0pXG4gICAgcmV0dXJuIHVzZXJcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coJ015U1FMIGVycm9yOiAnLCBlcnIpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGVVc2VyXG4iXX0=