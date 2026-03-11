import fs from 'fs';
import path from 'path';

async function globalSetup() {
    console.log(`\n--- GLOBAL SETUP START: ${process.env.ENVIRONMENT || 'dev'} ---`);

    const reportDirs = ['reports/html', 'reports/junit', 'test-results', 'fixtures/.auth'];

    for (const dir of reportDirs) {
        const dirPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    }

    console.log('Environment variables loaded from .env.dev');
    console.log('Global setup complete.\n');
}

export default globalSetup;
