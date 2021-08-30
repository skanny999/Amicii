export function stringFromEmoji(emoji: string) {
  return emojiUnicode(emoji)
    .split(' ')
    .map(function (val) {
      return parseInt(val, 10).toString(16)
    })
    .join(' ')
}

export function emojiFromString(emojiString: string) {
  if (emojiString.length > 0) {
    return emojiString
      .split(' ')
      .map((comp) => String.fromCodePoint(parseInt(comp, 16)))
      .reduce((prev: string, curr: string) => prev + curr)
  } else {
    return ''
  }
}

const emojiUnicode = function (input: string) {
  if (input.length === 1) {
    return input.charCodeAt(0).toString()
  } else if (input.length > 1) {
    const pairs = []
    for (let i = 0; i < input.length; i++) {
      if (input.charCodeAt(i) >= 0xd800 && input.charCodeAt(i) <= 0xdbff) {
        if (
          input.charCodeAt(i + 1) >= 0xdc00 &&
          input.charCodeAt(i + 1) <= 0xdfff
        ) {
          pairs.push(
            (input.charCodeAt(i) - 0xd800) * 0x400 +
              (input.charCodeAt(i + 1) - 0xdc00) +
              0x10000
          )
        }
      } else if (input.charCodeAt(i) < 0xd800 || input.charCodeAt(i) > 0xdfff) {
        pairs.push(input.charCodeAt(i))
      }
    }
    return pairs.join(' ')
  }
  return ''
}
