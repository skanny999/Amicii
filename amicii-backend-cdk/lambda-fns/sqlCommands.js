"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesQuery = exports.candidatesQuery = exports.addDefaultFeature10 = exports.addDefaultFeature9 = exports.addDefaultFeature8 = exports.addDefaultFeature7 = exports.addDefaultFeature6 = exports.addDefaultFeature5 = exports.addDefaultFeature4 = exports.addDefaultFeature3 = exports.addDefaultFeature2 = exports.addDefaultFeature1 = exports.addUserToFeatureForeignKey = exports.addFeatureToUserForeignKey = exports.createFeatureRelationQuery = exports.createFeaturesTableQuery = exports.createDislikesTableQuery = exports.createLikesTableQuery = exports.createUsersTableQuery = void 0;
//Tables
exports.createUsersTableQuery = `CREATE TABLE IF NOT EXISTS User (
    id VARCHAR(191) NOT NULL,
    username VARCHAR(191) NOT NULL DEFAULT '',
    age INTEGER NOT NULL DEFAULT 0,
    bio VARCHAR(1000) NOT NULL DEFAULT '',
    genderM DOUBLE NOT NULL DEFAULT 0,
    genderF DOUBLE NOT NULL DEFAULT 0,
    profileEmoji VARCHAR(191) NOT NULL DEFAULT '',
    createdOn DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
exports.createLikesTableQuery = `CREATE TABLE IF NOT EXISTS Likes (
    id INTEGER NOT NULL AUTO_INCREMENT,
    userId VARCHAR(191) NOT NULL,
    likedUserId VARCHAR(191) NOT NULL,

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
exports.createDislikesTableQuery = `CREATE TABLE IF NOT EXISTS Dislikes (
    id INTEGER NOT NULL AUTO_INCREMENT,
    userId VARCHAR(191) NOT NULL,
    dislikedUserId VARCHAR(191) NOT NULL,

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
exports.createFeaturesTableQuery = `CREATE TABLE IF NOT EXISTS Features (
    id INTEGER NOT NULL AUTO_INCREMENT,
    emoji VARCHAR(191) NOT NULL,

    UNIQUE INDEX Features.emoji_unique(emoji),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`;
exports.createFeatureRelationQuery = `CREATE TABLE IF NOT EXISTS _FeaturesToUser (
    A INTEGER NOT NULL,
    B VARCHAR(191) NOT NULL,

    UNIQUE INDEX _FeaturesToUser_AB_unique(A, B),
    INDEX _FeaturesToUser_B_index(B)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
exports.addFeatureToUserForeignKey = `ALTER TABLE _FeaturesToUser ADD FOREIGN KEY (A) REFERENCES Features(id) ON DELETE CASCADE ON UPDATE CASCADE;`;
exports.addUserToFeatureForeignKey = `ALTER TABLE _FeaturesToUser ADD FOREIGN KEY (B) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE;`;
exports.addDefaultFeature1 = `INSERT IGNORE INTO Features VALUES(1, 'PL1');`;
exports.addDefaultFeature2 = `INSERT IGNORE INTO Features VALUES(2, 'PL2');`;
exports.addDefaultFeature3 = `INSERT IGNORE INTO Features VALUES(3, 'PL3');`;
exports.addDefaultFeature4 = `INSERT IGNORE INTO Features VALUES(4, 'PL4');`;
exports.addDefaultFeature5 = `INSERT IGNORE INTO Features VALUES(5, 'PL5');`;
exports.addDefaultFeature6 = `INSERT IGNORE INTO Features VALUES(6, 'PL6');`;
exports.addDefaultFeature7 = `INSERT IGNORE INTO Features VALUES(7, 'PL7');`;
exports.addDefaultFeature8 = `INSERT IGNORE INTO Features VALUES(8, 'PL8');`;
exports.addDefaultFeature9 = `INSERT IGNORE INTO Features VALUES(9, 'PL9');`;
exports.addDefaultFeature10 = `INSERT IGNORE INTO Features VALUES(10, 'PL10');`;
const candidatesQuery = (userId) => {
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
        AND D.DISLIKEDUSERID = '${userId}');`;
};
exports.candidatesQuery = candidatesQuery;
const matchesQuery = (userId) => {
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
    ON AU.ID = MU.USERID;`;
};
exports.matchesQuery = matchesQuery;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsQ29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcWxDb21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxRQUFRO0FBQ0ssUUFBQSxxQkFBcUIsR0FBRzs7Ozs7Ozs7Ozs7NERBV3VCLENBQUE7QUFFL0MsUUFBQSxxQkFBcUIsR0FBRzs7Ozs7OzREQU11QixDQUFBO0FBRS9DLFFBQUEsd0JBQXdCLEdBQUc7Ozs7Ozs0REFNb0IsQ0FBQTtBQUUvQyxRQUFBLHdCQUF3QixHQUFHOzs7Ozs7O0NBT3ZDLENBQUE7QUFFWSxRQUFBLDBCQUEwQixHQUFHOzs7Ozs7NERBTWtCLENBQUE7QUFFL0MsUUFBQSwwQkFBMEIsR0FBRyw4R0FBOEcsQ0FBQTtBQUMzSSxRQUFBLDBCQUEwQixHQUFHLDBHQUEwRyxDQUFBO0FBRXZJLFFBQUEsa0JBQWtCLEdBQUcsK0NBQStDLENBQUE7QUFDcEUsUUFBQSxrQkFBa0IsR0FBRywrQ0FBK0MsQ0FBQTtBQUNwRSxRQUFBLGtCQUFrQixHQUFHLCtDQUErQyxDQUFBO0FBQ3BFLFFBQUEsa0JBQWtCLEdBQUcsK0NBQStDLENBQUE7QUFDcEUsUUFBQSxrQkFBa0IsR0FBRywrQ0FBK0MsQ0FBQTtBQUNwRSxRQUFBLGtCQUFrQixHQUFHLCtDQUErQyxDQUFBO0FBQ3BFLFFBQUEsa0JBQWtCLEdBQUcsK0NBQStDLENBQUE7QUFDcEUsUUFBQSxrQkFBa0IsR0FBRywrQ0FBK0MsQ0FBQTtBQUNwRSxRQUFBLGtCQUFrQixHQUFHLCtDQUErQyxDQUFBO0FBQ3BFLFFBQUEsbUJBQW1CLEdBQUcsaURBQWlELENBQUE7QUFFN0UsTUFBTSxlQUFlLEdBQUcsQ0FBQyxNQUFjLEVBQUUsRUFBRTtJQUM5QyxPQUFPOzs0QkFFaUIsTUFBTTs7O3NCQUdaLE1BQU07Ozs7Ozs0QkFNQSxNQUFNOzs7Ozs7a0NBTUEsTUFBTSxLQUFLLENBQUE7QUFDN0MsQ0FBQyxDQUFBO0FBbkJZLFFBQUEsZUFBZSxtQkFtQjNCO0FBRU0sTUFBTSxZQUFZLEdBQUcsQ0FBQyxNQUFjLEVBQUUsRUFBRTtJQUMzQyxPQUFPOzs7Ozs7O3dCQU9hLE1BQU07OzswQkFHSixDQUFBO0FBQzFCLENBQUMsQ0FBQTtBQVpZLFFBQUEsWUFBWSxnQkFZeEIiLCJzb3VyY2VzQ29udGVudCI6WyIvL1RhYmxlc1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXJzVGFibGVRdWVyeSA9IGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBVc2VyIChcbiAgICBpZCBWQVJDSEFSKDE5MSkgTk9UIE5VTEwsXG4gICAgdXNlcm5hbWUgVkFSQ0hBUigxOTEpIE5PVCBOVUxMIERFRkFVTFQgJycsXG4gICAgYWdlIElOVEVHRVIgTk9UIE5VTEwgREVGQVVMVCAwLFxuICAgIGJpbyBWQVJDSEFSKDEwMDApIE5PVCBOVUxMIERFRkFVTFQgJycsXG4gICAgZ2VuZGVyTSBET1VCTEUgTk9UIE5VTEwgREVGQVVMVCAwLFxuICAgIGdlbmRlckYgRE9VQkxFIE5PVCBOVUxMIERFRkFVTFQgMCxcbiAgICBwcm9maWxlRW1vamkgVkFSQ0hBUigxOTEpIE5PVCBOVUxMIERFRkFVTFQgJycsXG4gICAgY3JlYXRlZE9uIERBVEVUSU1FKDMpIE5PVCBOVUxMIERFRkFVTFQgQ1VSUkVOVF9USU1FU1RBTVAoMyksXG5cbiAgICBQUklNQVJZIEtFWSAoaWQpXG4pIERFRkFVTFQgQ0hBUkFDVEVSIFNFVCB1dGY4bWI0IENPTExBVEUgdXRmOG1iNF91bmljb2RlX2NpO2BcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxpa2VzVGFibGVRdWVyeSA9IGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBMaWtlcyAoXG4gICAgaWQgSU5URUdFUiBOT1QgTlVMTCBBVVRPX0lOQ1JFTUVOVCxcbiAgICB1c2VySWQgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuICAgIGxpa2VkVXNlcklkIFZBUkNIQVIoMTkxKSBOT1QgTlVMTCxcblxuICAgIFBSSU1BUlkgS0VZIChpZClcbikgREVGQVVMVCBDSEFSQUNURVIgU0VUIHV0ZjhtYjQgQ09MTEFURSB1dGY4bWI0X3VuaWNvZGVfY2k7YFxuXG5leHBvcnQgY29uc3QgY3JlYXRlRGlzbGlrZXNUYWJsZVF1ZXJ5ID0gYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIERpc2xpa2VzIChcbiAgICBpZCBJTlRFR0VSIE5PVCBOVUxMIEFVVE9fSU5DUkVNRU5ULFxuICAgIHVzZXJJZCBWQVJDSEFSKDE5MSkgTk9UIE5VTEwsXG4gICAgZGlzbGlrZWRVc2VySWQgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuXG4gICAgUFJJTUFSWSBLRVkgKGlkKVxuKSBERUZBVUxUIENIQVJBQ1RFUiBTRVQgdXRmOG1iNCBDT0xMQVRFIHV0ZjhtYjRfdW5pY29kZV9jaTtgXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVGZWF0dXJlc1RhYmxlUXVlcnkgPSBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgRmVhdHVyZXMgKFxuICAgIGlkIElOVEVHRVIgTk9UIE5VTEwgQVVUT19JTkNSRU1FTlQsXG4gICAgZW1vamkgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuXG4gICAgVU5JUVVFIElOREVYIEZlYXR1cmVzLmVtb2ppX3VuaXF1ZShlbW9qaSksXG4gICAgUFJJTUFSWSBLRVkgKGlkKVxuKSBERUZBVUxUIENIQVJBQ1RFUiBTRVQgdXRmOG1iNCBDT0xMQVRFIHV0ZjhtYjRfdW5pY29kZV9jaTtcbmBcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUZlYXR1cmVSZWxhdGlvblF1ZXJ5ID0gYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIF9GZWF0dXJlc1RvVXNlciAoXG4gICAgQSBJTlRFR0VSIE5PVCBOVUxMLFxuICAgIEIgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuXG4gICAgVU5JUVVFIElOREVYIF9GZWF0dXJlc1RvVXNlcl9BQl91bmlxdWUoQSwgQiksXG4gICAgSU5ERVggX0ZlYXR1cmVzVG9Vc2VyX0JfaW5kZXgoQilcbikgREVGQVVMVCBDSEFSQUNURVIgU0VUIHV0ZjhtYjQgQ09MTEFURSB1dGY4bWI0X3VuaWNvZGVfY2k7YFxuXG5leHBvcnQgY29uc3QgYWRkRmVhdHVyZVRvVXNlckZvcmVpZ25LZXkgPSBgQUxURVIgVEFCTEUgX0ZlYXR1cmVzVG9Vc2VyIEFERCBGT1JFSUdOIEtFWSAoQSkgUkVGRVJFTkNFUyBGZWF0dXJlcyhpZCkgT04gREVMRVRFIENBU0NBREUgT04gVVBEQVRFIENBU0NBREU7YFxuZXhwb3J0IGNvbnN0IGFkZFVzZXJUb0ZlYXR1cmVGb3JlaWduS2V5ID0gYEFMVEVSIFRBQkxFIF9GZWF0dXJlc1RvVXNlciBBREQgRk9SRUlHTiBLRVkgKEIpIFJFRkVSRU5DRVMgVXNlcihpZCkgT04gREVMRVRFIENBU0NBREUgT04gVVBEQVRFIENBU0NBREU7YFxuXG5leHBvcnQgY29uc3QgYWRkRGVmYXVsdEZlYXR1cmUxID0gYElOU0VSVCBJR05PUkUgSU5UTyBGZWF0dXJlcyBWQUxVRVMoMSwgJ1BMMScpO2BcbmV4cG9ydCBjb25zdCBhZGREZWZhdWx0RmVhdHVyZTIgPSBgSU5TRVJUIElHTk9SRSBJTlRPIEZlYXR1cmVzIFZBTFVFUygyLCAnUEwyJyk7YFxuZXhwb3J0IGNvbnN0IGFkZERlZmF1bHRGZWF0dXJlMyA9IGBJTlNFUlQgSUdOT1JFIElOVE8gRmVhdHVyZXMgVkFMVUVTKDMsICdQTDMnKTtgXG5leHBvcnQgY29uc3QgYWRkRGVmYXVsdEZlYXR1cmU0ID0gYElOU0VSVCBJR05PUkUgSU5UTyBGZWF0dXJlcyBWQUxVRVMoNCwgJ1BMNCcpO2BcbmV4cG9ydCBjb25zdCBhZGREZWZhdWx0RmVhdHVyZTUgPSBgSU5TRVJUIElHTk9SRSBJTlRPIEZlYXR1cmVzIFZBTFVFUyg1LCAnUEw1Jyk7YFxuZXhwb3J0IGNvbnN0IGFkZERlZmF1bHRGZWF0dXJlNiA9IGBJTlNFUlQgSUdOT1JFIElOVE8gRmVhdHVyZXMgVkFMVUVTKDYsICdQTDYnKTtgXG5leHBvcnQgY29uc3QgYWRkRGVmYXVsdEZlYXR1cmU3ID0gYElOU0VSVCBJR05PUkUgSU5UTyBGZWF0dXJlcyBWQUxVRVMoNywgJ1BMNycpO2BcbmV4cG9ydCBjb25zdCBhZGREZWZhdWx0RmVhdHVyZTggPSBgSU5TRVJUIElHTk9SRSBJTlRPIEZlYXR1cmVzIFZBTFVFUyg4LCAnUEw4Jyk7YFxuZXhwb3J0IGNvbnN0IGFkZERlZmF1bHRGZWF0dXJlOSA9IGBJTlNFUlQgSUdOT1JFIElOVE8gRmVhdHVyZXMgVkFMVUVTKDksICdQTDknKTtgXG5leHBvcnQgY29uc3QgYWRkRGVmYXVsdEZlYXR1cmUxMCA9IGBJTlNFUlQgSUdOT1JFIElOVE8gRmVhdHVyZXMgVkFMVUVTKDEwLCAnUEwxMCcpO2BcblxuZXhwb3J0IGNvbnN0IGNhbmRpZGF0ZXNRdWVyeSA9ICh1c2VySWQ6IFN0cmluZykgPT4ge1xuICAgIHJldHVybiBgU0VMRUNUIEFVLklEXG4gICAgRlJPTSBVc2VyIEFVXG4gICAgV0hFUkUgQVUuSUQgTk9UIExJS0UgJyR7dXNlcklkfScgICAgICAgICAgLS0gTk9UIE1FXG4gICAgQU5EIEFVLklEIE5PVCBJTiAoU0VMRUNUIERJU0xJS0VEVVNFUklEIC0tIE5PVCBBIFVzZXIgSSBBTFJFQURZIExJS0VcbiAgICAgIEZST00gVXNlciBBLCBEaXNsaWtlc1xuICAgICAgV0hFUkUgQS5JRCA9ICcke3VzZXJJZH0nXG4gICAgICBBTkQgQS5JRCA9IERpc2xpa2VzLlVTRVJJRClcbiAgICBBTkQgQVUuSUQgTk9UIElOIChTRUxFQ1QgSUQgICAgICAgICAgICAgLS0gTk9UIEEgVXNlciBJIERJU0xJS0VcbiAgICAgIEZST00gVXNlclxuICAgICAgSk9JTiAoU0VMRUNUIERJU1RJTkNUIExJS0VEVVNFUklEXG4gICAgICAgICAgICBGUk9NIFVzZXIgQSwgTGlrZXNcbiAgICAgICAgICAgIFdIRVJFIEEuSUQgPSAnJHt1c2VySWR9J1xuICAgICAgICAgICAgQU5EIEEuSUQgPSBMaWtlcy5VU0VSSUQpIEJcbiAgICAgIE9OIFVzZXIuSUQgPSBCLkxJS0VEVVNFUklEKVxuICAgIEFORCBBVS5JRCBOT1QgSU4gKFNFTEVDVCBVLklEICAgICAgICAgICAtLSBOT1QgQSBVc2VyIFRIQVQgRGlzbGlrZXMgTUVcbiAgICAgICAgRlJPTSBVc2VyIFUsIERpc2xpa2VzIERcbiAgICAgICAgV0hFUkUgVS5JRCA9IEQuVVNFUklEXG4gICAgICAgIEFORCBELkRJU0xJS0VEVVNFUklEID0gJyR7dXNlcklkfScpO2Bcbn1cblxuZXhwb3J0IGNvbnN0IG1hdGNoZXNRdWVyeSA9ICh1c2VySWQ6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBgU0VMRUNUIEFVLklEXG4gICAgRlJPTSBVc2VyICBBVVxuICAgIEpPSU4gKFNFTEVDVCBCLlVTRVJJRCBGUk9NXG4gICAgTGlrZXMgQVxuICAgIEpPSU5cbiAgICBMaWtlcyBCXG4gICAgT04gQS5VU0VSSUQgPSBCLkxJS0VEVVNFUklEXG4gICAgV0hFUkUgQS5VU0VSSUQgPSAnJHt1c2VySWR9J1xuICAgIEFORCBCLlVTRVJJRCA9IEEuTElLRURVU0VSSURcbiAgICBBTkQgQS5VU0VSSUQgPSBCLkxJS0VEVVNFUklEKSBNVVxuICAgIE9OIEFVLklEID0gTVUuVVNFUklEO2Bcbn1cblxuXG5cbiJdfQ==