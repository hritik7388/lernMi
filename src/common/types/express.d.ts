// src/common/types/express.d.ts
declare global {
  namespace Express {
    interface User {
      userId: string;
      credId: string;
      email: string;
      userType: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};