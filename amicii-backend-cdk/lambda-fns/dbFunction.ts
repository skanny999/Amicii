import setupDbTable from "./setupDbTable";

exports.handler = async () => {
    return await setupDbTable()
}