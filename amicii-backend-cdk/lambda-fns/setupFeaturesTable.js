"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const sqlCommands_1 = require("./sqlCommands");
async function setupFeaturesTable() {
    const db = await db_1.getDB();
    try {
        const createTable = await db.$queryRaw(sqlCommands_1.createFeaturesTableQuery);
        const featureToUserForeignKey = await db.$queryRaw(sqlCommands_1.addFeatureToUserForeignKey);
        const userToFeatureForeignKey = await db.$queryRaw(sqlCommands_1.addUserToFeatureForeignKey);
        const defaultFeatures = await db.$queryRaw(sqlCommands_1.addDefaultFeatures);
        await db.$transaction([createTable, featureToUserForeignKey, userToFeatureForeignKey, defaultFeatures]);
        return true;
    }
    catch (e) {
        console.log('MySQL error: ', e);
        return false;
    }
}
exports.default = setupFeaturesTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBGZWF0dXJlc1RhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dXBGZWF0dXJlc1RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLCtDQUFxSTtBQUVySSxLQUFLLFVBQVUsa0JBQWtCO0lBQzdCLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFDeEIsSUFBSTtRQUNBLE1BQU0sV0FBVyxHQUFHLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxzQ0FBd0IsQ0FBQyxDQUFBO1FBQ2hFLE1BQU0sdUJBQXVCLEdBQUcsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLHdDQUEwQixDQUFDLENBQUE7UUFDOUUsTUFBTSx1QkFBdUIsR0FBRyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsd0NBQTBCLENBQUMsQ0FBQTtRQUM5RSxNQUFNLGVBQWUsR0FBRyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0NBQWtCLENBQUMsQ0FBQTtRQUM5RCxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLEVBQUUsdUJBQXVCLEVBQUUsdUJBQXVCLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQTtRQUN2RyxPQUFPLElBQUksQ0FBQztLQUNmO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMvQixPQUFPLEtBQUssQ0FBQTtLQUNmO0FBQ0wsQ0FBQztBQUVELGtCQUFlLGtCQUFrQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0REIgfSBmcm9tICcuL2RiJ1xuaW1wb3J0IHsgY3JlYXRlRmVhdHVyZXNUYWJsZVF1ZXJ5LCBhZGRGZWF0dXJlVG9Vc2VyRm9yZWlnbktleSwgYWRkVXNlclRvRmVhdHVyZUZvcmVpZ25LZXksIGFkZERlZmF1bHRGZWF0dXJlcyB9IGZyb20gJy4vc3FsQ29tbWFuZHMnO1xuXG5hc3luYyBmdW5jdGlvbiBzZXR1cEZlYXR1cmVzVGFibGUoKSB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY3JlYXRlVGFibGUgPSBhd2FpdCBkYi4kcXVlcnlSYXcoY3JlYXRlRmVhdHVyZXNUYWJsZVF1ZXJ5KVxuICAgICAgICBjb25zdCBmZWF0dXJlVG9Vc2VyRm9yZWlnbktleSA9IGF3YWl0IGRiLiRxdWVyeVJhdyhhZGRGZWF0dXJlVG9Vc2VyRm9yZWlnbktleSlcbiAgICAgICAgY29uc3QgdXNlclRvRmVhdHVyZUZvcmVpZ25LZXkgPSBhd2FpdCBkYi4kcXVlcnlSYXcoYWRkVXNlclRvRmVhdHVyZUZvcmVpZ25LZXkpXG4gICAgICAgIGNvbnN0IGRlZmF1bHRGZWF0dXJlcyA9IGF3YWl0IGRiLiRxdWVyeVJhdyhhZGREZWZhdWx0RmVhdHVyZXMpXG4gICAgICAgIGF3YWl0IGRiLiR0cmFuc2FjdGlvbihbY3JlYXRlVGFibGUsIGZlYXR1cmVUb1VzZXJGb3JlaWduS2V5LCB1c2VyVG9GZWF0dXJlRm9yZWlnbktleSwgZGVmYXVsdEZlYXR1cmVzXSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnTXlTUUwgZXJyb3I6ICcsIGUpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc2V0dXBGZWF0dXJlc1RhYmxlIl19