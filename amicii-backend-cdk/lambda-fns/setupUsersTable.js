"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const sqlCommands_1 = require("./sqlCommands");
async function setupUsersTable() {
    const db = await db_1.getDB();
    try {
        await Promise.all([
            db.$queryRaw(sqlCommands_1.createUsersTableQuery),
            db.$queryRaw(sqlCommands_1.createLikedUsersRelationQuery),
            db.$queryRaw(sqlCommands_1.createDislikedUsersRelationQuery),
            db.$queryRaw(sqlCommands_1.addLikedUsersForeingKeyA),
            db.$queryRaw(sqlCommands_1.addLikedUsersForeingKeyB),
            db.$queryRaw(sqlCommands_1.addDislikedUsersForeingKeyA),
            db.$queryRaw(sqlCommands_1.addDislikedUsersForeingKeyB),
        ]);
        return true;
    }
    catch (e) {
        console.log('MySQL error: ', e);
        return false;
    }
}
exports.default = setupUsersTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBVc2Vyc1RhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dXBVc2Vyc1RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLCtDQVFzQjtBQUV0QixLQUFLLFVBQVUsZUFBZTtJQUM1QixNQUFNLEVBQUUsR0FBRyxNQUFNLFVBQUssRUFBRSxDQUFBO0lBQ3hCLElBQUk7UUFDRixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxtQ0FBcUIsQ0FBQztZQUNuQyxFQUFFLENBQUMsU0FBUyxDQUFDLDJDQUE2QixDQUFDO1lBQzNDLEVBQUUsQ0FBQyxTQUFTLENBQUMsOENBQWdDLENBQUM7WUFDOUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxzQ0FBd0IsQ0FBQztZQUN0QyxFQUFFLENBQUMsU0FBUyxDQUFDLHNDQUF3QixDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxTQUFTLENBQUMseUNBQTJCLENBQUM7WUFDekMsRUFBRSxDQUFDLFNBQVMsQ0FBQyx5Q0FBMkIsQ0FBQztTQUMxQyxDQUFDLENBQUE7UUFDRixPQUFPLElBQUksQ0FBQTtLQUNaO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMvQixPQUFPLEtBQUssQ0FBQTtLQUNiO0FBQ0gsQ0FBQztBQUVELGtCQUFlLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcbmltcG9ydCB7XG4gIGFkZERpc2xpa2VkVXNlcnNGb3JlaW5nS2V5QSxcbiAgYWRkRGlzbGlrZWRVc2Vyc0ZvcmVpbmdLZXlCLFxuICBhZGRMaWtlZFVzZXJzRm9yZWluZ0tleUEsXG4gIGFkZExpa2VkVXNlcnNGb3JlaW5nS2V5QixcbiAgY3JlYXRlRGlzbGlrZWRVc2Vyc1JlbGF0aW9uUXVlcnksXG4gIGNyZWF0ZUxpa2VkVXNlcnNSZWxhdGlvblF1ZXJ5LFxuICBjcmVhdGVVc2Vyc1RhYmxlUXVlcnksXG59IGZyb20gJy4vc3FsQ29tbWFuZHMnXG5cbmFzeW5jIGZ1bmN0aW9uIHNldHVwVXNlcnNUYWJsZSgpIHtcbiAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gIHRyeSB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgZGIuJHF1ZXJ5UmF3KGNyZWF0ZVVzZXJzVGFibGVRdWVyeSksXG4gICAgICBkYi4kcXVlcnlSYXcoY3JlYXRlTGlrZWRVc2Vyc1JlbGF0aW9uUXVlcnkpLFxuICAgICAgZGIuJHF1ZXJ5UmF3KGNyZWF0ZURpc2xpa2VkVXNlcnNSZWxhdGlvblF1ZXJ5KSxcbiAgICAgIGRiLiRxdWVyeVJhdyhhZGRMaWtlZFVzZXJzRm9yZWluZ0tleUEpLFxuICAgICAgZGIuJHF1ZXJ5UmF3KGFkZExpa2VkVXNlcnNGb3JlaW5nS2V5QiksXG4gICAgICBkYi4kcXVlcnlSYXcoYWRkRGlzbGlrZWRVc2Vyc0ZvcmVpbmdLZXlBKSxcbiAgICAgIGRiLiRxdWVyeVJhdyhhZGREaXNsaWtlZFVzZXJzRm9yZWluZ0tleUIpLFxuICAgIF0pXG4gICAgcmV0dXJuIHRydWVcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKCdNeVNRTCBlcnJvcjogJywgZSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzZXR1cFVzZXJzVGFibGVcbiJdfQ==