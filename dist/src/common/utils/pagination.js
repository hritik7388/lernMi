"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const getPagination = (query) => {
    let page = Number(query.page) || DEFAULT_PAGE;
    let limit = Number(query.limit) || DEFAULT_LIMIT;
    page = Math.max(page, 1);
    limit = Math.max(1, Math.min(limit, MAX_LIMIT));
    return {
        page,
        limit,
        skip: (page - 1) * limit,
        take: limit,
    };
};
exports.getPagination = getPagination;
