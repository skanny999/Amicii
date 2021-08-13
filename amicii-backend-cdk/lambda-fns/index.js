"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createUser_1 = require("./createUser");
const updateUser_1 = require("./updateUser");
const candidates_1 = require("./candidates");
const matches_1 = require("./matches");
const user_1 = require("./user");
const likeUser_1 = require("./likeUser");
const dislikeUser_1 = require("./dislikeUser");
exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    switch (event.info.fieldName) {
        case 'user':
            return await user_1.default(event.arguments.userId);
        case 'candidates':
            return await candidates_1.default(event.arguments.userId);
        case 'matches':
            return await matches_1.default(event.arguments.userId);
        case 'createUser':
            return await createUser_1.default(event.arguments.userId, event.arguments.username);
        case 'updateUser':
            return await updateUser_1.default(event.arguments.user);
        case 'likeUser':
            return await likeUser_1.default(event.arguments.userId, event.arguments.otherUserId);
        case 'dislikeUser':
            return await dislikeUser_1.default(event.arguments.userId, event.arguments.otherUserId);
        default:
            return null;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFzQztBQUN0Qyw2Q0FBc0M7QUFFdEMsNkNBQXNDO0FBQ3RDLHVDQUFnQztBQUNoQyxpQ0FBMEI7QUFDMUIseUNBQWtDO0FBQ2xDLCtDQUF3QztBQWN4QyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxLQUFtQixFQUFFLE9BQVksRUFBRSxFQUFFO0lBQzFELE9BQU8sQ0FBQyw4QkFBOEIsR0FBRyxLQUFLLENBQUE7SUFFOUMsUUFBUSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUMxQixLQUFLLE1BQU07WUFDUCxPQUFPLE1BQU0sY0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDN0MsS0FBSyxZQUFZO1lBQ2IsT0FBTyxNQUFNLG9CQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNuRCxLQUFLLFNBQVM7WUFDVixPQUFPLE1BQU0saUJBQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2hELEtBQUssWUFBWTtZQUNiLE9BQU8sTUFBTSxvQkFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDN0UsS0FBSyxZQUFZO1lBQ2IsT0FBTyxNQUFNLG9CQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNqRCxLQUFLLFVBQVU7WUFDWCxPQUFPLE1BQU0sa0JBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQzlFLEtBQUssYUFBYTtZQUNkLE9BQU8sTUFBTSxxQkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDakY7WUFDSSxPQUFPLElBQUksQ0FBQTtLQUNsQjtBQUNMLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVVc2VyIGZyb20gXCIuL2NyZWF0ZVVzZXJcIjtcbmltcG9ydCB1cGRhdGVVc2VyIGZyb20gXCIuL3VwZGF0ZVVzZXJcIjtcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IGNhbmRpZGF0ZXMgZnJvbSBcIi4vY2FuZGlkYXRlc1wiO1xuaW1wb3J0IG1hdGNoZXMgZnJvbSBcIi4vbWF0Y2hlc1wiO1xuaW1wb3J0IHVzZXIgZnJvbSBcIi4vdXNlclwiO1xuaW1wb3J0IGxpa2VVc2VyIGZyb20gXCIuL2xpa2VVc2VyXCI7XG5pbXBvcnQgZGlzbGlrZVVzZXIgZnJvbSBcIi4vZGlzbGlrZVVzZXJcIjtcblxudHlwZSBBcHBTeW5jRXZlbnQgPSB7XG4gICAgaW5mbzoge1xuICAgICAgICBmaWVsZE5hbWU6IHN0cmluZ1xuICAgIH0sXG4gICAgYXJndW1lbnRzOiB7XG4gICAgICAgIHVzZXI6IFVzZXIsXG4gICAgICAgIHVzZXJJZDogc3RyaW5nLFxuICAgICAgICBvdGhlclVzZXJJZDogc3RyaW5nLFxuICAgICAgICB1c2VybmFtZTogc3RyaW5nXG4gICAgfVxufVxuXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IEFwcFN5bmNFdmVudCwgY29udGV4dDogYW55KSA9PiB7XG4gICAgY29udGV4dC5jYWxsYmFja1dhaXRzRm9yRW1wdHlFdmVudExvb3AgPSBmYWxzZVxuXG4gICAgc3dpdGNoIChldmVudC5pbmZvLmZpZWxkTmFtZSkge1xuICAgICAgICBjYXNlICd1c2VyJzpcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB1c2VyKGV2ZW50LmFyZ3VtZW50cy51c2VySWQpXG4gICAgICAgIGNhc2UgJ2NhbmRpZGF0ZXMnOlxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGNhbmRpZGF0ZXMoZXZlbnQuYXJndW1lbnRzLnVzZXJJZClcbiAgICAgICAgY2FzZSAnbWF0Y2hlcyc6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbWF0Y2hlcyhldmVudC5hcmd1bWVudHMudXNlcklkKVxuICAgICAgICBjYXNlICdjcmVhdGVVc2VyJzpcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBjcmVhdGVVc2VyKGV2ZW50LmFyZ3VtZW50cy51c2VySWQsIGV2ZW50LmFyZ3VtZW50cy51c2VybmFtZSlcbiAgICAgICAgY2FzZSAndXBkYXRlVXNlcic6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdXBkYXRlVXNlcihldmVudC5hcmd1bWVudHMudXNlcilcbiAgICAgICAgY2FzZSAnbGlrZVVzZXInOlxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGxpa2VVc2VyKGV2ZW50LmFyZ3VtZW50cy51c2VySWQsIGV2ZW50LmFyZ3VtZW50cy5vdGhlclVzZXJJZCkgICAgICAgIFxuICAgICAgICBjYXNlICdkaXNsaWtlVXNlcic6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZGlzbGlrZVVzZXIoZXZlbnQuYXJndW1lbnRzLnVzZXJJZCwgZXZlbnQuYXJndW1lbnRzLm90aGVyVXNlcklkKVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG59Il19