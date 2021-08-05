"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandidatesQuery = exports.createUserQuery = exports.addDefaultFeatures = exports.addUserToFeatureForeignKey = exports.addFeatureToUserForeignKey = exports.createFeatureRelationQuery = exports.createFeaturesTableQuery = exports.createDislikesTableQuery = exports.createLikesTableQuery = exports.createUsersTableQuery = void 0;
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
    description VARCHAR(191) NOT NULL DEFAULT '',

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
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
exports.createFeatureRelationQuery = `CREATE TABLE IF NOT EXISTS _FeaturesToUser (
    A INTEGER NOT NULL,
    B VARCHAR(191) NOT NULL,

    UNIQUE INDEX _FeaturesToUser_AB_unique(A, B),
    INDEX _FeaturesToUser_B_index(B)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
exports.addFeatureToUserForeignKey = `ALTER TABLE _FeaturesToUser ADD FOREIGN KEY (A) REFERENCES Features(id) ON DELETE CASCADE ON UPDATE CASCADE;`;
exports.addUserToFeatureForeignKey = `ALTER TABLE _FeaturesToUser ADD FOREIGN KEY (B) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE;`;
exports.addDefaultFeatures = `INSERT IGNORE INTO Features VALUES(1, 'PL1');
INSERT IGNORE INTO Features VALUES(2, 'PL2');
INSERT IGNORE INTO Features VALUES(3, 'PL3');
INSERT IGNORE INTO Features VALUES(4, 'PL4');
INSERT IGNORE INTO Features VALUES(5, 'PL5');
INSERT IGNORE INTO Features VALUES(6, 'PL6');
INSERT IGNORE INTO Features VALUES(7, 'PL7');
INSERT IGNORE INTO Features VALUES(8, 'PL8');
INSERT IGNORE INTO Features VALUES(9, 'PL9');
INSERT IGNORE INTO Features VALUES(10, 'PL10');`;
// User 
exports.createUserQuery = 'INSERT INTO users (id, username, age, bio, profileEmoji) VALUES (:id, :username, :age, :bio, :profileEmoji);';
exports.getCandidatesQuery = 'SELECT * FROM users';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsQ29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcWxDb21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxRQUFRO0FBQ0ssUUFBQSxxQkFBcUIsR0FBRzs7Ozs7Ozs7Ozs7OzREQVl1QixDQUFBO0FBRS9DLFFBQUEscUJBQXFCLEdBQUc7Ozs7Ozs0REFNdUIsQ0FBQTtBQUUvQyxRQUFBLHdCQUF3QixHQUFHOzs7Ozs7NERBTW9CLENBQUE7QUFFL0MsUUFBQSx3QkFBd0IsR0FBRzs7Ozs7OzREQU1vQixDQUFBO0FBRS9DLFFBQUEsMEJBQTBCLEdBQUc7Ozs7Ozs0REFNa0IsQ0FBQTtBQUUvQyxRQUFBLDBCQUEwQixHQUFHLDhHQUE4RyxDQUFBO0FBRTNJLFFBQUEsMEJBQTBCLEdBQUcsMEdBQTBHLENBQUE7QUFFdkksUUFBQSxrQkFBa0IsR0FBRzs7Ozs7Ozs7O2dEQVNjLENBQUE7QUFHaEQsUUFBUTtBQUNLLFFBQUEsZUFBZSxHQUFHLDhHQUE4RyxDQUFBO0FBQ2hJLFFBQUEsa0JBQWtCLEdBQUcscUJBQXFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL1RhYmxlc1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXJzVGFibGVRdWVyeSA9IGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBVc2VyIChcbiAgICBpZCBWQVJDSEFSKDE5MSkgTk9UIE5VTEwsXG4gICAgdXNlcm5hbWUgVkFSQ0hBUigxOTEpIE5PVCBOVUxMIERFRkFVTFQgJycsXG4gICAgYWdlIElOVEVHRVIgTk9UIE5VTEwgREVGQVVMVCAwLFxuICAgIGJpbyBWQVJDSEFSKDEwMDApIE5PVCBOVUxMIERFRkFVTFQgJycsXG4gICAgZ2VuZGVyTSBET1VCTEUgTk9UIE5VTEwgREVGQVVMVCAwLFxuICAgIGdlbmRlckYgRE9VQkxFIE5PVCBOVUxMIERFRkFVTFQgMCxcbiAgICBwcm9maWxlRW1vamkgVkFSQ0hBUigxOTEpIE5PVCBOVUxMIERFRkFVTFQgJycsXG4gICAgY3JlYXRlZE9uIERBVEVUSU1FKDMpIE5PVCBOVUxMIERFRkFVTFQgQ1VSUkVOVF9USU1FU1RBTVAoMyksXG4gICAgZGVzY3JpcHRpb24gVkFSQ0hBUigxOTEpIE5PVCBOVUxMIERFRkFVTFQgJycsXG5cbiAgICBQUklNQVJZIEtFWSAoaWQpXG4pIERFRkFVTFQgQ0hBUkFDVEVSIFNFVCB1dGY4bWI0IENPTExBVEUgdXRmOG1iNF91bmljb2RlX2NpO2BcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxpa2VzVGFibGVRdWVyeSA9IGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBMaWtlcyAoXG4gICAgaWQgSU5URUdFUiBOT1QgTlVMTCBBVVRPX0lOQ1JFTUVOVCxcbiAgICB1c2VySWQgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuICAgIGxpa2VkVXNlcklkIFZBUkNIQVIoMTkxKSBOT1QgTlVMTCxcblxuICAgIFBSSU1BUlkgS0VZIChpZClcbikgREVGQVVMVCBDSEFSQUNURVIgU0VUIHV0ZjhtYjQgQ09MTEFURSB1dGY4bWI0X3VuaWNvZGVfY2k7YFxuXG5leHBvcnQgY29uc3QgY3JlYXRlRGlzbGlrZXNUYWJsZVF1ZXJ5ID0gYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIERpc2xpa2VzIChcbiAgICBpZCBJTlRFR0VSIE5PVCBOVUxMIEFVVE9fSU5DUkVNRU5ULFxuICAgIHVzZXJJZCBWQVJDSEFSKDE5MSkgTk9UIE5VTEwsXG4gICAgZGlzbGlrZWRVc2VySWQgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuXG4gICAgUFJJTUFSWSBLRVkgKGlkKVxuKSBERUZBVUxUIENIQVJBQ1RFUiBTRVQgdXRmOG1iNCBDT0xMQVRFIHV0ZjhtYjRfdW5pY29kZV9jaTtgXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVGZWF0dXJlc1RhYmxlUXVlcnkgPSBgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgRmVhdHVyZXMgKFxuICAgIGlkIElOVEVHRVIgTk9UIE5VTEwgQVVUT19JTkNSRU1FTlQsXG4gICAgZW1vamkgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuXG4gICAgVU5JUVVFIElOREVYIEZlYXR1cmVzLmVtb2ppX3VuaXF1ZShlbW9qaSksXG4gICAgUFJJTUFSWSBLRVkgKGlkKVxuKSBERUZBVUxUIENIQVJBQ1RFUiBTRVQgdXRmOG1iNCBDT0xMQVRFIHV0ZjhtYjRfdW5pY29kZV9jaTtgXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVGZWF0dXJlUmVsYXRpb25RdWVyeSA9IGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBfRmVhdHVyZXNUb1VzZXIgKFxuICAgIEEgSU5URUdFUiBOT1QgTlVMTCxcbiAgICBCIFZBUkNIQVIoMTkxKSBOT1QgTlVMTCxcblxuICAgIFVOSVFVRSBJTkRFWCBfRmVhdHVyZXNUb1VzZXJfQUJfdW5pcXVlKEEsIEIpLFxuICAgIElOREVYIF9GZWF0dXJlc1RvVXNlcl9CX2luZGV4KEIpXG4pIERFRkFVTFQgQ0hBUkFDVEVSIFNFVCB1dGY4bWI0IENPTExBVEUgdXRmOG1iNF91bmljb2RlX2NpO2BcblxuZXhwb3J0IGNvbnN0IGFkZEZlYXR1cmVUb1VzZXJGb3JlaWduS2V5ID0gYEFMVEVSIFRBQkxFIF9GZWF0dXJlc1RvVXNlciBBREQgRk9SRUlHTiBLRVkgKEEpIFJFRkVSRU5DRVMgRmVhdHVyZXMoaWQpIE9OIERFTEVURSBDQVNDQURFIE9OIFVQREFURSBDQVNDQURFO2BcblxuZXhwb3J0IGNvbnN0IGFkZFVzZXJUb0ZlYXR1cmVGb3JlaWduS2V5ID0gYEFMVEVSIFRBQkxFIF9GZWF0dXJlc1RvVXNlciBBREQgRk9SRUlHTiBLRVkgKEIpIFJFRkVSRU5DRVMgVXNlcihpZCkgT04gREVMRVRFIENBU0NBREUgT04gVVBEQVRFIENBU0NBREU7YFxuXG5leHBvcnQgY29uc3QgYWRkRGVmYXVsdEZlYXR1cmVzID0gYElOU0VSVCBJR05PUkUgSU5UTyBGZWF0dXJlcyBWQUxVRVMoMSwgJ1BMMScpO1xuSU5TRVJUIElHTk9SRSBJTlRPIEZlYXR1cmVzIFZBTFVFUygyLCAnUEwyJyk7XG5JTlNFUlQgSUdOT1JFIElOVE8gRmVhdHVyZXMgVkFMVUVTKDMsICdQTDMnKTtcbklOU0VSVCBJR05PUkUgSU5UTyBGZWF0dXJlcyBWQUxVRVMoNCwgJ1BMNCcpO1xuSU5TRVJUIElHTk9SRSBJTlRPIEZlYXR1cmVzIFZBTFVFUyg1LCAnUEw1Jyk7XG5JTlNFUlQgSUdOT1JFIElOVE8gRmVhdHVyZXMgVkFMVUVTKDYsICdQTDYnKTtcbklOU0VSVCBJR05PUkUgSU5UTyBGZWF0dXJlcyBWQUxVRVMoNywgJ1BMNycpO1xuSU5TRVJUIElHTk9SRSBJTlRPIEZlYXR1cmVzIFZBTFVFUyg4LCAnUEw4Jyk7XG5JTlNFUlQgSUdOT1JFIElOVE8gRmVhdHVyZXMgVkFMVUVTKDksICdQTDknKTtcbklOU0VSVCBJR05PUkUgSU5UTyBGZWF0dXJlcyBWQUxVRVMoMTAsICdQTDEwJyk7YFxuXG5cbi8vIFVzZXIgXG5leHBvcnQgY29uc3QgY3JlYXRlVXNlclF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIHVzZXJzIChpZCwgdXNlcm5hbWUsIGFnZSwgYmlvLCBwcm9maWxlRW1vamkpIFZBTFVFUyAoOmlkLCA6dXNlcm5hbWUsIDphZ2UsIDpiaW8sIDpwcm9maWxlRW1vamkpOydcbmV4cG9ydCBjb25zdCBnZXRDYW5kaWRhdGVzUXVlcnkgPSAnU0VMRUNUICogRlJPTSB1c2VycydcbiJdfQ==