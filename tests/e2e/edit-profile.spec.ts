import test from '@playwright/test';
import ProfilePage from '../../pages/ProfilePage';

test.describe('User Profile Image Updates', () => {
    let profilePage: ProfilePage;

    test.beforeEach(async ({ page }) => {
        profilePage = new ProfilePage(page);
        await profilePage.navigateToProfile();
        await profilePage.openProfileEditPage();
    });

    test('Change avatar image', async () => {
        await profilePage.changeAvatar();
        await profilePage.verifyProfileUpdate();
    });

    test('Change cover image', async () => {
        await profilePage.changeCoverPhoto();
        await profilePage.verifyProfileUpdate();
    });
});