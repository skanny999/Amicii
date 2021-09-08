import { getDB } from './db'
import {
  createFeaturesTableQuery,
  addFeatureToUserForeignKey,
  addUserToFeatureForeignKey,
  createFeatureRelationQuery,
} from './sqlCommands'

async function setupFeaturesTable() {
  const db = await getDB()
  try {
    await Promise.all([
      db.$queryRaw(createFeaturesTableQuery),
      db.$queryRaw(createFeatureRelationQuery),
      db.$queryRaw(addFeatureToUserForeignKey),
      db.$queryRaw(addUserToFeatureForeignKey),
    ])
    return true
  } catch (e) {
    console.log('MySQL error: ', e)
    return false
  }
}

export default setupFeaturesTable
