import db from './db'

async function setupUsersTable() {
    try {
        const query = 'CREATE TABLE users (\n' +
            '    id integer,\n' +
            '    username varchar(100),\n' +
            '    bio varchar(1000),\n' +
            '    age integer,\n' +
            '  \tprofileEmojii varchar(50)\n' +
            ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;'
        await db.query(query)
        return true
    } catch (e) {
        console.log('MySQL error: ', e)
        return false
    }
}

export default setupUsersTable;