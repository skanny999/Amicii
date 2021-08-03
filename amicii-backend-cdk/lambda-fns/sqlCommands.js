"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandidatesQuery = exports.createUserQuery = exports.createFeaturesTableQuery = exports.createDislikesTableQuery = exports.createLikesTableQuery = exports.createUsersTableQuery = void 0;
//Tables
exports.createUsersTableQuery = 'CREATE TABLE users (\n' +
    '\tid varchar(100),\n' +
    '\tusername varchar(100),\n' +
    '\tbio varchar(1000),\n' +
    '\tage integer,\n' +
    '\tprofileEmoji varchar(50)\n' +
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;';
exports.createLikesTableQuery = 'CREATE TABLE likes(\n' +
    '\tuserId integer,\n' +
    '\tlikedUserId integer\n' +
    ');';
exports.createDislikesTableQuery = 'CREATE TABLE dislikes(\n' +
    '\tuserId integer,\n' +
    '\tdislikedUserId integer\n' +
    ');';
exports.createFeaturesTableQuery = "CREATE TABLE features(\n" +
    "\tuserId integer,\n" +
    "\temoji varchar(20),\n" +
    "\tcode varchar(20)\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;\n";
// User 
exports.createUserQuery = 'INSERT INTO users (id, username, age, bio, profileEmoji) VALUES (:id, :username, :age, :bio, :profileEmoji);';
exports.getCandidatesQuery = 'SELECT * FROM users';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsQ29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcWxDb21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxRQUFRO0FBQ0ssUUFBQSxxQkFBcUIsR0FBRyx3QkFBd0I7SUFDN0Qsc0JBQXNCO0lBQ3RCLDRCQUE0QjtJQUM1Qix3QkFBd0I7SUFDeEIsa0JBQWtCO0lBQ2xCLDhCQUE4QjtJQUM5QixxRUFBcUUsQ0FBQTtBQUN4RCxRQUFBLHFCQUFxQixHQUFHLHVCQUF1QjtJQUM1RCxxQkFBcUI7SUFDckIseUJBQXlCO0lBQ3pCLElBQUksQ0FBQTtBQUNTLFFBQUEsd0JBQXdCLEdBQUcsMEJBQTBCO0lBQ2xFLHFCQUFxQjtJQUNyQiw0QkFBNEI7SUFDNUIsSUFBSSxDQUFBO0FBQ1MsUUFBQSx3QkFBd0IsR0FBRywwQkFBMEI7SUFDbEUscUJBQXFCO0lBQ3JCLHdCQUF3QjtJQUN4QixzQkFBc0I7SUFDdEIsdUVBQXVFLENBQUE7QUFHdkUsUUFBUTtBQUNLLFFBQUEsZUFBZSxHQUFHLDhHQUE4RyxDQUFBO0FBQ2hJLFFBQUEsa0JBQWtCLEdBQUcscUJBQXFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL1RhYmxlc1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXJzVGFibGVRdWVyeSA9ICdDUkVBVEUgVEFCTEUgdXNlcnMgKFxcbicgK1xuJ1xcdGlkIHZhcmNoYXIoMTAwKSxcXG4nICtcbidcXHR1c2VybmFtZSB2YXJjaGFyKDEwMCksXFxuJyArXG4nXFx0YmlvIHZhcmNoYXIoMTAwMCksXFxuJyArXG4nXFx0YWdlIGludGVnZXIsXFxuJyArXG4nXFx0cHJvZmlsZUVtb2ppIHZhcmNoYXIoNTApXFxuJyArXG4nKSBFTkdJTkU9SW5ub0RCIERFRkFVTFQgQ0hBUlNFVD11dGY4bWI0IENPTExBVEUgdXRmOG1iNF91bmljb2RlX2NpOydcbmV4cG9ydCBjb25zdCBjcmVhdGVMaWtlc1RhYmxlUXVlcnkgPSAnQ1JFQVRFIFRBQkxFIGxpa2VzKFxcbicgK1xuJ1xcdHVzZXJJZCBpbnRlZ2VyLFxcbicgK1xuJ1xcdGxpa2VkVXNlcklkIGludGVnZXJcXG4nICtcbicpOydcbmV4cG9ydCBjb25zdCBjcmVhdGVEaXNsaWtlc1RhYmxlUXVlcnkgPSAnQ1JFQVRFIFRBQkxFIGRpc2xpa2VzKFxcbicgK1xuJ1xcdHVzZXJJZCBpbnRlZ2VyLFxcbicgK1xuJ1xcdGRpc2xpa2VkVXNlcklkIGludGVnZXJcXG4nICtcbicpOydcbmV4cG9ydCBjb25zdCBjcmVhdGVGZWF0dXJlc1RhYmxlUXVlcnkgPSBcIkNSRUFURSBUQUJMRSBmZWF0dXJlcyhcXG5cIiArXG5cIlxcdHVzZXJJZCBpbnRlZ2VyLFxcblwiICtcblwiXFx0ZW1vamkgdmFyY2hhcigyMCksXFxuXCIgK1xuXCJcXHRjb2RlIHZhcmNoYXIoMjApXFxuXCIgK1xuXCIpIEVOR0lORT1Jbm5vREIgREVGQVVMVCBDSEFSU0VUPXV0ZjhtYjQgQ09MTEFURSB1dGY4bWI0X3VuaWNvZGVfY2k7XFxuXCJcblxuXG4vLyBVc2VyIFxuZXhwb3J0IGNvbnN0IGNyZWF0ZVVzZXJRdWVyeSA9ICdJTlNFUlQgSU5UTyB1c2VycyAoaWQsIHVzZXJuYW1lLCBhZ2UsIGJpbywgcHJvZmlsZUVtb2ppKSBWQUxVRVMgKDppZCwgOnVzZXJuYW1lLCA6YWdlLCA6YmlvLCA6cHJvZmlsZUVtb2ppKTsnXG5leHBvcnQgY29uc3QgZ2V0Q2FuZGlkYXRlc1F1ZXJ5ID0gJ1NFTEVDVCAqIEZST00gdXNlcnMnXG4iXX0=