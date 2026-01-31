import { db } from '../db';
import { users } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { SignupInput, SigninInput } from '../schemas';

export class AuthService {
  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Sign up a new user
   */
  async signup(data: SignupInput) {
    // Check if user already exists by email
    const existingUserByEmail = await db.query.users.findFirst({
      where: and(eq(users.email, data.email), isNull(users.deletedAt)),
    });

    if (existingUserByEmail) {
      throw new Error('Email already registered');
    }

    // Check if user already exists by CPF
    const existingUserByCpf = await db.query.users.findFirst({
      where: and(eq(users.cpf, data.cpf), isNull(users.deletedAt)),
    });

    if (existingUserByCpf) {
      throw new Error('CPF already registered');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        birthdate: data.birthdate,
        password: hashedPassword,
        motherName: data.motherName,
        active: true,
      })
      .returning();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Sign in a user
   */
  async signin(data: SigninInput) {
    // Find user by email
    const user = await db.query.users.findFirst({
      where: and(eq(users.email, data.email), isNull(users.deletedAt)),
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.active) {
      throw new Error('User account is inactive');
    }

    // Compare password
    const isPasswordValid = await this.comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number) {
    const user = await db.query.users.findFirst({
      where: and(eq(users.id, id), isNull(users.deletedAt)),
    });

    if (!user) {
      return null;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: and(eq(users.email, email), isNull(users.deletedAt)),
    });

    if (!user) {
      return null;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
