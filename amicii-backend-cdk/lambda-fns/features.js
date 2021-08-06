"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function features(userId) {
    const db = await db_1.getDB();
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
exports.default = features;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmZWF0dXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixLQUFLLFVBQVUsUUFBUSxDQUFDLE1BQWM7SUFDbEMsTUFBTSxFQUFFLEdBQUcsTUFBTSxVQUFLLEVBQUUsQ0FBQTtJQUN4QixPQUFPLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFDOUIsS0FBSyxFQUFFO1lBQ0gsTUFBTSxFQUFFO2dCQUNKLEtBQUssRUFBRTtvQkFDSCxFQUFFLEVBQUUsTUFBTTtpQkFDYjthQUNKO1NBQ0o7S0FDSixDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsa0JBQWUsUUFBUSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0REIgfSBmcm9tICcuL2RiJ1xuXG5hc3luYyBmdW5jdGlvbiBmZWF0dXJlcyh1c2VySWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0REIoKVxuICAgIHJldHVybiBhd2FpdCBkYi5mZWF0dXJlcy5maW5kTWFueSh7XG4gICAgICAgIHdoZXJlOiB7IFxuICAgICAgICAgICAgQV9Vc2VyOiB7XG4gICAgICAgICAgICAgICAgZXZlcnk6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBmZWF0dXJlcyJdfQ==