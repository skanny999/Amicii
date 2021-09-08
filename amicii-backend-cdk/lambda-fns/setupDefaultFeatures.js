"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function setupDefaultFeatures() {
    const db = await db_1.getDB();
    await db.features.createMany({
        data: [
            {
                id: 0,
                emoji: `PH0`,
            },
            {
                id: 1,
                emoji: `PH1`,
            },
            {
                id: 2,
                emoji: `PH2`,
            },
            {
                id: 3,
                emoji: `PH3`,
            },
            {
                id: 4,
                emoji: `PH4`,
            },
            {
                id: 5,
                emoji: `PH5`,
            },
            {
                id: 6,
                emoji: `PH6`,
            },
            {
                id: 7,
                emoji: `PH7`,
            },
            {
                id: 8,
                emoji: `PH8`,
            },
            {
                id: 9,
                emoji: `PH9`,
            },
        ],
        skipDuplicates: true,
    });
}
exports.default = setupDefaultFeatures;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBEZWZhdWx0RmVhdHVyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR1cERlZmF1bHRGZWF0dXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixLQUFLLFVBQVUsb0JBQW9CO0lBQ2pDLE1BQU0sRUFBRSxHQUFHLE1BQU0sVUFBSyxFQUFFLENBQUE7SUFDeEIsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUMzQixJQUFJLEVBQUU7WUFDSjtnQkFDRSxFQUFFLEVBQUUsQ0FBQztnQkFDTCxLQUFLLEVBQUUsS0FBSzthQUNiO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsS0FBSyxFQUFFLEtBQUs7YUFDYjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxDQUFDO2dCQUNMLEtBQUssRUFBRSxLQUFLO2FBQ2I7WUFDRDtnQkFDRSxFQUFFLEVBQUUsQ0FBQztnQkFDTCxLQUFLLEVBQUUsS0FBSzthQUNiO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsS0FBSyxFQUFFLEtBQUs7YUFDYjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxDQUFDO2dCQUNMLEtBQUssRUFBRSxLQUFLO2FBQ2I7WUFDRDtnQkFDRSxFQUFFLEVBQUUsQ0FBQztnQkFDTCxLQUFLLEVBQUUsS0FBSzthQUNiO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsS0FBSyxFQUFFLEtBQUs7YUFDYjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxDQUFDO2dCQUNMLEtBQUssRUFBRSxLQUFLO2FBQ2I7WUFDRDtnQkFDRSxFQUFFLEVBQUUsQ0FBQztnQkFDTCxLQUFLLEVBQUUsS0FBSzthQUNiO1NBQ0Y7UUFDRCxjQUFjLEVBQUUsSUFBSTtLQUNyQixDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsa0JBQWUsb0JBQW9CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREQiB9IGZyb20gJy4vZGInXG5cbmFzeW5jIGZ1bmN0aW9uIHNldHVwRGVmYXVsdEZlYXR1cmVzKCkge1xuICBjb25zdCBkYiA9IGF3YWl0IGdldERCKClcbiAgYXdhaXQgZGIuZmVhdHVyZXMuY3JlYXRlTWFueSh7XG4gICAgZGF0YTogW1xuICAgICAge1xuICAgICAgICBpZDogMCxcbiAgICAgICAgZW1vamk6IGBQSDBgLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIGVtb2ppOiBgUEgxYCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAyLFxuICAgICAgICBlbW9qaTogYFBIMmAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogMyxcbiAgICAgICAgZW1vamk6IGBQSDNgLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDQsXG4gICAgICAgIGVtb2ppOiBgUEg0YCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiA1LFxuICAgICAgICBlbW9qaTogYFBINWAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogNixcbiAgICAgICAgZW1vamk6IGBQSDZgLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDcsXG4gICAgICAgIGVtb2ppOiBgUEg3YCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiA4LFxuICAgICAgICBlbW9qaTogYFBIOGAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogOSxcbiAgICAgICAgZW1vamk6IGBQSDlgLFxuICAgICAgfSxcbiAgICBdLFxuICAgIHNraXBEdXBsaWNhdGVzOiB0cnVlLFxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBzZXR1cERlZmF1bHRGZWF0dXJlc1xuIl19