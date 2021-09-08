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
                    },
                },
            },
        });
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
exports.default = features;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmZWF0dXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixLQUFLLFVBQVUsUUFBUSxDQUFDLE1BQWM7SUFDcEMsTUFBTSxFQUFFLEdBQUcsTUFBTSxVQUFLLEVBQUUsQ0FBQTtJQUN4QixJQUFJO1FBQ0YsT0FBTyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ2hDLEtBQUssRUFBRTtnQkFDTCxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFO3dCQUNMLEVBQUUsRUFBRSxNQUFNO3FCQUNYO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUE7S0FDSDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNoQixPQUFPLElBQUksQ0FBQTtLQUNaO0FBQ0gsQ0FBQztBQUVELGtCQUFlLFFBQVEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERCIH0gZnJvbSAnLi9kYidcblxuYXN5bmMgZnVuY3Rpb24gZmVhdHVyZXModXNlcklkOiBzdHJpbmcpIHtcbiAgY29uc3QgZGIgPSBhd2FpdCBnZXREQigpXG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGRiLmZlYXR1cmVzLmZpbmRNYW55KHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIEFfVXNlcjoge1xuICAgICAgICAgIGV2ZXJ5OiB7XG4gICAgICAgICAgICBpZDogdXNlcklkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUubG9nKGVycilcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZlYXR1cmVzXG4iXX0=