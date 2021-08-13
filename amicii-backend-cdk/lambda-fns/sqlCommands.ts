//Tables
export const createUsersTableQuery = `CREATE TABLE IF NOT EXISTS User (
    id VARCHAR(191) NOT NULL,
    username VARCHAR(191) NOT NULL DEFAULT '',
    age INTEGER NOT NULL DEFAULT 0,
    bio VARCHAR(1000) NOT NULL DEFAULT '',
    genderM DOUBLE NOT NULL DEFAULT 0,
    genderF DOUBLE NOT NULL DEFAULT 0,
    profileEmoji VARCHAR(191) NOT NULL DEFAULT '',
    createdOn DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

export const createLikesTableQuery = `CREATE TABLE IF NOT EXISTS Likes (
    id INTEGER NOT NULL AUTO_INCREMENT,
    userId VARCHAR(191) NOT NULL,
    likedUserId VARCHAR(191) NOT NULL,

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

export const createDislikesTableQuery = `CREATE TABLE IF NOT EXISTS Dislikes (
    id INTEGER NOT NULL AUTO_INCREMENT,
    userId VARCHAR(191) NOT NULL,
    dislikedUserId VARCHAR(191) NOT NULL,

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

export const createFeaturesTableQuery = `CREATE TABLE IF NOT EXISTS Features (
    id INTEGER NOT NULL AUTO_INCREMENT,
    emoji VARCHAR(191) NOT NULL,

    UNIQUE INDEX Features.emoji_unique(emoji),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`

export const createFeatureRelationQuery = `CREATE TABLE IF NOT EXISTS _FeaturesToUser (
    A INTEGER NOT NULL,
    B VARCHAR(191) NOT NULL,

    UNIQUE INDEX _FeaturesToUser_AB_unique(A, B),
    INDEX _FeaturesToUser_B_index(B)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

export const addFeatureToUserForeignKey = `ALTER TABLE _FeaturesToUser ADD FOREIGN KEY (A) REFERENCES Features(id) ON DELETE CASCADE ON UPDATE CASCADE;`
export const addUserToFeatureForeignKey = `ALTER TABLE _FeaturesToUser ADD FOREIGN KEY (B) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE;`

export const addDefaultFeature1 = `INSERT IGNORE INTO Features VALUES(1, 'PH1');`
export const addDefaultFeature2 = `INSERT IGNORE INTO Features VALUES(2, 'PH2');`
export const addDefaultFeature3 = `INSERT IGNORE INTO Features VALUES(3, 'PH3');`
export const addDefaultFeature4 = `INSERT IGNORE INTO Features VALUES(4, 'PH4');`
export const addDefaultFeature5 = `INSERT IGNORE INTO Features VALUES(5, 'PH5');`
export const addDefaultFeature6 = `INSERT IGNORE INTO Features VALUES(6, 'PH6');`
export const addDefaultFeature7 = `INSERT IGNORE INTO Features VALUES(7, 'PH7');`
export const addDefaultFeature8 = `INSERT IGNORE INTO Features VALUES(8, 'PH8');`
export const addDefaultFeature9 = `INSERT IGNORE INTO Features VALUES(9, 'PH9');`
export const addDefaultFeature10 = `INSERT IGNORE INTO Features VALUES(10, 'PH10');`

export const candidatesQuery = (userId: String) => {
    return `SELECT AU.ID
    FROM User AU
    WHERE AU.ID NOT LIKE '${userId}'          -- NOT ME
    AND AU.ID NOT IN (SELECT DISLIKEDUSERID -- NOT A User I ALREADY LIKE
      FROM User A, Dislikes
      WHERE A.ID = '${userId}'
      AND A.ID = Dislikes.USERID)
    AND AU.ID NOT IN (SELECT ID             -- NOT A User I DISLIKE
      FROM User
      JOIN (SELECT DISTINCT LIKEDUSERID
            FROM User A, Likes
            WHERE A.ID = '${userId}'
            AND A.ID = Likes.USERID) B
      ON User.ID = B.LIKEDUSERID)
    AND AU.ID NOT IN (SELECT U.ID           -- NOT A User THAT Dislikes ME
        FROM User U, Dislikes D
        WHERE U.ID = D.USERID
        AND D.DISLIKEDUSERID = '${userId}');`
}

export const matchesQuery = (userId: string) => {
    return `SELECT AU.ID
    FROM User  AU
    JOIN (SELECT B.USERID FROM
    Likes A
    JOIN
    Likes B
    ON A.USERID = B.LIKEDUSERID
    WHERE A.USERID = '${userId}'
    AND B.USERID = A.LIKEDUSERID
    AND A.USERID = B.LIKEDUSERID) MU
    ON AU.ID = MU.USERID;`
}



