import React from 'react'
import { render } from '@testing-library/react-native'
import Profile from '../Profile'
import mockUsers, {
  newMockUser,
  regularUser,
} from '../../../assets/data/mockUsers'

describe('Profile screen', () => {
  // New user

  it('renders the new user username', () => {
    const { queryByText } = render(<Profile user={newMockUser} />)
    expect(queryByText('Gianni')).not.toBeNull()
  })

  it('renders the new user emojis', () => {
    const { getAllByText } = render(<Profile user={newMockUser} />)
    expect(getAllByText('❓').length).toEqual(11)
  })

  it('renders undefined age', () => {
    const { queryByDisplayValue } = render(<Profile user={newMockUser} />)
    expect(queryByDisplayValue('Select Age ')).not.toBeNull()
  })

  it('renders undefined Gender', () => {
    const { queryByDisplayValue } = render(<Profile user={newMockUser} />)
    expect(queryByDisplayValue(' Select Gender')).not.toBeNull()
  })

  it('renders undefined Bio', () => {
    const { queryByPlaceholderText } = render(<Profile user={newMockUser} />)
    expect(
      queryByPlaceholderText('Add something about yourself')
    ).not.toBeNull()
  })

  // Mock user

  it('renders the regular user username', () => {
    const { queryByText } = render(<Profile user={mockUsers[0]} />)
    expect(queryByText('Ric')).not.toBeNull()
  })

  it('renders the regular user emojis', () => {
    const { getByText } = render(<Profile user={mockUsers[0]} />)
    expect(getByText('👩🏽‍⚖️')).not.toBeNull
  })

  it('renders regular user age', () => {
    const { queryByDisplayValue } = render(<Profile user={mockUsers[0]} />)
    expect(queryByDisplayValue('21')).not.toBeNull()
  })

  it('renders regular user Gender', () => {
    const { queryByDisplayValue } = render(<Profile user={mockUsers[0]} />)
    expect(queryByDisplayValue('F')).not.toBeNull()
  })

  it('renders regular user Bio', () => {
    const { getByTestId } = render(<Profile user={mockUsers[0]} />)
    expect(getByTestId('bio').children[0]).toEqual(
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.'
    )
  })
})
