"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes/routes"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const app = express_1.default();
mongoose_1.default.connect('mongodb://localhost/AuthDatabase');
mongoose_1.default.connection.on('error', (error) => console.log(error));
mongoose_1.default.Promise = global.Promise;
require('./models/user');
require('./auth/auth');
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use('/', routes_1.default);
app.use(errorhandler_1.default());
app.use((err, _req, res) => {
    res.status(err.status || 500);
    res.json({ error: err });
});
app.listen(9000, () => console.log('Server started'));
//# sourceMappingURL=app.js.map