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
require('dotenv').config();
var _a = process.env, DB_USER = _a.DB_USER, DB_HOST = _a.DB_HOST, DB_DATABASE = _a.DB_DATABASE, DB_PASSWORD = _a.DB_PASSWORD, DB_PORT = _a.DB_PORT;
// Create a new PostgreSQL client
var client = new pg_1.Client({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT,
});
// Connect to the PostgreSQL server
client.connect();
// Function to create the table
function createAccountTable() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    // Create the 'accounts' table
                    return [4 /*yield*/, client.query("\n      CREATE TABLE accounts (\n        accountId VARCHAR PRIMARY KEY,\n        accountName VARCHAR,\n        walletId VARCHAR,\n        address VARCHAR,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      )\n    ")];
                case 1:
                    // Create the 'accounts' table
                    _a.sent();
                    console.log('Table created successfully!');
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error creating table:', error_1);
                    return [3 /*break*/, 4];
                case 3: return [7 /*endfinally*/];
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
                    _a.trys.push([0, 2, 3, 4]);
                    // inserToAccountTable
                    return [4 /*yield*/, client.query("INSERT INTO accounts (accountId, accountName,walletId, address) VALUES ($1, $2, $3, $4)", ['0001001', 'acct1001', '00001', '0x012020fhe03999djs99k002920343jd'])];
                case 1:
                    // inserToAccountTable
                    _a.sent();
                    console.log('insert successfully!');
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error creating table:', error_2);
                    return [3 /*break*/, 4];
                case 3:
                    // Close the client connection
                    client.end();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function createWalletTable() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    // Create the 'wallets' table
                    return [4 /*yield*/, client.query("\n        CREATE TABLE wallets (\n          walletId VARCHAR PRIMARY KEY,\n          privateKey VARCHAR,          \n          address VARCHAR,\n          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n        )\n      ")];
                case 1:
                    // Create the 'wallets' table
                    _a.sent();
                    console.log('wallets table created successfully!');
                    return [3 /*break*/, 4];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error creating table:', error_3);
                    return [3 /*break*/, 4];
                case 3: return [7 /*endfinally*/];
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
                    _a.trys.push([0, 2, 3, 4]);
                    walletId = '265526';
                    privateKey = '0x421273a2caec0e0b542eb3bcc1c7d5c0769b5227b4f61fa2003c8a714c370402';
                    address = '0xf5c8552afc99a19b8ceaf092d2db58cb9b2e950a';
                    // inserToWalletTable
                    return [4 /*yield*/, client.query("INSERT INTO wallets (walletId, privateKey, address) VALUES ($1, $2, $3)", [walletId, privateKey, address])];
                case 1:
                    // inserToWalletTable
                    _a.sent();
                    console.log('insert successfully!');
                    return [3 /*break*/, 4];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error creating table:', error_4);
                    return [3 /*break*/, 4];
                case 3:
                    // Close the client connection
                    client.end();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Call the function to create the table
//createAccountTable();
//inserToAccountTable();
createWalletTable();
inserToWalletTable();
