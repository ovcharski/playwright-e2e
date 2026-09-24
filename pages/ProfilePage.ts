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
        await this.page.getByRole('link', { name: 'Apply' }).click();
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
        await this.page.getByRole('link', { name: 'Apply' }).click();
        // Wait up to 15s for the Update Profile button to be enabled
        await expect(this.page.getByRole('button', { name: 'Update Profile' })).toBeEnabled();
        await this.page.getByRole('button', { name: 'Update Profile' }).click();
    }

    async verifyProfileUpdate() {
        await expect(this.page.getByRole('link', { name: 'Automation User' }).first()).toBeVisible();
        await expect(this.page.getByRole('heading')).toContainText('Automation User');
    }
}
