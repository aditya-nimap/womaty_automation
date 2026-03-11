import { test } from '../../fixtures';
import { loginData } from '../../data/login.factory';
import { UserType } from '../../pages/user-type.page';

test.describe('Auth - Login Flow (Data-Driven)', () => {
    const userTypes: UserType[] = ['Institute User'];

    for (const userType of userTypes) {
        test.describe(`${userType} Scenarios`, () => {

            // Loop through all scenarios in loginData
            for (const [scenarioName, data] of Object.entries(loginData)) {

                test(`${scenarioName} @smoke`, async ({ userTypePage, loginPage }) => {
                    await userTypePage.goto();
                    await userTypePage.selectUserType(userType);

                    // Actions
                    await loginPage.login(data.email, data.password);

                    // Assertions based on scenario type
                    if (scenarioName === 'validUser') {
                        await loginPage.expectLoginButtonEnabled(true);
                        await loginPage.expectLoginSuccess();
                    }
                    else if (['blankEmail', 'blankPassword', 'blankBoth', 'invalidEmailFormat'].includes(scenarioName)) {
                        // For these cases, button should be disabled as per user feedback
                        await loginPage.expectLoginButtonEnabled(false);

                        // User mentioned for "wrong email format" there is no message.
                        // We only check "Email is required!" for blank scenarios if applicable.
                        if (scenarioName === 'blankEmail' || scenarioName === 'blankBoth') {
                            await loginPage.expectValidationError('Email is required!');
                        }
                    }
                    else {
                        // Negative credentials with valid format (invalidPassword, invalidEmail)
                        await loginPage.expectLoginButtonEnabled(true);
                        await loginPage.expectGlobalError();
                    }
                });
            }
        });
    }
});

