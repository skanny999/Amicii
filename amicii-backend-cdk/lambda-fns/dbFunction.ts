import setupUsersTable from "./setupUsersTable";
import setupLikesTable from "./setupLikesTable";
import setupDislikesTable from "./setupDislikesTable";

exports.handler = async () => {
    return await Promise.all([
        setupUsersTable(),
        setupLikesTable(),
        setupDislikesTable()
    ])
}