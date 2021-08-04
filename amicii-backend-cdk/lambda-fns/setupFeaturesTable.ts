import { getDB } from './db'
import { createFeaturesTableQuery, addFeatureToUserForeignKey, addUserToFeatureForeignKey, addDefaultFeatures } from './sqlCommands';

async function setupFeaturesTable() {
    const db = await getDB()
    try {
        const createTable = await db.$queryRaw(createFeaturesTableQuery)
        const featureToUserForeignKey = await db.$queryRaw(addFeatureToUserForeignKey)
        const userToFeatureForeignKey = await db.$queryRaw(addUserToFeatureForeignKey)
        const defaultFeatures = await db.$queryRaw(addDefaultFeatures)
        await db.$transaction([createTable, featureToUserForeignKey, userToFeatureForeignKey, defaultFeatures])
        return true;
    } catch (e) {
        console.log('MySQL error: ', e)
        return false
    }
}

export default setupFeaturesTable