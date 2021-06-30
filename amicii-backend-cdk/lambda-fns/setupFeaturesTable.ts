import db from './db'

async function setupFeaturesTable() {
    try {
        const query = "CREATE TABLE features(\n" +
            "\tuserId integer,\n" +
            "\temoji varchar(20),\n" +
            "\tcode varchar(20)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;\n"
        await db.query(query)
        return true
    } catch (e) {
        console.log('MySQL error: ', e)
        return false
    }
}

export default setupFeaturesTable