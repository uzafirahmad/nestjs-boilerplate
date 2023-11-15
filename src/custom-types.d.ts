// src/custom-types.d.ts
declare namespace Express {
    export interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        // Add other properties as needed
      };
    }
  }
  