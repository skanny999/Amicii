"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const sqlCommands_1 = require("./sqlCommands");
async function setupDislikesTable() {
    const db = await db_1.getDB();
    try {
        await db.$queryRaw(sqlCommands_1.createDislikesTableQuery);
        return true;
    }
    catch (e) {
        console.log('MySQL error: ', e);
        return false;
    }
}
exports.default = setupDislikesTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBEaXNsaWtlc1RhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dXBEaXNsaWtlc1RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLCtDQUF3RDtBQUV4RCxLQUFLLFVBQVUsa0JBQWtCO0lBQzdCLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFDeEIsSUFBSTtRQUNBLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxzQ0FBd0IsQ0FBQyxDQUFBO1FBQzVDLE9BQU8sSUFBSSxDQUFBO0tBQ2Q7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQy9CLE9BQU8sS0FBSyxDQUFBO0tBQ2Y7QUFDTCxDQUFDO0FBRUQsa0JBQWUsa0JBQWtCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREQiB9IGZyb20gJy4vZGInXG5pbXBvcnQgeyBjcmVhdGVEaXNsaWtlc1RhYmxlUXVlcnkgfSBmcm9tICcuL3NxbENvbW1hbmRzJ1xuXG5hc3luYyBmdW5jdGlvbiBzZXR1cERpc2xpa2VzVGFibGUoKSB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZGIuJHF1ZXJ5UmF3KGNyZWF0ZURpc2xpa2VzVGFibGVRdWVyeSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdNeVNRTCBlcnJvcjogJywgZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzZXR1cERpc2xpa2VzVGFibGUiXX0=