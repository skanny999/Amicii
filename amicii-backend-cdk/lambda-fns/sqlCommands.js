"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandidatesQuery = exports.createUserQuery = exports.addDefaultFeatures = exports.addUserToFeatureForeignKey = exports.addFeatureToUserForeignKey = exports.createFeatureRelationQuery = exports.createFeaturesTableQuery = exports.createDislikesTableQuery = exports.createLikesTableQuery = exports.createUsersTableQuery = void 0;
//Tables
exports.createUsersTableQuery = `CREATE TABLE User (
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
exports.createLikesTableQuery = `CREATE TABLE Likes (
    id INTEGER NOT NULL AUTO_INCREMENT,
    userId VARCHAR(191) NOT NULL,
    likedUserId VARCHAR(191) NOT NULL,

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
exports.createDislikesTableQuery = `CREATE TABLE Dislikes (
    id INTEGER NOT NULL AUTO_INCREMENT,
    userId VARCHAR(191) NOT NULL,
    dislikedUserId VARCHAR(191) NOT NULL,

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
exports.createFeaturesTableQuery = `CREATE TABLE Features (
    id INTEGER NOT NULL AUTO_INCREMENT,
    emoji VARCHAR(191) NOT NULL,

    UNIQUE INDEX Features.emoji_unique(emoji),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
exports.createFeatureRelationQuery = `CREATE TABLE _FeaturesToUser (
    A INTEGER NOT NULL,
    B VARCHAR(191) NOT NULL,

    UNIQUE INDEX _FeaturesToUser_AB_unique(A, B),
    INDEX _FeaturesToUser_B_index(B)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
exports.addFeatureToUserForeignKey = `ALTER TABLE _FeaturesToUser ADD FOREIGN KEY (A) REFERENCES Features(id) ON DELETE CASCADE ON UPDATE CASCADE;`;
exports.addUserToFeatureForeignKey = `ALTER TABLE _FeaturesToUser ADD FOREIGN KEY (B) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE;`;
exports.addDefaultFeatures = `INSERT INTO Features VALUES(1, 'PL1');
INSERT INTO Features VALUES(2, 'PL2');
INSERT INTO Features VALUES(3, 'PL3');
INSERT INTO Features VALUES(4, 'PL4');
INSERT INTO Features VALUES(5, 'PL5');
INSERT INTO Features VALUES(6, 'PL6');
INSERT INTO Features VALUES(7, 'PL7');
INSERT INTO Features VALUES(8, 'PL8');
INSERT INTO Features VALUES(9, 'PL9');
INSERT INTO Features VALUES(10, 'PL10');`;
// User 
exports.createUserQuery = 'INSERT INTO users (id, username, age, bio, profileEmoji) VALUES (:id, :username, :age, :bio, :profileEmoji);';
exports.getCandidatesQuery = 'SELECT * FROM users';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsQ29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcWxDb21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxRQUFRO0FBQ0ssUUFBQSxxQkFBcUIsR0FBRzs7Ozs7Ozs7Ozs7OzREQVl1QixDQUFBO0FBRS9DLFFBQUEscUJBQXFCLEdBQUc7Ozs7Ozs0REFNdUIsQ0FBQTtBQUUvQyxRQUFBLHdCQUF3QixHQUFHOzs7Ozs7NERBTW9CLENBQUE7QUFFL0MsUUFBQSx3QkFBd0IsR0FBRzs7Ozs7OzREQU1vQixDQUFBO0FBRS9DLFFBQUEsMEJBQTBCLEdBQUc7Ozs7Ozs0REFNa0IsQ0FBQTtBQUUvQyxRQUFBLDBCQUEwQixHQUFHLDhHQUE4RyxDQUFBO0FBRTNJLFFBQUEsMEJBQTBCLEdBQUcsMEdBQTBHLENBQUE7QUFFdkksUUFBQSxrQkFBa0IsR0FBRzs7Ozs7Ozs7O3lDQVNPLENBQUE7QUFHekMsUUFBUTtBQUNLLFFBQUEsZUFBZSxHQUFHLDhHQUE4RyxDQUFBO0FBQ2hJLFFBQUEsa0JBQWtCLEdBQUcscUJBQXFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL1RhYmxlc1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXJzVGFibGVRdWVyeSA9IGBDUkVBVEUgVEFCTEUgVXNlciAoXG4gICAgaWQgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuICAgIHVzZXJuYW1lIFZBUkNIQVIoMTkxKSBOT1QgTlVMTCBERUZBVUxUICcnLFxuICAgIGFnZSBJTlRFR0VSIE5PVCBOVUxMIERFRkFVTFQgMCxcbiAgICBiaW8gVkFSQ0hBUigxMDAwKSBOT1QgTlVMTCBERUZBVUxUICcnLFxuICAgIGdlbmRlck0gRE9VQkxFIE5PVCBOVUxMIERFRkFVTFQgMCxcbiAgICBnZW5kZXJGIERPVUJMRSBOT1QgTlVMTCBERUZBVUxUIDAsXG4gICAgcHJvZmlsZUVtb2ppIFZBUkNIQVIoMTkxKSBOT1QgTlVMTCBERUZBVUxUICcnLFxuICAgIGNyZWF0ZWRPbiBEQVRFVElNRSgzKSBOT1QgTlVMTCBERUZBVUxUIENVUlJFTlRfVElNRVNUQU1QKDMpLFxuICAgIGRlc2NyaXB0aW9uIFZBUkNIQVIoMTkxKSBOT1QgTlVMTCBERUZBVUxUICcnLFxuXG4gICAgUFJJTUFSWSBLRVkgKGlkKVxuKSBERUZBVUxUIENIQVJBQ1RFUiBTRVQgdXRmOG1iNCBDT0xMQVRFIHV0ZjhtYjRfdW5pY29kZV9jaTtgXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVMaWtlc1RhYmxlUXVlcnkgPSBgQ1JFQVRFIFRBQkxFIExpa2VzIChcbiAgICBpZCBJTlRFR0VSIE5PVCBOVUxMIEFVVE9fSU5DUkVNRU5ULFxuICAgIHVzZXJJZCBWQVJDSEFSKDE5MSkgTk9UIE5VTEwsXG4gICAgbGlrZWRVc2VySWQgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuXG4gICAgUFJJTUFSWSBLRVkgKGlkKVxuKSBERUZBVUxUIENIQVJBQ1RFUiBTRVQgdXRmOG1iNCBDT0xMQVRFIHV0ZjhtYjRfdW5pY29kZV9jaTtgXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVEaXNsaWtlc1RhYmxlUXVlcnkgPSBgQ1JFQVRFIFRBQkxFIERpc2xpa2VzIChcbiAgICBpZCBJTlRFR0VSIE5PVCBOVUxMIEFVVE9fSU5DUkVNRU5ULFxuICAgIHVzZXJJZCBWQVJDSEFSKDE5MSkgTk9UIE5VTEwsXG4gICAgZGlzbGlrZWRVc2VySWQgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuXG4gICAgUFJJTUFSWSBLRVkgKGlkKVxuKSBERUZBVUxUIENIQVJBQ1RFUiBTRVQgdXRmOG1iNCBDT0xMQVRFIHV0ZjhtYjRfdW5pY29kZV9jaTtgXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVGZWF0dXJlc1RhYmxlUXVlcnkgPSBgQ1JFQVRFIFRBQkxFIEZlYXR1cmVzIChcbiAgICBpZCBJTlRFR0VSIE5PVCBOVUxMIEFVVE9fSU5DUkVNRU5ULFxuICAgIGVtb2ppIFZBUkNIQVIoMTkxKSBOT1QgTlVMTCxcblxuICAgIFVOSVFVRSBJTkRFWCBGZWF0dXJlcy5lbW9qaV91bmlxdWUoZW1vamkpLFxuICAgIFBSSU1BUlkgS0VZIChpZClcbikgREVGQVVMVCBDSEFSQUNURVIgU0VUIHV0ZjhtYjQgQ09MTEFURSB1dGY4bWI0X3VuaWNvZGVfY2k7YFxuXG5leHBvcnQgY29uc3QgY3JlYXRlRmVhdHVyZVJlbGF0aW9uUXVlcnkgPSBgQ1JFQVRFIFRBQkxFIF9GZWF0dXJlc1RvVXNlciAoXG4gICAgQSBJTlRFR0VSIE5PVCBOVUxMLFxuICAgIEIgVkFSQ0hBUigxOTEpIE5PVCBOVUxMLFxuXG4gICAgVU5JUVVFIElOREVYIF9GZWF0dXJlc1RvVXNlcl9BQl91bmlxdWUoQSwgQiksXG4gICAgSU5ERVggX0ZlYXR1cmVzVG9Vc2VyX0JfaW5kZXgoQilcbikgREVGQVVMVCBDSEFSQUNURVIgU0VUIHV0ZjhtYjQgQ09MTEFURSB1dGY4bWI0X3VuaWNvZGVfY2k7YFxuXG5leHBvcnQgY29uc3QgYWRkRmVhdHVyZVRvVXNlckZvcmVpZ25LZXkgPSBgQUxURVIgVEFCTEUgX0ZlYXR1cmVzVG9Vc2VyIEFERCBGT1JFSUdOIEtFWSAoQSkgUkVGRVJFTkNFUyBGZWF0dXJlcyhpZCkgT04gREVMRVRFIENBU0NBREUgT04gVVBEQVRFIENBU0NBREU7YFxuXG5leHBvcnQgY29uc3QgYWRkVXNlclRvRmVhdHVyZUZvcmVpZ25LZXkgPSBgQUxURVIgVEFCTEUgX0ZlYXR1cmVzVG9Vc2VyIEFERCBGT1JFSUdOIEtFWSAoQikgUkVGRVJFTkNFUyBVc2VyKGlkKSBPTiBERUxFVEUgQ0FTQ0FERSBPTiBVUERBVEUgQ0FTQ0FERTtgXG5cbmV4cG9ydCBjb25zdCBhZGREZWZhdWx0RmVhdHVyZXMgPSBgSU5TRVJUIElOVE8gRmVhdHVyZXMgVkFMVUVTKDEsICdQTDEnKTtcbklOU0VSVCBJTlRPIEZlYXR1cmVzIFZBTFVFUygyLCAnUEwyJyk7XG5JTlNFUlQgSU5UTyBGZWF0dXJlcyBWQUxVRVMoMywgJ1BMMycpO1xuSU5TRVJUIElOVE8gRmVhdHVyZXMgVkFMVUVTKDQsICdQTDQnKTtcbklOU0VSVCBJTlRPIEZlYXR1cmVzIFZBTFVFUyg1LCAnUEw1Jyk7XG5JTlNFUlQgSU5UTyBGZWF0dXJlcyBWQUxVRVMoNiwgJ1BMNicpO1xuSU5TRVJUIElOVE8gRmVhdHVyZXMgVkFMVUVTKDcsICdQTDcnKTtcbklOU0VSVCBJTlRPIEZlYXR1cmVzIFZBTFVFUyg4LCAnUEw4Jyk7XG5JTlNFUlQgSU5UTyBGZWF0dXJlcyBWQUxVRVMoOSwgJ1BMOScpO1xuSU5TRVJUIElOVE8gRmVhdHVyZXMgVkFMVUVTKDEwLCAnUEwxMCcpO2BcblxuXG4vLyBVc2VyIFxuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXJRdWVyeSA9ICdJTlNFUlQgSU5UTyB1c2VycyAoaWQsIHVzZXJuYW1lLCBhZ2UsIGJpbywgcHJvZmlsZUVtb2ppKSBWQUxVRVMgKDppZCwgOnVzZXJuYW1lLCA6YWdlLCA6YmlvLCA6cHJvZmlsZUVtb2ppKTsnXG5leHBvcnQgY29uc3QgZ2V0Q2FuZGlkYXRlc1F1ZXJ5ID0gJ1NFTEVDVCAqIEZST00gdXNlcnMnXG4iXX0=