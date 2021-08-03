"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import db from './db'
const db_1 = require("./db");
async function getCandidates() {
    const db = await db_1.getDB();
    // try {
    //     return await db.user.findMany()
    // } catch (err) {
    //     console.log('MySQL error ', err)
    //     return null
    // }
}
exports.default = getCandidates;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q2FuZGlkYXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdldENhbmRpZGF0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3QkFBd0I7QUFDeEIsNkJBQTRCO0FBRzVCLEtBQUssVUFBVSxhQUFhO0lBQ3hCLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFFeEIsUUFBUTtJQUNSLHNDQUFzQztJQUN0QyxrQkFBa0I7SUFDbEIsdUNBQXVDO0lBQ3ZDLGtCQUFrQjtJQUNsQixJQUFJO0FBQ1IsQ0FBQztBQUVELGtCQUFlLGFBQWEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBkYiBmcm9tICcuL2RiJ1xuaW1wb3J0IHsgZ2V0REIgfSBmcm9tICcuL2RiJ1xuaW1wb3J0IHsgZ2V0Q2FuZGlkYXRlc1F1ZXJ5IH0gZnJvbSAnLi9zcWxDb21tYW5kcydcblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q2FuZGlkYXRlcygpIHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERCKClcblxuICAgIC8vIHRyeSB7XG4gICAgLy8gICAgIHJldHVybiBhd2FpdCBkYi51c2VyLmZpbmRNYW55KClcbiAgICAvLyB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coJ015U1FMIGVycm9yICcsIGVycilcbiAgICAvLyAgICAgcmV0dXJuIG51bGxcbiAgICAvLyB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldENhbmRpZGF0ZXMiXX0=