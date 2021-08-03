"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setupUsersTable_1 = require("./setupUsersTable");
const setupLikesTable_1 = require("./setupLikesTable");
const setupDislikesTable_1 = require("./setupDislikesTable");
const setupFeaturesTable_1 = require("./setupFeaturesTable");
exports.handler = async () => {
    return await Promise.all([
        setupUsersTable_1.default(),
        setupLikesTable_1.default(),
        setupDislikesTable_1.default(),
        setupFeaturesTable_1.default()
    ]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGJGdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRiRnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBZ0Q7QUFDaEQsdURBQWdEO0FBQ2hELDZEQUFzRDtBQUN0RCw2REFBc0Q7QUFFdEQsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLElBQUksRUFBRTtJQUN6QixPQUFPLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUNyQix5QkFBZSxFQUFFO1FBQ2pCLHlCQUFlLEVBQUU7UUFDakIsNEJBQWtCLEVBQUU7UUFDcEIsNEJBQWtCLEVBQUU7S0FDdkIsQ0FBQyxDQUFBO0FBQ04sQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNldHVwVXNlcnNUYWJsZSBmcm9tIFwiLi9zZXR1cFVzZXJzVGFibGVcIjtcbmltcG9ydCBzZXR1cExpa2VzVGFibGUgZnJvbSBcIi4vc2V0dXBMaWtlc1RhYmxlXCI7XG5pbXBvcnQgc2V0dXBEaXNsaWtlc1RhYmxlIGZyb20gXCIuL3NldHVwRGlzbGlrZXNUYWJsZVwiO1xuaW1wb3J0IHNldHVwRmVhdHVyZXNUYWJsZSBmcm9tIFwiLi9zZXR1cEZlYXR1cmVzVGFibGVcIjtcblxuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKCkgPT4ge1xuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHNldHVwVXNlcnNUYWJsZSgpLFxuICAgICAgICBzZXR1cExpa2VzVGFibGUoKSxcbiAgICAgICAgc2V0dXBEaXNsaWtlc1RhYmxlKCksXG4gICAgICAgIHNldHVwRmVhdHVyZXNUYWJsZSgpXG4gICAgXSlcbn0iXX0=