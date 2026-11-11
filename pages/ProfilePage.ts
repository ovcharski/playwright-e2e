import { Page, expect } from '@playwright/test';
import BasePage from './BasePage';
import { TIMEOUTS } from '../constants/timeouts';
import { testUser } from '../helpers/test-user';

export default class ProfilePage extends BasePage {
    private readonly baseUrl = testUser.profilePath;
    private readonly imagePath = 'assets/images/yu-alu-air-serbia-atr-72-500.jpg';

    constructor(page: Page) {
        super(page);
    }

    async navigateToProfile() {
        await this.page.goto(this.baseUrl);
    }

    async openProfileEditPage() {
        await this.page.locator('.um-faicon-cog').click();
        await this.page.getByRole('link', { name: 'Edit Profile' }).click();
        // The photo exists in view mode too, where clicking it just reloads
        // the profile, so wait for edit mode before touching it.
        await expect(this.page).toHaveURL(/um_action=edit/);
        await this.page.locator('.um-profile-photo-img').click();
    }

    async changeAvatar() {
        await this.page.getByRole('link', { name: 'Change photo' }).click();
        await this.uploadImageAndSave();
    }

    async changeCoverPhoto() {
        await this.page.locator('ins').filter({ hasText: 'Change your cover photo' }).click();
        await this.page.getByRole('link', { name: 'Change cover photo' }).click();
        await this.uploadImageAndSave();
    }

    // Shared by the avatar and cover flows: once the upload modal is open,
    // both run the same choose-file, Apply, Update Profile steps.
    private async uploadImageAndSave() {
        // The Apply button is clickable before the upload has finished, and
        // clicking it then does nothing. Wait for the upload itself, then for
        // Ultimate Member to load the image into its cropper.
        const uploadResponse = this.page.waitForResponse(
            (response) =>
                response.url().includes('admin-ajax.php') &&
                (response.request().headers()['content-type'] ?? '').startsWith('multipart/form-data'),
            { timeout: TIMEOUTS.UPLOAD_PROCESSING },
        );
        await this.page.locator('input[type="file"]').setInputFiles(this.imagePath);
        expect(await (await uploadResponse).json()).toMatchObject({ success: true });
        await expect(this.page.locator('.um-modal .cropper-container')).toBeVisible();

        // Apply sends the crop to um_resize_image, which writes the final file.
        // Its result is the only proof the picture was replaced: the tests upload
        // the same image every run, and the <img> src gets a fresh cache-busting
        // timestamp on every page load whether or not anything changed.
        const resizeResponse = this.page.waitForResponse(
            (response) => response.request().postData()?.includes('action=um_resize_image') ?? false,
        );
        await this.page.getByRole('link', { name: 'Apply' }).click();
        expect(await (await resizeResponse).json()).toMatchObject({ success: true });

        // Apply fades Ultimate Member's modal out, and its overlay keeps
        // intercepting clicks on Update Profile until it is gone.
        await expect(this.page.locator('.um-modal-overlay')).toBeHidden();
        await expect(this.page.getByRole('button', { name: 'Update Profile' })).toBeEnabled();
        await this.page.getByRole('button', { name: 'Update Profile' }).click();
    }

    async verifyProfileUpdate() {
        // A saved form redirects back to the profile; a rejected one stays on
        // ?um_action=edit.
        await expect(this.page).toHaveURL(this.baseUrl);
        await expect(this.page.getByRole('link', { name: testUser.displayName }).first()).toBeVisible();
        await expect(this.page.getByRole('heading')).toContainText(testUser.displayName);
    }
}
