import { getDB } from './db'
import { 
    createFeaturesTableQuery, 
    addFeatureToUserForeignKey, 
    addUserToFeatureForeignKey, 
    addDefaultFeature1, 
    createFeatureRelationQuery, 
    addDefaultFeature2,
    addDefaultFeature3,
    addDefaultFeature4,
    addDefaultFeature5,
    addDefaultFeature6,
    addDefaultFeature7,
    addDefaultFeature8,
    addDefaultFeature9,
    addDefaultFeature10} from './sqlCommands';

async function setupFeaturesTable() {
    const db = await getDB()
    try {
        await Promise.all([
            db.$queryRaw(createFeaturesTableQuery),
            db.$queryRaw(createFeatureRelationQuery),
            db.$queryRaw(addFeatureToUserForeignKey),
            db.$queryRaw(addUserToFeatureForeignKey),
            db.$queryRaw(addDefaultFeature1),
            db.$queryRaw(addDefaultFeature2),
            db.$queryRaw(addDefaultFeature3),
            db.$queryRaw(addDefaultFeature4),
            db.$queryRaw(addDefaultFeature5),
            db.$queryRaw(addDefaultFeature6),
            db.$queryRaw(addDefaultFeature7),
            db.$queryRaw(addDefaultFeature8),
            db.$queryRaw(addDefaultFeature9),
            db.$queryRaw(addDefaultFeature10)
        ])
        return true;
    } catch (e) {
        console.log('MySQL error: ', e)
        return false
    }
}

export default setupFeaturesTable