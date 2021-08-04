import createUser from "./createUser";
import updateUser from "./updateUser";
import getCandidates from "./getCandidates";
import getMatches from "./getMatches";
import { User } from "./types";

type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        user: User
    }
}

exports.handler = async (event: AppSyncEvent) => {
    switch (event.info.fieldName) {
        case 'createUser':
            return await createUser(event.arguments.user)
        case 'updateUser':
            return await updateUser(event.arguments.user)
        case 'getCandidates':
            return await getCandidates()
        case 'getMatches':
            return await getMatches()
        default:
            return null
    }
}