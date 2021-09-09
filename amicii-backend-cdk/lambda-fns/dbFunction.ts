import setupUsersTable from './setupUsersTable'
import setupFeaturesTable from './setupFeaturesTable'
import setupDefaultFeatures from './setupDefaultFeatures'

exports.handler = async () => {
  await setupUsersTable()
  await setupFeaturesTable()
}
