export function extractUserId(identifier: string) {
    return identifier.substring(identifier.indexOf(":") + 1);
}