"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createUser_1 = require("./createUser");
const updateUser_1 = require("./updateUser");
const candidates_1 = require("./candidates");
const matches_1 = require("./matches");
const user_1 = require("./user");
exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    switch (event.info.fieldName) {
        case 'createUser':
            return await createUser_1.default(event.arguments.userId);
        case 'updateUser':
            return await updateUser_1.default(event.arguments.user);
        case 'user':
            return await user_1.default(event.arguments.userId);
        case 'candidates':
            return await candidates_1.default(event.arguments.userId);
        case 'matches':
            return await matches_1.default(event.arguments.userId);
        default:
            return null;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFzQztBQUN0Qyw2Q0FBc0M7QUFFdEMsNkNBQXNDO0FBQ3RDLHVDQUFnQztBQUVoQyxpQ0FBMEI7QUFhMUIsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBbUIsRUFBRSxPQUFZLEVBQUUsRUFBRTtJQUMxRCxPQUFPLENBQUMsOEJBQThCLEdBQUcsS0FBSyxDQUFBO0lBRTlDLFFBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDMUIsS0FBSyxZQUFZO1lBQ2IsT0FBTyxNQUFNLG9CQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNuRCxLQUFLLFlBQVk7WUFDYixPQUFPLE1BQU0sb0JBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pELEtBQUssTUFBTTtZQUNQLE9BQU8sTUFBTSxjQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM3QyxLQUFLLFlBQVk7WUFDYixPQUFPLE1BQU0sb0JBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ25ELEtBQUssU0FBUztZQUNWLE9BQU8sTUFBTSxpQkFBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDaEQ7WUFDSSxPQUFPLElBQUksQ0FBQTtLQUNsQjtBQUNMLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVVc2VyIGZyb20gXCIuL2NyZWF0ZVVzZXJcIjtcbmltcG9ydCB1cGRhdGVVc2VyIGZyb20gXCIuL3VwZGF0ZVVzZXJcIjtcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IGNhbmRpZGF0ZXMgZnJvbSBcIi4vY2FuZGlkYXRlc1wiO1xuaW1wb3J0IG1hdGNoZXMgZnJvbSBcIi4vbWF0Y2hlc1wiO1xuaW1wb3J0IGZlYXR1cmVzIGZyb20gXCIuL2ZlYXR1cmVzXCI7XG5pbXBvcnQgdXNlciBmcm9tIFwiLi91c2VyXCI7XG5cbnR5cGUgQXBwU3luY0V2ZW50ID0ge1xuICAgIGluZm86IHtcbiAgICAgICAgZmllbGROYW1lOiBzdHJpbmdcbiAgICB9LFxuICAgIGFyZ3VtZW50czoge1xuICAgICAgICB1c2VyOiBVc2VyLFxuICAgICAgICB1c2VySWQ6IHN0cmluZyxcbiAgICAgICAgb3RoZXJVc2VySWQ6IHN0cmluZ1xuICAgIH1cbn1cblxuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBBcHBTeW5jRXZlbnQsIGNvbnRleHQ6IGFueSkgPT4ge1xuICAgIGNvbnRleHQuY2FsbGJhY2tXYWl0c0ZvckVtcHR5RXZlbnRMb29wID0gZmFsc2VcblxuICAgIHN3aXRjaCAoZXZlbnQuaW5mby5maWVsZE5hbWUpIHtcbiAgICAgICAgY2FzZSAnY3JlYXRlVXNlcic6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgY3JlYXRlVXNlcihldmVudC5hcmd1bWVudHMudXNlcklkKVxuICAgICAgICBjYXNlICd1cGRhdGVVc2VyJzpcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB1cGRhdGVVc2VyKGV2ZW50LmFyZ3VtZW50cy51c2VyKVxuICAgICAgICBjYXNlICd1c2VyJzpcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB1c2VyKGV2ZW50LmFyZ3VtZW50cy51c2VySWQpXG4gICAgICAgIGNhc2UgJ2NhbmRpZGF0ZXMnOlxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGNhbmRpZGF0ZXMoZXZlbnQuYXJndW1lbnRzLnVzZXJJZClcbiAgICAgICAgY2FzZSAnbWF0Y2hlcyc6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbWF0Y2hlcyhldmVudC5hcmd1bWVudHMudXNlcklkKVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG59Il19