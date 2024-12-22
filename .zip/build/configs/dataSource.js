"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
// data-source.ts
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("../entities/user.entity");
const earnings_entity_1 = require("../entities/earnings.entity");
const investment_entity_1 = require("../entities/investment.entity");
const return_entity_1 = require("../entities/return.entity");
(0, dotenv_1.config)();
exports.dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [user_entity_1.User, earnings_entity_1.Earning, investment_entity_1.Investment, return_entity_1.Return],
    synchronize: true,
});
