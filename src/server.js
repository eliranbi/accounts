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
var dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/.env' });
var axios_1 = require("axios");
var fastify_1 = require("fastify");
var _a = process.env, DB_USER = _a.DB_USER, DB_HOST = _a.DB_HOST, DB_DATABASE = _a.DB_DATABASE, DB_PASSWORD = _a.DB_PASSWORD, WALLET_SERVICES_URL = _a.WALLET_SERVICES_URL;
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
        return [2 /*return*/, { message: 'account services is up - ' + new Date() }];
    });
}); });
//GET - Investor accounts 
server.get('/investors/accounts/:investorId', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var investorId, result, rows, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(">>> in investors ...");
                investorId = request.params.investorId;
                console.log(request.params);
                return [4 /*yield*/, client.query('SELECT * FROM accounts WHERE investorId = $1', [investorId])];
            case 1:
                result = _a.sent();
                rows = result.rows;
                if (rows == null || rows.length <= 0) {
                    throw { status: 400, message: 'No account for investor' };
                }
                console.log(rows);
                reply.send(rows);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.error('Error reading data:', e_1);
                reply.status(400).send({ error: e_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET route to read data from PostgreSQL
server.get('/accounts/:accountId', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var accountId, result, rows, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(">>> in accounts ...");
                accountId = request.params.accountId;
                console.log(request.params);
                return [4 /*yield*/, client.query('SELECT * FROM accounts WHERE accountId = $1', [accountId])];
            case 1:
                result = _a.sent();
                rows = result.rows;
                if (rows == null || rows.length <= 0) {
                    throw { status: 400, message: 'Account does not exist' };
                }
                console.log(rows);
                reply.send(rows[0]);
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                console.error('Error reading data:', e_2);
                reply.status(400).send({ error: e_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST - Create an account
server.post('/accounts', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, accountId, accountName, investorId, investorName, createdBy, metadata, rows, error_1, wallet, error_2, e_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                console.log(">>> in accounts/create ...");
                console.log(request.body);
                _a = request.body, accountId = _a.accountId, accountName = _a.accountName, investorId = _a.investorId, investorName = _a.investorName, createdBy = _a.createdBy, metadata = _a.metadata;
                metadata = metadata !== null && metadata !== void 0 ? metadata : {};
                createdBy = createdBy !== null && createdBy !== void 0 ? createdBy : 'ADMIN';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, client.query('SELECT * FROM accounts WHERE accountId = $1', [accountId])];
            case 2:
                rows = (_b.sent()).rows;
                if (rows.length > 0) {
                    console.log('account:', rows[0]);
                    throw { status: 400, message: 'Error account already exist' };
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error('Error account already exist :', error_1);
                throw { status: 400, message: 'Error account already exist' };
            case 4:
                // Call wallet api to get walletId and address ... 
                console.log(">>> calling wallet services ...");
                console.log(WALLET_SERVICES_URL);
                _b.label = 5;
            case 5:
                _b.trys.push([5, 8, , 9]);
                return [4 /*yield*/, axios_1.default.post(WALLET_SERVICES_URL, {})];
            case 6:
                wallet = _b.sent();
                console.log(wallet.data);
                console.log(">>> saving new account to database ...");
                // Execute a query to insert data into a table
                return [4 /*yield*/, client.query(
                    //`INSERT INTO accounts (accountId, accountName, investorId, walletId, address) VALUES ($1, $2, $3, $4, $5)`,
                    "INSERT INTO accounts (accountId, accountName, investorId, investorName, walletId, address, createdBy, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [accountId, accountName, investorId, investorName, wallet.data.walletId, wallet.data.address, createdBy, metadata])];
            case 7:
                // Execute a query to insert data into a table
                _b.sent();
                return [3 /*break*/, 9];
            case 8:
                error_2 = _b.sent();
                console.error('Error creatting wallet:', error_2);
                throw { status: 400, message: 'Error creatting wallet' };
            case 9:
                reply.send({ message: 'Data inserted successfully!' });
                return [3 /*break*/, 11];
            case 10:
                e_3 = _b.sent();
                console.error(e_3);
                console.error('Error writing data:', e_3);
                reply.status(400).send({ error: e_3.message });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
//adding swagger
server.register(require('@fastify/swagger'), {
    mode: 'static',
    specification: {
        path: __dirname + '/swagger-static-specification.json'
    }
});
server.register(require('./swagger'));
try {
    server.listen({ port: 3000 }, function (err) {
        if (err)
            throw err;
    });
}
catch (err) {
    server.log.error(err);
    process.exit(1);
}
