export const extractUserId = (identifier: string) => {
    return identifier.split(":").pop()
}