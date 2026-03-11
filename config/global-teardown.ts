async function globalTeardown() {
    console.log('\n--- GLOBAL TEARDOWN START ---');
    // Add any global cleanup logic here (e.g., closing DB connections, global API cleanup)
    console.log('Global teardown complete.\n');
}

export default globalTeardown;
