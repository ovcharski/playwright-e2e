import { Page, expect } from '@playwright/test';
import BasePage from './BasePage';
import { TIMEOUTS } from '../constants/timeouts';

export default class ProfilePage extends BasePage {
    private readonly baseUrl = 'user/playwrightuser/';
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
        await this.page.locator('input[type="file"]').setInputFiles(this.imagePath);
        // The following timeout is a workaround for a frontend bug where the "Apply" button
        // becomes enabled before the image upload is actually complete.
        // eslint-disable-next-line playwright/no-wait-for-timeout -- the bug is that the DOM lies, so there is no state to await
        await this.page.waitForTimeout(2000);
        // Wait for the Apply button to be enabled after file upload
        await expect(this.page.getByRole('link', { name: 'Apply' })).toBeEnabled();
        await this.applyUpload();
        // Apply fades Ultimate Member's modal out, and its overlay keeps
        // intercepting clicks on Update Profile until it is gone.
        await expect(this.page.locator('.um-modal-overlay')).toBeHidden();
        // Wait for the Update Profile button to be ready
        await expect(this.page.getByRole('button', { name: 'Update Profile' })).toBeEnabled();
        await this.page.getByRole('button', { name: 'Update Profile' }).click();
    }

    async changeCoverPhoto() {
        await this.page.locator('ins').filter({ hasText: 'Change your cover photo' }).click();
        await this.page.getByRole('link', { name: 'Change cover photo' }).click();
        await this.page.locator('input[type="file"]').setInputFiles(this.imagePath);
        // The following timeout is a workaround for a frontend bug where the "Apply" button
        // becomes enabled before the image upload is actually complete.
        // eslint-disable-next-line playwright/no-wait-for-timeout -- the bug is that the DOM lies, so there is no state to await
        await this.page.waitForTimeout(2000);
        await expect(this.page.getByRole('link', { name: 'Apply' })).toBeEnabled({ timeout: TIMEOUTS.UPLOAD_PROCESSING });
        await this.applyUpload();
        // Apply fades Ultimate Member's modal out, and its overlay keeps
        // intercepting clicks on Update Profile until it is gone.
        await expect(this.page.locator('.um-modal-overlay')).toBeHidden();
        // Wait up to 15s for the Update Profile button to be enabled
        await expect(this.page.getByRole('button', { name: 'Update Profile' })).toBeEnabled();
        await this.page.getByRole('button', { name: 'Update Profile' }).click();
    }

    // Apply sends the crop to um_resize_image, which writes the final file.
    // Its result is the only proof the picture was replaced: the tests upload
    // the same image every run, and the <img> src gets a fresh cache-busting
    // timestamp on every page load whether or not anything changed.
    private async applyUpload() {
        const resizeResponse = this.page.waitForResponse(
            (response) => response.request().postData()?.includes('action=um_resize_image') ?? false,
        );
        await this.page.getByRole('link', { name: 'Apply' }).click();
        expect(await (await resizeResponse).json()).toMatchObject({ success: true });
    }

    async verifyProfileUpdate() {
        // A saved form redirects back to the profile; a rejected one stays on
        // ?um_action=edit.
        await expect(this.page).toHaveURL(this.baseUrl);
        await expect(this.page.getByRole('link', { name: 'Automation User' }).first()).toBeVisible();
        await expect(this.page.getByRole('heading')).toContainText('Automation User');
    }
}
