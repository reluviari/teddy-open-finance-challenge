import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto, LoginResponseDto } from './dto';

const DEFAULT_SEED_EMAIL = 'admin@teddy.com';
const DEFAULT_SEED_PASSWORD = 'password123';

/** Handles user authentication and JWT token generation. */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /** Validates credentials and returns a signed JWT access token. */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /** Creates a default user if the users table is empty. Not exposed via controller. */
  async seedDefaultUser(): Promise<void> {
    const count = await this.userRepository.count();
    if (count > 0) return;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(DEFAULT_SEED_PASSWORD, salt);

    await this.userRepository.save(
      this.userRepository.create({
        email: DEFAULT_SEED_EMAIL,
        password: hashedPassword,
      }),
    );
  }
}
