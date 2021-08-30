import { UserType } from '../../types'

export const regularUser: UserType = {
  id: '5',
  username: 'Luca',
  bio: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like.',
  age: 22,
  genderM: 0,
  genderF: 1,
  createdOn: '2021-08-12T13:45:30.792Z',
  profileEmoji: '🧖🏾‍♀️',
  features: ['🏩', '👀', '👩🏼', '💆🏻‍♂️', '👩🏻‍🦯', '🧶', '🧚🏻‍♀️', '🧟', '🙅🏻', '👄'],
}

export const newMockUser: UserType = {
  age: 0,
  bio: '',
  createdOn: '2021-08-12T13:45:30.792Z',
  features: [
    'PH1',
    'PH10',
    'PH2',
    'PH3',
    'PH4',
    'PH5',
    'PH6',
    'PH7',
    'PH8',
    'PH9',
  ],
  genderF: 0,
  genderM: 0,
  id: 'test3',
  profileEmoji: '',
  username: 'Gianni',
}

const mockUsers: UserType[] = [
  {
    id: '1',
    username: 'Ric',
    bio: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.',
    age: 21,
    genderM: 0,
    genderF: 1,
    createdOn: '2021-08-12T13:45:30.792Z',
    profileEmoji: '1f469 1f3fd 200d 2696 fe0f',
    features: [
      '1f614',
      '1f978',
      '1f45e',
      '1f468 200d 1f467 200d 1f467',
      '1f452',
      '1f344',
      '1f317',
      '1f367',
      '1f1e7 1f1ef',
      '1f343',
    ],
  },
  {
    id: 'abcd',
    username: 'Lara',
    bio: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    age: 23,
    genderM: 0,
    genderF: 1,
    createdOn: '2021-08-12T13:45:30.792Z',
    profileEmoji: '😉',
    features: ['⚓️', '🛕', '📤', '✳️', '🕟', '🫀', '☎️', '💾', '🖥', '📟'],
  },
  {
    id: 'efgh',
    username: 'Martin',
    bio: 'Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc. Ciao',
    age: 22,
    genderM: 0,
    genderF: 1,
    createdOn: '2021-08-12T13:45:30.792Z',
    profileEmoji: '😗',
    features: ['🪛', '🪙', '🪤', '🎙', '🧧', '🏷', '🗜', '🎢', '🌋', '🏘'],
  },
]

export default mockUsers
