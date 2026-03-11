import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
    // ── Locators ──────────────────────────────────────────
    // Matched to actual DOM: label="Email", label="Enter your password"
    readonly emailInput = this.page.getByLabel('Email');
    readonly passwordInput = this.page.getByLabel('Enter your password');
    readonly loginBtn = this.page.getByRole('button', { name: 'Log In' });

    // Success & error messages
    readonly successMessage = this.page.getByText('User logged in successfully');
    readonly globalErrorMessage = this.page.getByText('Invalid login credentials');
    readonly validationError = this.page.locator('p[class*="validation_text"]');

    // ── Actions ───────────────────────────────────────────

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginBtn.click();
    }

    async login(email: string, password: string) {
        // Only fill if not empty to avoid overwriting default fill behavior in data scenarios
        if (email !== undefined) await this.fillEmail(email);
        if (password !== undefined) await this.fillPassword(password);

        // Only click if enabled, as per user requirement button might be disabled
        if (await this.loginBtn.isEnabled()) {
            await this.clickLogin();
        }
    }

    // ── Assertions ────────────────────────────────────────

    async expectLoginSuccess() {
        await expect(this.successMessage).toBeVisible();
    }

    async expectGlobalError() {
        await expect(this.globalErrorMessage).toBeVisible();
    }

    async expectValidationError(message: string | RegExp) {
        await expect(this.validationError.filter({ hasText: message })).toBeVisible();
    }

    async expectLoginButtonEnabled(enabled = true) {
        if (enabled) {
            await expect(this.loginBtn).toBeEnabled();
        } else {
            await expect(this.loginBtn).toBeDisabled();
        }
    }
}
