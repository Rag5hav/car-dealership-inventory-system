import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';

export interface RegisterDTO {
  email: string;
  password: string;
  role?: 'user' | 'admin';
  adminKey?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export class AuthService {
  static async register(dto: RegisterDTO): Promise<AuthResponse> {
    const requestedRole = dto.role || 'user';

    if (requestedRole === 'admin') {
      const validAdminKey = process.env.ADMIN_SECRET_KEY || 'admin_secret_key_2026';
      if (!dto.adminKey || dto.adminKey !== validAdminKey) {
        throw new Error('Invalid admin secret key');
      }
    }

    const existingUser = await User.findOne({ email: dto.email.toLowerCase() });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await User.create({
      email: dto.email,
      password: dto.password,
      role: requestedRole,
    });

    const token = generateToken(user._id.toString(), user.role);

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  }

  static async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await User.findOne({ email: dto.email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id.toString(), user.role);

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  }
}
