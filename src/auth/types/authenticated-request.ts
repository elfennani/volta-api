import { User } from '../../users/entities/user.entity.js';

export interface AuthenticatedRequest extends Request {
  user: User; // Strongly typed and non-optional here
}
