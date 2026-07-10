export interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
}

export interface PaginationOptions {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const getPagination = (query: PaginationQuery): PaginationOptions => {
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
