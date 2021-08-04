"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createUser_1 = require("./createUser");
const updateUser_1 = require("./updateUser");
const getCandidates_1 = require("./getCandidates");
const getMatches_1 = require("./getMatches");
exports.handler = async (event) => {
    switch (event.info.fieldName) {
        case 'createUser':
            return await createUser_1.default(event.arguments.user);
        case 'updateUser':
            return await updateUser_1.default(event.arguments.user);
        case 'getCandidates':
            return await getCandidates_1.default();
        case 'getMatches':
            return await getMatches_1.default();
        default:
            return null;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFzQztBQUN0Qyw2Q0FBc0M7QUFDdEMsbURBQTRDO0FBQzVDLDZDQUFzQztBQVl0QyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxLQUFtQixFQUFFLEVBQUU7SUFDNUMsUUFBUSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUMxQixLQUFLLFlBQVk7WUFDYixPQUFPLE1BQU0sb0JBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pELEtBQUssWUFBWTtZQUNiLE9BQU8sTUFBTSxvQkFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDakQsS0FBSyxlQUFlO1lBQ2hCLE9BQU8sTUFBTSx1QkFBYSxFQUFFLENBQUE7UUFDaEMsS0FBSyxZQUFZO1lBQ2IsT0FBTyxNQUFNLG9CQUFVLEVBQUUsQ0FBQTtRQUM3QjtZQUNJLE9BQU8sSUFBSSxDQUFBO0tBQ2xCO0FBQ0wsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZVVzZXIgZnJvbSBcIi4vY3JlYXRlVXNlclwiO1xuaW1wb3J0IHVwZGF0ZVVzZXIgZnJvbSBcIi4vdXBkYXRlVXNlclwiO1xuaW1wb3J0IGdldENhbmRpZGF0ZXMgZnJvbSBcIi4vZ2V0Q2FuZGlkYXRlc1wiO1xuaW1wb3J0IGdldE1hdGNoZXMgZnJvbSBcIi4vZ2V0TWF0Y2hlc1wiO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbnR5cGUgQXBwU3luY0V2ZW50ID0ge1xuICAgIGluZm86IHtcbiAgICAgICAgZmllbGROYW1lOiBzdHJpbmdcbiAgICB9LFxuICAgIGFyZ3VtZW50czoge1xuICAgICAgICB1c2VyOiBVc2VyXG4gICAgfVxufVxuXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IEFwcFN5bmNFdmVudCkgPT4ge1xuICAgIHN3aXRjaCAoZXZlbnQuaW5mby5maWVsZE5hbWUpIHtcbiAgICAgICAgY2FzZSAnY3JlYXRlVXNlcic6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgY3JlYXRlVXNlcihldmVudC5hcmd1bWVudHMudXNlcilcbiAgICAgICAgY2FzZSAndXBkYXRlVXNlcic6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdXBkYXRlVXNlcihldmVudC5hcmd1bWVudHMudXNlcilcbiAgICAgICAgY2FzZSAnZ2V0Q2FuZGlkYXRlcyc6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0Q2FuZGlkYXRlcygpXG4gICAgICAgIGNhc2UgJ2dldE1hdGNoZXMnOlxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGdldE1hdGNoZXMoKVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG59Il19