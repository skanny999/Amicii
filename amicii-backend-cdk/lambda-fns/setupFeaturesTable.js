"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const sqlCommands_1 = require("./sqlCommands");
async function setupFeaturesTable() {
    const db = await db_1.getDB();
    try {
        await Promise.all([
            db.$queryRaw(sqlCommands_1.createFeaturesTableQuery),
            db.$queryRaw(sqlCommands_1.createFeatureRelationQuery),
            db.$queryRaw(sqlCommands_1.addFeatureToUserForeignKey),
            db.$queryRaw(sqlCommands_1.addUserToFeatureForeignKey),
        ]);
        return true;
    }
    catch (e) {
        console.log('MySQL error: ', e);
        return false;
    }
}
exports.default = setupFeaturesTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBGZWF0dXJlc1RhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dXBGZWF0dXJlc1RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLCtDQUtzQjtBQUV0QixLQUFLLFVBQVUsa0JBQWtCO0lBQy9CLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFDeEIsSUFBSTtRQUNGLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDLHNDQUF3QixDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxTQUFTLENBQUMsd0NBQTBCLENBQUM7WUFDeEMsRUFBRSxDQUFDLFNBQVMsQ0FBQyx3Q0FBMEIsQ0FBQztZQUN4QyxFQUFFLENBQUMsU0FBUyxDQUFDLHdDQUEwQixDQUFDO1NBQ3pDLENBQUMsQ0FBQTtRQUNGLE9BQU8sSUFBSSxDQUFBO0tBQ1o7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQy9CLE9BQU8sS0FBSyxDQUFBO0tBQ2I7QUFDSCxDQUFDO0FBRUQsa0JBQWUsa0JBQWtCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREQiB9IGZyb20gJy4vZGInXG5pbXBvcnQge1xuICBjcmVhdGVGZWF0dXJlc1RhYmxlUXVlcnksXG4gIGFkZEZlYXR1cmVUb1VzZXJGb3JlaWduS2V5LFxuICBhZGRVc2VyVG9GZWF0dXJlRm9yZWlnbktleSxcbiAgY3JlYXRlRmVhdHVyZVJlbGF0aW9uUXVlcnksXG59IGZyb20gJy4vc3FsQ29tbWFuZHMnXG5cbmFzeW5jIGZ1bmN0aW9uIHNldHVwRmVhdHVyZXNUYWJsZSgpIHtcbiAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gIHRyeSB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgZGIuJHF1ZXJ5UmF3KGNyZWF0ZUZlYXR1cmVzVGFibGVRdWVyeSksXG4gICAgICBkYi4kcXVlcnlSYXcoY3JlYXRlRmVhdHVyZVJlbGF0aW9uUXVlcnkpLFxuICAgICAgZGIuJHF1ZXJ5UmF3KGFkZEZlYXR1cmVUb1VzZXJGb3JlaWduS2V5KSxcbiAgICAgIGRiLiRxdWVyeVJhdyhhZGRVc2VyVG9GZWF0dXJlRm9yZWlnbktleSksXG4gICAgXSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coJ015U1FMIGVycm9yOiAnLCBlKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNldHVwRmVhdHVyZXNUYWJsZVxuIl19