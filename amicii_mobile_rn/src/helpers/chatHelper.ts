import { UserType } from "../types";

const chatName = (firstUser: UserType, lastUser: UserType) => {
    return [firstUser.id.substr(-6), lastUser.id.substr(-6)].sort().join;
}