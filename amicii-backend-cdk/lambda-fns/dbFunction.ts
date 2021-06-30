import setupUsersTable from "./setupUsersTable";
import setupLikesTable from "./setupLikesTable";
import setupDislikesTable from "./setupDislikesTable";
import setupFeaturesTable from "./setupFeaturesTable";

exports.handler = async () => {
    return await Promise.all([
        setupUsersTable(),
        setupLikesTable(),
        setupDislikesTable(),
        setupFeaturesTable()
    ])
}