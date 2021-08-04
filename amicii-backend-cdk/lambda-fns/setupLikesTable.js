"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const sqlCommands_1 = require("./sqlCommands");
async function setupLikesTable() {
    const db = await db_1.getDB();
    try {
        await db.$queryRaw(sqlCommands_1.createLikesTableQuery);
        return true;
    }
    catch (e) {
        console.log('MySQL error: ', e);
        return false;
    }
}
exports.default = setupLikesTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBMaWtlc1RhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dXBMaWtlc1RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLCtDQUFxRDtBQUVyRCxLQUFLLFVBQVUsZUFBZTtJQUMxQixNQUFNLEVBQUUsR0FBRyxNQUFNLFVBQUssRUFBRSxDQUFBO0lBQ3hCLElBQUk7UUFDQSxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsbUNBQXFCLENBQUMsQ0FBQTtRQUN6QyxPQUFPLElBQUksQ0FBQTtLQUNkO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMvQixPQUFPLEtBQUssQ0FBQTtLQUNmO0FBQ0wsQ0FBQztBQUVELGtCQUFlLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcbmltcG9ydCB7IGNyZWF0ZUxpa2VzVGFibGVRdWVyeSB9IGZyb20gJy4vc3FsQ29tbWFuZHMnXG5cbmFzeW5jIGZ1bmN0aW9uIHNldHVwTGlrZXNUYWJsZSgpIHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERCKClcbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBkYi4kcXVlcnlSYXcoY3JlYXRlTGlrZXNUYWJsZVF1ZXJ5KVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ015U1FMIGVycm9yOiAnLCBlKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNldHVwTGlrZXNUYWJsZSJdfQ==