import { dbClient } from "../../data";
import { UserMapper } from "../mappers";
import { CustomError, generateUserName } from "../helpers";
import { CreateUserDto, UpdateUserDto, UserDto } from "../dtos/user";
import { PaginationDto, PaginationResultDto } from "../dtos/shared";
import { bcryptAdapter } from "../../config";
import { CurrentUserDto } from "../dtos/auth";

export class UserService {


    public async getUsers(paginationDto: PaginationDto): Promise<PaginationResultDto> {
        const { page, limit } = paginationDto;
        const [total, users] = await Promise.all([
            dbClient.user.count(),
            dbClient.user.findMany({
                where: { isDeleted: false },
                skip: ((page - 1) * limit),
                take: limit
            })
        ])
        const result = users.map(user => (UserDto.mapFrom(user)))
        return {
            pagination: {
                total,
                page,
                limit,
                prev: page - 1 > 0 ? `/api/users?page=${page - 1}&limit=${limit}` : null,
                next: page * limit < total ? `/api/users?page=${page + 1}&limit=${limit}` : null,
            },
            result
        }
    }

    public async createUser(createUserDto: CreateUserDto, currentUser: CurrentUserDto) {
        createUserDto.password = bcryptAdapter.hash(createUserDto.password);
        createUserDto.userName = generateUserName(createUserDto.firstName, createUserDto.lastName);
        const userToCreate = UserMapper.from(createUserDto);
        userToCreate.changedBy = currentUser.userName;
        const newUser = await dbClient.user.create({
            data: userToCreate
        })
        return UserDto.mapFrom(newUser);
    }


    public async updateUser(id: number, updateUserDto: UpdateUserDto, currentUser: CurrentUserDto) {
        const existUser = await dbClient.user.findFirst({ where: { id, isDeleted: false } });
        if (!existUser) throw CustomError.notFound(`No user found with ID: ${id}`)
        const userToUpdate = UserMapper.from(updateUserDto);
        userToUpdate.changedBy = currentUser.userName;
        userToUpdate.changeType = "U";
        const userUpdated = await dbClient.user.update({
            where: {
                id
            },
            data: userToUpdate
        })
        return UserDto.mapFrom(userUpdated);
    }

    public async deleteUser(id: number, currentUser: CurrentUserDto) {
        const existUser = await dbClient.user.findFirst({ where: { id, isDeleted: false } });
        if (!existUser) throw CustomError.notFound(`No user found with ID: ${id}`)
        const userDeleted = await dbClient.user.update({
            where: { id },
            data: { isDeleted: true, changedBy: currentUser.userName, changeType: "D" }
        })
        return userDeleted ? true : false;
    }

}