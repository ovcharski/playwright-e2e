import { test } from '../../fixtures/test-fixtures';

test.describe('User Profile Image Updates', () => {
    test.beforeEach(async ({ profilePage }) => {
        await profilePage.navigateToProfile();
        await profilePage.openProfileEditPage();
    });

    test('Change avatar image', async ({ profilePage }) => {
        await profilePage.changeAvatar();
        await profilePage.verifyProfileUpdate();
    });

    test('Change cover image', async ({ profilePage }) => {
        await profilePage.changeCoverPhoto();
        await profilePage.verifyProfileUpdate();
    });
});
