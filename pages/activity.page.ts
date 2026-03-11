import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ActivityPage extends BasePage {
    // ── Locators ──────────────────────────────────────────
    readonly createBtn = this.page.getByRole('button', { name: 'Create' });
    readonly uploadPlaceholder = this.page.getByRole('button', { name: 'Click here To upload or drop' });
    readonly saveImageBtn = this.page.getByRole('button', { name: 'Save' });
    readonly titleInputPlaceholder = this.page.getByRole('textbox', { name: 'Enter activity title' });
    readonly titleInput = this.page.getByRole('textbox', { name: 'Title' });
    readonly categoryDropdown = this.page.getByRole('combobox', { name: 'Select category' });
    readonly wellnessOption = this.page.getByRole('option', { name: 'Wellness & Health' });
    readonly firstSwitch = this.page.getByRole('switch').first();
    readonly descriptionPlaceholder = this.page.getByRole('textbox', { name: 'Enter your description' });
    readonly descriptionInput = this.page.getByRole('textbox', { name: 'Description' });
    readonly selectLocationBtn = this.page.getByRole('textbox', { name: 'Please select a location' });
    readonly searchLocationInput = this.page.getByRole('textbox', { name: 'Search for a location...' });
    readonly dadarOption = this.page.getByRole('button', { name: 'Dadar West, Mumbai,' });
    readonly confirmLocationBtn = this.page.getByRole('button', { name: 'Select Location' });
    readonly datePickers = this.page.getByText('DD/MM/YYYY');
    readonly day18 = this.page.getByRole('gridcell', { name: '18' });
    readonly day31 = this.page.getByRole('gridcell', { name: '31' });
    readonly startTimeInput = this.page.getByRole('textbox', { name: 'Select start time' });
    readonly hour03 = this.page.locator('div').filter({ hasText: /^03$/ });
    readonly endTimeInput = this.page.getByRole('textbox', { name: 'Select end time' });
    readonly hour05 = this.page.getByText('05', { exact: true });
    readonly okBtn = this.page.getByRole('button', { name: 'OK' });
    readonly targetAudienceDropdown = this.page.getByRole('combobox', { name: 'Select target audience' });
    readonly allWomenOption = this.page.getByRole('option', { name: 'All women' });
    readonly submitCreateBtn = this.page.locator('form').getByRole('button', { name: 'Create Activity' });
    readonly successToast = this.page.getByText('Activity created successfully');
    readonly minParticipant = this.page.getByRole('spinbutton', { name: 'Enter min participant' });
    readonly maxParticipant = this.page.getByRole('spinbutton', { name: 'Enter max participant' });

    // ── Actions ───────────────────────────────────────────

    async clickCreate() {
        await this.createBtn.click();
    }

    async uploadImage(filePath: string) {
        // Find the input element which is usually inside or next to the drag-drop button
        const fileInput = this.page.locator('input[type="file"]');
        await fileInput.setInputFiles(filePath);
        await this.saveImageBtn.click();
    }

    async fillTitle(title: string) {
        await this.titleInputPlaceholder.click();
        await this.titleInput.fill(title);
    }

    async selectCategory() {
        await this.categoryDropdown.click();
        await this.wellnessOption.click();
    }

    async toggleSwitch() {
        await this.firstSwitch.check();
    }

    async fillDescription(description: string) {
        await this.descriptionPlaceholder.click();
        await this.descriptionInput.fill(description);
    }

    async setLocation(location: string) {
        await this.selectLocationBtn.click();
        await this.searchLocationInput.click();
        await this.searchLocationInput.fill(location);
        await this.searchLocationInput.press('Enter');
        await this.dadarOption.click();
        await this.confirmLocationBtn.click();
    }

    async setDates() {
        // Start Date
        await this.page.getByRole('group', { name: 'Start date' }).getByRole('button').click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('gridcell', { name: '18', exact: true }).first().click();
        
        await this.page.waitForTimeout(1000); 
        
        // End Date
        await this.page.getByRole('group', { name: 'End date' }).getByRole('button').click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('gridcell', { name: '31', exact: true }).last().click();
    }

    async setTimes() {
        await this.page.getByRole('textbox', { name: 'Select start time' }).click();
        await this.page.waitForTimeout(500);
        await this.page.locator('div').filter({ hasText: /^03$/ }).last().click();
        await this.page.getByRole('button', { name: 'OK' }).click();

        await this.page.waitForTimeout(1000);

        await this.page.getByRole('textbox', { name: 'Select end time' }).click();
        await this.page.waitForTimeout(500);
        await this.page.getByText('05', { exact: true }).last().click();
        await this.page.getByRole('button', { name: 'OK' }).click();
    }

    async selectAudience() {
        await this.targetAudienceDropdown.click();
        await this.allWomenOption.click();
    }

    async fillParticipants() {
        await this.minParticipant.fill('2');
        await this.maxParticipant.fill('10');
    }

    async submit() {
        await this.submitCreateBtn.click();
    }

    async expectSuccess() {
        await expect(this.successToast).toBeVisible({ timeout: 10000 });
    }
}
