import { by, device, element, expect } from 'detox'

describe('App Navigation', () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  const login = async () => {
    await element(by.id('aws-amplify__auth--username-input')).tap()
    await element(by.id('aws-amplify__auth--username-input')).typeText('test1')
    await element(by.id('aws-amplify__auth--password-input')).tap()
    await element(by.id('aws-amplify__auth--password-input')).typeText(
      'Password1'
    )
    await element(by.text('SIGN IN')).tap()
  }

  test('should succesfully login', async () => {
    await login()
    await waitFor(element(by.id('HomeScreen')))
      .toBeVisible()
      .withTimeout(5000)
    await expect(element(by.id('HomeScreen'))).toBeVisible()
  })

  test('should succesfully logout', async () => {
    await element(by.id('LogoutButton')).tap()
    await expect(element(by.text('Sign in to your account'))).toBeVisible()
  })

  test('should go to the Profile Screen when tapping tab bar profile button', async () => {
    await login()
    await element(by.id('ProfileTabBarButton')).tap()
    await expect(element(by.id('ProfileScreen'))).toBeVisible()
  })
})
