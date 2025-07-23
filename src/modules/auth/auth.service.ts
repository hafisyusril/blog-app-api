import { ApiError } from "../../utils/api-error";
import { PasswordService } from "../password/password.service";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";

export class AuthService {
  private prisma: PrismaService;
  private passwordService: PasswordService;

  constructor() {
    this.prisma = new PrismaService();
    this.passwordService = new PasswordService();
  }

  register = async (body: RegisterDTO) => {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    if (user) {
      throw new ApiError("email already exist!", 400);
    }

    const hashedPassword = await this.passwordService.hashPassword(
      body.password
    );

    return await this.prisma.user.create({
      data: { name: body.name, email: body.email, password: hashedPassword },
      omit: { password: true },
    });
  };
}
