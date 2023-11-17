// express.d.ts
import { User } from './authentication/model/authentication.interface'; // Adjust the path as necessary

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
