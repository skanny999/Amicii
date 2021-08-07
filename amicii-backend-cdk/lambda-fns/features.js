"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function features(userId) {
    const db = await db_1.getDB();
    try {
        return await db.features.findMany({
            where: {
                A_User: {
                    every: {
                        id: userId,
                    }
                }
            }
        });
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
exports.default = features;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmZWF0dXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixLQUFLLFVBQVUsUUFBUSxDQUFDLE1BQWM7SUFDbEMsTUFBTSxFQUFFLEdBQUcsTUFBTSxVQUFLLEVBQUUsQ0FBQTtJQUN4QixJQUFJO1FBQ0EsT0FBTyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQzlCLEtBQUssRUFBRTtnQkFDSCxNQUFNLEVBQUU7b0JBQ0osS0FBSyxFQUFFO3dCQUNILEVBQUUsRUFBRSxNQUFNO3FCQUNiO2lCQUNKO2FBQ0o7U0FDSixDQUFDLENBQUE7S0FDTDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNoQixPQUFPLElBQUksQ0FBQTtLQUNkO0FBQ0wsQ0FBQztBQUVELGtCQUFlLFFBQVEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcblxuYXN5bmMgZnVuY3Rpb24gZmVhdHVyZXModXNlcklkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERCKClcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgZGIuZmVhdHVyZXMuZmluZE1hbnkoe1xuICAgICAgICAgICAgd2hlcmU6IHsgXG4gICAgICAgICAgICAgICAgQV9Vc2VyOiB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZXJ5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdXNlcklkLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmZWF0dXJlcyJdfQ==