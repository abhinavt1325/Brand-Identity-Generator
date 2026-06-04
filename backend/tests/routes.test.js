"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_1 = require("../src/app");
(0, vitest_1.describe)('Routes', () => {
    let app;
    (0, vitest_1.beforeAll)(async () => {
        app = await (0, app_1.buildApp)();
        await app.ready();
    });
    (0, vitest_1.afterAll)(async () => {
        await app.close();
    });
    (0, vitest_1.it)('GET /health returns 200', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/health'
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const json = response.json();
        (0, vitest_1.expect)(json.status).toBe('ok');
        (0, vitest_1.expect)(json.service).toBe('brand-identity-backend');
    });
});
