import { test, expect } from '../../fixtures';
import { loginData } from '../../data/login.factory';
import path from 'path';

test.describe('Activity Management', () => {
    test('Should create a new activity successfully @smoke', async ({ loginPageReady, activityPage }) => {
        // 1. Login
        await loginPageReady.login(loginData.validUser.email, loginData.validUser.password);
        const page = loginPageReady.page;
        page.on('response', async response => {
            if (response.status() >= 400 && response.url().includes('api')) {
                console.log(`API Error Status ${response.status()}: ${response.url()}`);
                try {
                    const text = await response.text();
                    console.log(`Response body: ${text}`);
                } catch (e) {}
            }
        });
        
        page.on('console', msg => {
            if (msg.type() === 'error') console.log(`Console Error: ${msg.text()}`);
        });

        // 2. Activity Creation Steps
        await activityPage.clickCreate();
        
        // Upload image
        const imagePath = path.resolve(__dirname, '../../data/fixtures/activity_sample.png');
        await activityPage.uploadImage(imagePath);
        
        // Fill details
        await activityPage.fillTitle('Fun activity');
        await activityPage.selectCategory();
        await activityPage.toggleSwitch();
        await activityPage.fillDescription('Just description');
        
        // Set location
        await activityPage.setLocation('dadar');
        
        // Set dates
        await activityPage.setDates();
        
        // Set times
        await activityPage.setTimes();
        
        // Select audience
        await activityPage.selectAudience();
        
        // Fill participants
        await activityPage.fillParticipants();

        // Submit
        await activityPage.submit();
        
        // Verify success
        await activityPage.expectSuccess();
    });
});
