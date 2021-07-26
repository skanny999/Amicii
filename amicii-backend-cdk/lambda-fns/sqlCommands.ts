//Tables
export const createUsersTableQuery = 'CREATE TABLE users (\n' +
'\tid varchar(100),\n' +
'\tusername varchar(100),\n' +
'\tbio varchar(1000),\n' +
'\tage integer,\n' +
'\tprofileEmoji varchar(50)\n' +
') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;'
export const createLikesTableQuery = 'CREATE TABLE likes(\n' +
'\tuserId integer,\n' +
'\tlikedUserId integer\n' +
');'
export const createDislikesTableQuery = 'CREATE TABLE dislikes(\n' +
'\tuserId integer,\n' +
'\tdislikedUserId integer\n' +
');'
export const createFeaturesTableQuery = "CREATE TABLE features(\n" +
"\tuserId integer,\n" +
"\temoji varchar(20),\n" +
"\tcode varchar(20)\n" +
") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;\n"


// User 
export const createUserQuery = 'INSERT INTO users (id, username, age, bio, profileEmoji) VALUES (:id, :username, :age, :bio, :profileEmoji);'
export const getCandidatesQuery = 'SELECT * FROM users'
