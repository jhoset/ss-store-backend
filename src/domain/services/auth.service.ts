import { JwtAdapter, bcryptAdapter } from "../../config";
import { SystemChgType } from "../../config/constants";
import { dbClient } from "../../data";
import { LoginUserDto, RegisterUserDto } from "../dtos/auth";
import { UserDto } from "../dtos/user";
import { CustomError, generateUserName } from "../helpers";
import { UserMapper } from "../mappers";

export class AuthService {
    constructor(
        //TODO: private readonly emailService: EmailService
    ) { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existingUserEmail = await dbClient.user.findFirst({ where: { email: registerUserDto.email } });
        if (existingUserEmail) throw CustomError.badRequest("A user already exists with the provided email.");
        
        const userToCreate = UserMapper.from(registerUserDto);
        userToCreate.userName = generateUserName(registerUserDto.firstName, registerUserDto.lastName);
        userToCreate.password = bcryptAdapter.hash(userToCreate.password);
        userToCreate.changedBy = userToCreate.userName;
        userToCreate.changeType = SystemChgType.create;
        const newUser = await dbClient.user.create({
            data: userToCreate
        })
        const token = await JwtAdapter.generateToken({
            user: {
                id: newUser.id,
                userName: newUser.userName
            }
        })
        if (!token) throw CustomError.internalServerError(`Error while generating JWT.`);
        return { user: UserDto.mapFrom(newUser), token };
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const existingUser = await dbClient.user.findFirst({ where: { email, isDeleted: false } });
        if (!existingUser) throw CustomError.badRequest("There is no user associated to this email.");

        const match = await bcryptAdapter.compare(password, existingUser.password);
        if (!match) throw CustomError.badRequest("Email or Password is incorrect.");

        const token = await JwtAdapter.generateToken({
            user: {
                id: existingUser.id,
                userName: existingUser.userName
            }
        })
        if (!token) throw CustomError.internalServerError(`Error while generating JWT.`);
        return { user: UserDto.mapFrom(existingUser), token };
    }
}

