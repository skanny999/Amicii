import { UserType } from "../../types";

export const user: UserType = {
    id: '5',
    username: 'Luca',
    bio: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like.',
    age: 22,
    profileEmoji: '🧖🏾‍♀️',
    features: ["🏩", "👀","👩🏼", "💆🏻‍♂️","👩🏻‍🦯", "🧶","🧚🏻‍♀️", "🧟","🙅🏻", "👄"]
}

const mockUsers: UserType[] = [
    {
        id: '1',
        username: 'Ric',
        bio: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.',
        age: 21,
        profileEmoji: '😀',
        features: ["👩🏽‍🚀", "🙈","🐭", "😁","😺", "👘","🐲", "🫓","🎭", "🏢"]
    },
    {
        id: '2',
        username: 'Lara',
        bio: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
        age: 23,
        profileEmoji: '😉',
        features: ["⚓️", "🛕","📤", "✳️","🕟", "🫀","☎️", "💾","🖥", "📟"]
    },
    {
        id: '3',
        username: 'Martin',
        bio: 'Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc. Ciao',
        age: 22,
        profileEmoji: '😗',
        features: ["🪛", "🪙","🪤", "🎙","🧧", "🏷","🗜", "🎢","🌋", "🏘"]
    }
]

export default mockUsers