"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = exports.secret = exports.key = exports.endpoint = exports.bucket = exports.QuadStore = exports.FrontendStore = exports.FileStore = exports.Bucket = exports._self = exports.ns = exports.loadData = void 0;
const NameSpace_1 = require("@_linked/core/utils/NameSpace");
const package_js_1 = require("../package.js");
const _this = __importStar(require("./s3.js"));
var loadData = () => {
    if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
        return Promise.resolve().then(() => __importStar(require('../data/s3.json')));
    }
    else {
        //@ts-ignore
        return Promise.resolve().then(() => __importStar(require('../data/s3.json'))).then((data) => data.default);
    }
};
exports.loadData = loadData;
exports.ns = (0, NameSpace_1.createNameSpace)('http://lincd.org/ont/s3/');
exports._self = (0, exports.ns)('');
// Classes
exports.Bucket = (0, exports.ns)('Bucket');
exports.FileStore = (0, exports.ns)('FileStore');
exports.FrontendStore = (0, exports.ns)('FrontendStore');
exports.QuadStore = (0, exports.ns)('QuadStore');
// Properties
exports.bucket = (0, exports.ns)('bucket');
exports.endpoint = (0, exports.ns)('endpoint');
exports.key = (0, exports.ns)('key');
exports.secret = (0, exports.ns)('secret');
//An extra grouping object so all the entities can be accessed from the prefix/name
exports.s3 = {
    // Classes
    Bucket: exports.Bucket,
    FileStore: exports.FileStore,
    FrontendStore: exports.FrontendStore,
    QuadStore: exports.QuadStore,
    // Properties
    bucket: exports.bucket,
    endpoint: exports.endpoint,
    key: exports.key,
    secret: exports.secret,
};
//Registers this ontology to LINCD.JS, so that data loading can be automated amongst other things
(0, package_js_1.linkedOntology)(_this, exports.ns, 's3', exports.loadData, '../data/s3.json');
//# sourceMappingURL=s3.js.map