"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceNotAvailable = exports.conflict = exports.forbidden = exports.unauthorized = exports.internalServerError = exports.notFound = exports.badRequest = exports.ApiError = void 0;
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    function ApiError(statusCode, message, details) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.details = details;
        _this.name = "ApiError";
        Error.captureStackTrace(_this, _this.constructor); // need to dive a deep in
        return _this;
    }
    return ApiError;
}(Error));
exports.ApiError = ApiError;
var badRequest = function (message, details) { return new ApiError(400, message, details); };
exports.badRequest = badRequest;
var notFound = function (message, details) { return new ApiError(404, message, details); };
exports.notFound = notFound;
var internalServerError = function (message) {
    if (message === void 0) { message = "Internal server error"; }
    return new ApiError(500, message);
};
exports.internalServerError = internalServerError;
var unauthorized = function (message, details) { return new ApiError(401, message, details); };
exports.unauthorized = unauthorized;
var forbidden = function (message, details) { return new ApiError(403, message, details); };
exports.forbidden = forbidden;
var conflict = function (message, details) { return new ApiError(409, message, details); };
exports.conflict = conflict;
var serviceNotAvailable = function (message, details) { return new ApiError(503, message, details); };
exports.serviceNotAvailable = serviceNotAvailable;
