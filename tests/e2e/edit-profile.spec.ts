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
        const lastModifiedBefore = await profilePage.getImageLastModified('avatar');
        await profilePage.changeAvatar();
        await profilePage.verifyProfileUpdate();
        await profilePage.verifyImageReplaced('avatar', lastModifiedBefore);
    });

    test('Change cover image', async () => {
        const lastModifiedBefore = await profilePage.getImageLastModified('cover');
        await profilePage.changeCoverPhoto();
        await profilePage.verifyProfileUpdate();
        await profilePage.verifyImageReplaced('cover', lastModifiedBefore);
    });
});
