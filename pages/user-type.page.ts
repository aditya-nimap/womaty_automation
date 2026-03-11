import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export type UserType = 'Institute User' | 'Business User' | 'Standard User';

export class UserTypePage extends BasePage {
    // ── Locators ──────────────────────────────────────────
    userTypeImage = (name: UserType) =>
        this.page.getByAltText(name);

    readonly nextBtn = this.page.getByRole('button', { name: 'Next' });

    // ── Actions ───────────────────────────────────────────

    async goto() {
        await this.page.goto(process.env.BASE_URL + '/welcome');
        // wait for page to be ready
        await expect(this.nextBtn).toBeVisible();
    }

    async selectUserType(type: UserType) {
        await this.userTypeImage(type).click();
        await this.nextBtn.click();
        // Wait for login form to be ready (confirms navigation is complete)
        await expect(this.page.getByLabel('Email')).toBeVisible();
    }
}
