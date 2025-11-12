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
        await this.page.getByRole('link', { name: '' }).click();
    }

    async openProfileEditPage() {
        await this.page.getByRole('link', { name: 'Edit Profile' }).click();
        await this.page.getByRole('link', { name: ' Automation User' }).click();
    }

    async changeAvatar() {
        await this.page.getByRole('link', { name: 'Change photo' }).click();
        await this.page.setInputFiles('input[type="file"]', this.imagePath);
        // Wait for the Apply button to be enabled after file upload
        await expect(this.page.getByRole('link', { name: 'Apply' })).toBeVisible();
        await this.page.getByRole('link', { name: 'Apply' }).click();
        // Wait for the Update Profile button to be ready
        await expect(this.page.getByRole('button', { name: 'Update Profile' })).toBeEnabled();
        await this.page.getByRole('button', { name: 'Update Profile' }).click();
    }

    async changeCoverPhoto() {
        await this.page.locator('ins').filter({ hasText: 'Change your cover photo' }).click();
        await this.page.getByRole('link', { name: 'Change cover photo' }).click();
        await this.page.setInputFiles('input[type="file"]', this.imagePath);
        // Wait for the Apply button to be enabled after file upload
        await expect(this.page.getByRole('link', { name: 'Apply' })).toBeVisible();
        await this.page.getByRole('link', { name: 'Apply' }).click();
        // Wait for the Update Profile button to be ready
        await expect(this.page.getByRole('button', { name: 'Update Profile' })).toBeEnabled();
        await this.page.getByRole('button', { name: 'Update Profile' }).click();
    }

    async verifyProfileUpdate() {
        await expect(this.page.getByRole('link', { name: 'Automation User' }).first()).toBeVisible();
        await expect(this.page.getByRole('heading')).toContainText('Automation User');
    }
}