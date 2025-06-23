import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { RegisterDto, LoginDto } from "../dto/auth.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "../dto/password-reset.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Get("validate-reset-token")
  async validateResetToken(@Query("token") token: string) {
    return this.userService.validateResetToken(token);
  }
}
