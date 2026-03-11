// fixtures/index.ts

import { test as base, expect } from '@playwright/test';
import { UserTypePage } from '../pages/user-type.page';
import { LoginPage } from '../pages/login.page';
import { ActivityPage } from '../pages/activity.page';

type Fixtures = {
    userTypePage: UserTypePage;
    loginPage: LoginPage;
    activityPage: ActivityPage;

    // This fixture does BOTH steps for you:
    // 1. goes to welcome screen
    // 2. selects Institute User and clicks Next
    // 3. hands you the loginPage ready to use
    loginPageReady: LoginPage;
};

export const test = base.extend<Fixtures>({

    userTypePage: async ({ page }, use) => {
        await use(new UserTypePage(page));
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    activityPage: async ({ page }, use) => {
        await use(new ActivityPage(page));
    },

    // The smart fixture — navigates through user type screen automatically
    loginPageReady: async ({ page }, use) => {
        const userTypePage = new UserTypePage(page);
        const loginPage = new LoginPage(page);

        // Do the navigation
        await userTypePage.goto();
        await userTypePage.selectUserType('Institute User');

        // Now hand the loginPage to the test
        await use(loginPage);
    },

});

export { expect };