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
var cors_1 = require("@fastify/cors");
var fastify_1 = require("fastify");
var ethereumjs_wallet_1 = require("ethereumjs-wallet");
//require('dotenv').config();
var dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/.env' });
var _a = process.env, DB_USER = _a.DB_USER, DB_HOST = _a.DB_HOST, DB_DATABASE = _a.DB_DATABASE, DB_PASSWORD = _a.DB_PASSWORD;
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
// Create a fastify server instance
var server = (0, fastify_1.default)({});
// Register the CORS plugin
server.register(cors_1.default);
server.get('/ping', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log(">>> in ping ...");
        return [2 /*return*/, { pong: 'wallet services worked!' }];
    });
}); });
// GET route to read data from PostgreSQL
server.get('/wallet/:address', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var address, wallet;
    return __generator(this, function (_a) {
        try {
            console.log(">>> in wallet get ...");
            address = request.params.address;
            console.log(request.params);
            wallet = {
                'walletId': '',
                'address': ''
            };
            reply.send(wallet);
        }
        catch (error) {
            console.error('Error reading data:', error);
            reply.status(400).send({ error: 'Error reading data' });
        }
        return [2 /*return*/];
    });
}); });
// POST route to write data to PostgreSQL
server.post('/wallet', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var walletId, randomWallet, walletData, privateKey, address, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(">>> in wallet/create ...");
                console.log(request.body);
                walletId = Math.floor(100000 + Math.random() * 900000);
                randomWallet = ethereumjs_wallet_1.default.generate();
                walletData = {
                    walletId: walletId,
                    privateKey: randomWallet.getPrivateKeyString(),
                    address: randomWallet.getAddressString()
                };
                console.log(walletData);
                privateKey = randomWallet.getPrivateKeyString();
                address = randomWallet.getAddressString();
                // Execute a query to insert data into a table
                return [4 /*yield*/, client.query("INSERT INTO wallets (walletId, address, privateKey) VALUES ($1, $2, $3)", [walletId, address, privateKey])];
            case 1:
                // Execute a query to insert data into a table
                _a.sent();
                reply.send(walletData);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error writing data:', error_1);
                reply.status(400).send({ error: 'Error writing data' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Start the server
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var address, port, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, server.listen({ port: 3011 })];
            case 1:
                _a.sent();
                address = server.server.address();
                port = typeof address === 'string' ? address : address === null || address === void 0 ? void 0 : address.port;
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                server.log.error(err_1);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
start();
