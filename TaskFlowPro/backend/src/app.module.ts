import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { TodoController } from "./controllers/todo.controller";
import { TodoService } from "./services/todo.service";
import { Todo } from "./entities/todo.entity";
import { User } from "./entities/user.entity";
import { PasswordReset } from "./entities/password-reset.entity";
import { UserService } from "./services/user.service";
import { EmailService } from "./services/email.service";
import { AuthController } from "./controllers/auth.controller";
import { UserController } from "./controllers/user.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "todo.db",
      entities: [Todo, User, PasswordReset],
      synchronize: true, // Only for development
    }),
    TypeOrmModule.forFeature([Todo, User, PasswordReset]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "changeme",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [TodoController, AuthController, UserController],
  providers: [TodoService, UserService, EmailService, JwtStrategy],
})
export class AppModule {}
