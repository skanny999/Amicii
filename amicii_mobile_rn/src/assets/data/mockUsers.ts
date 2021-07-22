import { UserType } from "../../types";

export const user: UserType = {
    id: 5,
    name: 'Luca',
    bio: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like.',
    age: 22,
    emoji: '🧖🏾‍♀️',
    features: ["🏩", "👀","👩🏼", "💆🏻‍♂️","👩🏻‍🦯", "🧶","🧚🏻‍♀️", "🧟","🙅🏻", "👄"]
}

const mockUsers: UserType[] = [
    {
        id: 1,
        name: 'Ric',
        bio: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.',
        age: 21,
        emoji: '😀',
        features: ["👩🏽‍🚀", "🙈","🐭", "😁","😺", "👘","🐲", "🫓","🎭", "🏢"]
    },
    {
        id: 2,
        name: 'Lara',
        bio: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
        age: 23,
        emoji: '😉',
        features: ["⚓️", "🛕","📤", "✳️","🕟", "🫀","☎️", "💾","🖥", "📟"]
    },
    {
        id: 3,
        name: 'Martin',
        bio: 'Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc. Ciao',
        age: 22,
        emoji: '😗',
        features: ["🪛", "🪙","🪤", "🎙","🧧", "🏷","🗜", "🎢","🌋", "🏘"]
    }
]

export default mockUsers