import { getDB } from './db'
import {
  createFeaturesTableQuery,
  addFeatureToUserForeignKey,
  addUserToFeatureForeignKey,
  createFeatureRelationQuery,
  addDefaultFeature1,
  addDefaultFeature10,
  addDefaultFeature2,
  addDefaultFeature3,
  addDefaultFeature4,
  addDefaultFeature5,
  addDefaultFeature6,
  addDefaultFeature7,
  addDefaultFeature8,
  addDefaultFeature9,
} from './sqlCommands'

async function setupFeaturesTable() {
  try {
    const db = await getDB()
    await db.$queryRaw(createFeaturesTableQuery),
      await db.$queryRaw(createFeatureRelationQuery),
      await db.$queryRaw(addFeatureToUserForeignKey),
      await db.$queryRaw(addUserToFeatureForeignKey),
      await db.$queryRaw(addDefaultFeature1),
      await db.$queryRaw(addDefaultFeature2),
      await db.$queryRaw(addDefaultFeature3),
      await db.$queryRaw(addDefaultFeature4),
      await db.$queryRaw(addDefaultFeature5),
      await db.$queryRaw(addDefaultFeature6),
      await db.$queryRaw(addDefaultFeature7),
      await db.$queryRaw(addDefaultFeature8),
      await db.$queryRaw(addDefaultFeature9),
      await db.$queryRaw(addDefaultFeature10)
  } catch (e) {
    console.log('MySQL error: ', e)
  }
}

export default setupFeaturesTable
