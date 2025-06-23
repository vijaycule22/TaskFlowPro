import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Todo } from "../entities/todo.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>
  ) {}

  async findAll(userId: number): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id, userId } });
    if (!todo) throw new NotFoundException("Todo not found");
    return todo;
  }

  async create(todoData: Partial<Todo>, user: User): Promise<Todo> {
    const todo = this.todoRepository.create({ ...todoData, userId: user.id });
    return this.todoRepository.save(todo);
  }

  async update(
    id: number,
    todoData: Partial<Todo>,
    userId: number
  ): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    Object.assign(todo, todoData);
    return this.todoRepository.save(todo);
  }

  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todoRepository.delete(todo.id);
  }

  async toggleComplete(id: number, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    todo.completed = !todo.completed;
    return this.todoRepository.save(todo);
  }
}
