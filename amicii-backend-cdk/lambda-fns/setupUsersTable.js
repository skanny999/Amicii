"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import db from './db'
const db_1 = require("./db");
const sqlCommands_1 = require("./sqlCommands");
async function setupUsersTable() {
    const db = await db_1.getDB();
    try {
        await db.$queryRaw(sqlCommands_1.createUsersTableQuery);
        return true;
    }
    catch (e) {
        console.log('MySQL error: ', e);
        return false;
    }
}
exports.default = setupUsersTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBVc2Vyc1RhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2V0dXBVc2Vyc1RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0JBQXdCO0FBQ3hCLDZCQUE0QjtBQUM1QiwrQ0FBcUQ7QUFFckQsS0FBSyxVQUFVLGVBQWU7SUFDMUIsTUFBTSxFQUFFLEdBQUcsTUFBTSxVQUFLLEVBQUUsQ0FBQTtJQUN4QixJQUFJO1FBQ0EsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLG1DQUFxQixDQUFDLENBQUE7UUFDekMsT0FBTyxJQUFJLENBQUE7S0FDZDtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDL0IsT0FBTyxLQUFLLENBQUE7S0FDZjtBQUNMLENBQUM7QUFFRCxrQkFBZSxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgZGIgZnJvbSAnLi9kYidcbmltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcbmltcG9ydCB7IGNyZWF0ZVVzZXJzVGFibGVRdWVyeSB9IGZyb20gJy4vc3FsQ29tbWFuZHMnXG5cbmFzeW5jIGZ1bmN0aW9uIHNldHVwVXNlcnNUYWJsZSgpIHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERCKClcbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBkYi4kcXVlcnlSYXcoY3JlYXRlVXNlcnNUYWJsZVF1ZXJ5KVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ015U1FMIGVycm9yOiAnLCBlKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNldHVwVXNlcnNUYWJsZTsiXX0=