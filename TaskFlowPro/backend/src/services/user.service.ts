import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { JwtService } from "@nestjs/jwt";
import { User } from "../entities/user.entity";
import { PasswordReset } from "../entities/password-reset.entity";
import { RegisterDto, LoginDto, UserResponseDto } from "../dto/auth.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "../dto/password-reset.dto";
import { EmailService } from "./email.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async register(
    registerDto: RegisterDto
  ): Promise<{ user: UserResponseDto; token: string }> {
    const { email, password, name } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: savedUser.id,
      email: savedUser.email,
    });

    // Return user without password
    const { password: _, ...userResponse } = savedUser;

    return {
      user: userResponse as UserResponseDto,
      token,
    };
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ user: UserResponseDto; token: string }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
    });

    // Return user without password
    const { password: _, ...userResponse } = user;

    return {
      user: userResponse as UserResponseDto,
      token,
    };
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        message:
          "If an account with that email exists, a password reset link has been sent.",
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    // Save reset token
    const passwordReset = this.passwordResetRepository.create({
      email,
      token: resetToken,
      expiresAt,
      used: false,
    });

    await this.passwordResetRepository.save(passwordReset);

    // Send email
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:4200"
    }/reset-password?token=${resetToken}`;
    await this.emailService.sendPasswordResetEmail(email, resetToken, resetUrl);

    return {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    // Find valid reset token
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { token, used: false },
    });

    if (!passwordReset) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    // Check if token is expired
    if (new Date() > passwordReset.expiresAt) {
      throw new BadRequestException("Reset token has expired");
    }

    // Find user
    const user = await this.userRepository.findOne({
      where: { email: passwordReset.email },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await this.userRepository.save(user);

    // Mark token as used
    passwordReset.used = true;
    await this.passwordResetRepository.save(passwordReset);

    // Send confirmation email
    await this.emailService.sendPasswordChangedEmail(user.email);

    return { message: "Password has been reset successfully" };
  }

  async validateResetToken(
    token: string
  ): Promise<{ valid: boolean; message?: string }> {
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { token, used: false },
    });

    if (!passwordReset) {
      return { valid: false, message: "Invalid reset token" };
    }

    if (new Date() > passwordReset.expiresAt) {
      return { valid: false, message: "Reset token has expired" };
    }

    return { valid: true };
  }
}
