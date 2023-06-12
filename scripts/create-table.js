"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/.env' });
var _a = process.env, DB_USER = _a.DB_USER, DB_HOST = _a.DB_HOST, DB_DATABASE = _a.DB_DATABASE, DB_PASSWORD = _a.DB_PASSWORD;
console.log("******************\n db connection *********************");
console.log("DB_USER: " + DB_USER);
console.log("DB_HOST: " + DB_HOST);
console.log("DB_DATABASE: " + DB_DATABASE);
console.log("DB_PASSWORD: " + DB_PASSWORD);
// Create a new PostgreSQL client
var client = new pg_1.Client({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: 5432,
});
// Connect to the PostgreSQL server
client.connect();
// Function to create the table
function createAccountTable() {
    return __awaiter(this, void 0, void 0, function () {
        var dropTableQuery, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    dropTableQuery = "DROP TABLE IF EXISTS accounts;";
                    return [4 /*yield*/, client.query(dropTableQuery)];
                case 1:
                    _a.sent();
                    // Create the 'accounts' table
                    return [4 /*yield*/, client.query("CREATE TABLE accounts (\n        accountId VARCHAR,\n        accountName VARCHAR,\n        investorId VARCHAR,\n        walletId VARCHAR,\n        address VARCHAR,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n        PRIMARY KEY (accountId, investorId),\n        FOREIGN KEY (investorId) REFERENCES investors (investorId)        \n      )")];
                case 2:
                    // Create the 'accounts' table
                    _a.sent();
                    console.log('accounts table created successfully!');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error creating table:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function inserToAccountTable() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // inserToAccountTable
                    return [4 /*yield*/, client.query("INSERT INTO accounts (accountId, investorId, accountName, walletId, address) VALUES ($1, $2, $3, $4, $5)", ['0001001', 'I0001001', 'acct1001', 'wallet1001', '0x012020fhe03999djs99k002920343jd'])];
                case 1:
                    // inserToAccountTable
                    _a.sent();
                    console.log('insert successfully!');
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error creating table:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createWalletTable() {
    return __awaiter(this, void 0, void 0, function () {
        var dropTableQuery, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    dropTableQuery = "DROP TABLE IF EXISTS wallets;";
                    return [4 /*yield*/, client.query(dropTableQuery)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.query("\n        CREATE TABLE wallets (\n          walletId VARCHAR PRIMARY KEY,\n          privateKey VARCHAR,          \n          address VARCHAR,\n          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n        )\n      ")];
                case 2:
                    _a.sent();
                    console.log('wallets table created successfully!');
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error creating table:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function inserToWalletTable() {
    return __awaiter(this, void 0, void 0, function () {
        var walletId, privateKey, address, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    walletId = '265526';
                    privateKey = '0x421273a2caec0e0b542eb3bcc1c7d5c0769b5227b4f61fa2003c8a714c370402';
                    address = '0xf5c8552afc99a19b8ceaf092d2db58cb9b2e950a';
                    // inserToWalletTable
                    return [4 /*yield*/, client.query("INSERT INTO wallets (walletId, privateKey, address) VALUES ($1, $2, $3)", [walletId, privateKey, address])];
                case 1:
                    // inserToWalletTable
                    _a.sent();
                    console.log('insert successfully!');
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error creating table:', error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//Function to create the investor table
function createInvestorTable() {
    return __awaiter(this, void 0, void 0, function () {
        var alterTableQuery, dropTableQuery, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    alterTableQuery = "ALTER TABLE accounts DROP CONSTRAINT accounts_investorid_fkey;";
                    dropTableQuery = "DROP TABLE IF EXISTS investors;";
                    return [4 /*yield*/, client.query(alterTableQuery)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.query(dropTableQuery)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.query("\n      CREATE TABLE investors (\n        investorId VARCHAR PRIMARY KEY,\n        investorName VARCHAR,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      )")];
                case 3:
                    _a.sent();
                    console.log('Investor table created successfully!');
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    console.error('Error creating investor table:', error_5);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function inserToInvestorTable() {
    return __awaiter(this, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // inserToAccountTable
                    return [4 /*yield*/, client.query("INSERT INTO investors (investorId, investorName) VALUES ($1, $2)", ['I0001001', 'inv1001'])];
                case 1:
                    // inserToAccountTable
                    _a.sent();
                    console.log('insert successfully!');
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error creating table:', error_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function runTableCreation() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createInvestorTable()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, createAccountTable()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, createWalletTable()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function testTableInserts() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inserToInvestorTable()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, inserToAccountTable()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, inserToWalletTable()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//runTableCreation();
testTableInserts();
