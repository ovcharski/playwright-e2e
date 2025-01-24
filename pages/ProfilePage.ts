import { Page, expect } from '@playwright/test';
import BasePage from './BasePage';

export default class ProfilePage extends BasePage {
    private readonly baseUrl = 'https://ovcharski.com/shop/user/playwrightuser/';
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
        await this.page.waitForTimeout(5000);
        await this.page.getByRole('link', { name: 'Apply' }).click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('button', { name: 'Update Profile' }).click();
    }

    async changeCoverPhoto() {
        await this.page.locator('ins').filter({ hasText: 'Change your cover photo' }).click();
        await this.page.getByRole('link', { name: 'Change cover photo' }).click();  
        await this.page.setInputFiles('input[type="file"]', this.imagePath);
        await this.page.waitForTimeout(5000);
        await this.page.getByRole('link', { name: 'Apply' }).click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('button', { name: 'Update Profile' }).click();
    }

    async verifyProfileUpdate() {
        await expect(this.page.getByRole('link', { name: 'Automation User' }).first()).toBeVisible();
        await expect(this.page.getByRole('heading')).toContainText('Automation User');
    }
}