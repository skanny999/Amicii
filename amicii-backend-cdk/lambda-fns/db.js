"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = void 0;
const client_1 = require("@prisma/client");
const aws_sdk_1 = require("aws-sdk");
const sm = new aws_sdk_1.SecretsManager();
let db;
const getDB = async () => {
    if (db)
        return db;
    const dbURL = await sm
        .getSecretValue({
        SecretId: process.env.SECRET_ARN || '',
    })
        .promise();
    const secretString = JSON.parse(dbURL.SecretString || '{}');
    const url = `mysql://${secretString.username}:${secretString.password}@${secretString.host}:${secretString.port}/${secretString.dbname}?connection_limit=2`;
    db = new client_1.PrismaClient({
        datasources: { db: { url } },
    });
    return db;
};
exports.getDB = getDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBNkM7QUFDN0MscUNBQXdDO0FBRXhDLE1BQU0sRUFBRSxHQUFHLElBQUksd0JBQWMsRUFBRSxDQUFBO0FBQy9CLElBQUksRUFBZ0IsQ0FBQTtBQUViLE1BQU0sS0FBSyxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQzlCLElBQUksRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFBO0lBRWpCLE1BQU0sS0FBSyxHQUFHLE1BQU0sRUFBRTtTQUNuQixjQUFjLENBQUM7UUFDZCxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksRUFBRTtLQUN2QyxDQUFDO1NBQ0QsT0FBTyxFQUFFLENBQUE7SUFFWixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUE7SUFDM0QsTUFBTSxHQUFHLEdBQUcsV0FBVyxZQUFZLENBQUMsUUFBUSxJQUFJLFlBQVksQ0FBQyxRQUFRLElBQUksWUFBWSxDQUFDLElBQUksSUFBSSxZQUFZLENBQUMsSUFBSSxJQUFJLFlBQVksQ0FBQyxNQUFNLHFCQUFxQixDQUFBO0lBRTNKLEVBQUUsR0FBRyxJQUFJLHFCQUFZLENBQUM7UUFDcEIsV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUU7S0FDN0IsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxFQUFFLENBQUE7QUFDWCxDQUFDLENBQUE7QUFoQlksUUFBQSxLQUFLLFNBZ0JqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xuaW1wb3J0IHsgU2VjcmV0c01hbmFnZXIgfSBmcm9tICdhd3Mtc2RrJ1xuXG5jb25zdCBzbSA9IG5ldyBTZWNyZXRzTWFuYWdlcigpXG5sZXQgZGI6IFByaXNtYUNsaWVudFxuXG5leHBvcnQgY29uc3QgZ2V0REIgPSBhc3luYyAoKSA9PiB7XG4gIGlmIChkYikgcmV0dXJuIGRiXG5cbiAgY29uc3QgZGJVUkwgPSBhd2FpdCBzbVxuICAgIC5nZXRTZWNyZXRWYWx1ZSh7XG4gICAgICBTZWNyZXRJZDogcHJvY2Vzcy5lbnYuU0VDUkVUX0FSTiB8fCAnJyxcbiAgICB9KVxuICAgIC5wcm9taXNlKClcblxuICBjb25zdCBzZWNyZXRTdHJpbmcgPSBKU09OLnBhcnNlKGRiVVJMLlNlY3JldFN0cmluZyB8fCAne30nKVxuICBjb25zdCB1cmwgPSBgbXlzcWw6Ly8ke3NlY3JldFN0cmluZy51c2VybmFtZX06JHtzZWNyZXRTdHJpbmcucGFzc3dvcmR9QCR7c2VjcmV0U3RyaW5nLmhvc3R9OiR7c2VjcmV0U3RyaW5nLnBvcnR9LyR7c2VjcmV0U3RyaW5nLmRibmFtZX0/Y29ubmVjdGlvbl9saW1pdD0yYFxuXG4gIGRiID0gbmV3IFByaXNtYUNsaWVudCh7XG4gICAgZGF0YXNvdXJjZXM6IHsgZGI6IHsgdXJsIH0gfSxcbiAgfSlcbiAgcmV0dXJuIGRiXG59XG4iXX0=