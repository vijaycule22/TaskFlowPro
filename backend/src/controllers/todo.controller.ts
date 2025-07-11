import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from "@nestjs/common";
import { TodoService } from "../services/todo.service";
import { Todo } from "../entities/todo.entity";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("todos")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll(@Req() req): Promise<Todo[]> {
    return this.todoService.findAll(req.user.userId);
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @Req() req
  ): Promise<Todo> {
    return this.todoService.findOne(id, req.user.userId);
  }

  @Post()
  async create(@Body() todoData: Partial<Todo>, @Req() req): Promise<Todo> {
    const user = { id: req.user.userId } as any;
    return this.todoService.create(todoData, user);
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() todoData: Partial<Todo>,
    @Req() req
  ): Promise<Todo> {
    return this.todoService.update(id, todoData, req.user.userId);
  }

  @Put(":id/toggle")
  async toggleComplete(
    @Param("id", ParseIntPipe) id: number,
    @Req() req
  ): Promise<Todo> {
    return this.todoService.toggleComplete(id, req.user.userId);
  }

  @Delete(":id")
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @Req() req
  ): Promise<void> {
    return this.todoService.remove(id, req.user.userId);
  }
}
