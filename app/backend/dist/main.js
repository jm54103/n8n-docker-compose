"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Market Signal API')
        .setDescription('API สำหรับดึงข้อมูลสัญญาณเทคนิค (RSI, EMA, Crosses)')
        .setVersion('1.0')
        .addTag('NestJs')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const frontendPath = (0, path_1.join)(__dirname, '..', 'public');
    console.log(frontendPath);
    app.use(express.static(frontendPath));
    app.getHttpAdapter().get('/', (req, res) => {
        res.sendFile((0, path_1.join)(frontendPath, 'index.html'));
    });
    await app.listen(3000);
    console.log('🚀 API is running on: http://localhost:3000');
    console.log('📖 Swagger Docs: http://localhost:3000/api');
}
bootstrap();
//# sourceMappingURL=main.js.map