import type { User } from '../entities/user.entity.js';
import type { UserResponseDto } from '../dto/user-response.dto.js';

export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    setupComplete: user.isActive,
  };
}
