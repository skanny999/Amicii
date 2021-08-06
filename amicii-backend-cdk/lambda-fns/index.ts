import createUser from "./createUser";
import updateUser from "./updateUser";
import { User } from "./types";
import candidates from "./candidates";
import matches from "./matches";
import features from "./features";
import user from "./user";

type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        user: User,
        userId: string,
        otherUserId: string
    }
}

exports.handler = async (event: AppSyncEvent, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false

    switch (event.info.fieldName) {
        case 'createUser':
            return await createUser(event.arguments.userId)
        case 'updateUser':
            return await updateUser(event.arguments.user)
        case 'user':
            return await user(event.arguments.userId)
        case 'candidates':
            return await candidates(event.arguments.userId)
        case 'matches':
            return await matches(event.arguments.userId)
        default:
            return null
    }
}