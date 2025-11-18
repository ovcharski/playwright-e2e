import { Page, expect } from '@playwright/test';
import BasePage from './BasePage';

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
        await this.page.getByRole('link', { name: '' }).click();
        await this.page.getByRole('link', { name: 'Edit Profile' }).click();
        await this.page.getByRole('link', { name: ' Automation User' }).click();
    }

    async changeAvatar() {
        await this.page.getByRole('link', { name: 'Change photo' }).click();
        await this.page.setInputFiles('input[type="file"]', this.imagePath);
        // The following timeout is a workaround for a frontend bug where the "Apply" button
        // becomes enabled before the image upload is actually complete.
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
        await this.page.setInputFiles('input[type="file"]', this.imagePath);
        // The following timeout is a workaround for a frontend bug where the "Apply" button
        // becomes enabled before the image upload is actually complete.
        await this.page.waitForTimeout(2000);
        await expect(this.page.getByRole('link', { name: 'Apply' })).toBeEnabled({ timeout: 30000 });
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
