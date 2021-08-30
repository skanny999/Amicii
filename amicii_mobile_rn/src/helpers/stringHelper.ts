export function extractUserId(identifier: string) {
  return identifier.substring(identifier.indexOf(':') + 1)
}

export function nonEmpty(text: string) {
  if (text.length === 0) {
    return ' '
  } else {
    return text
  }
}
