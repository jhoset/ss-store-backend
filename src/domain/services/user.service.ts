import { dbClient } from "../../data";
import { UserMapper } from "../mappers";
import { CustomError, generateUserName } from "../helpers";
import { CreateUserDto, CreateUserWithRolesDto, UpdateUserDto, UpdateUserWithRolesDto, UserDto, UserWithRolesDto } from "../dtos/user";
import { PaginationDto, PaginationResultDto } from "../dtos/shared";
import { bcryptAdapter } from "../../config";
import { CurrentUserDto } from "../dtos/auth";
import { RoleService } from "./role.service";

export class UserService {
    private roleService = new RoleService();

    public async getUsersWithRoles(paginationDto: PaginationDto): Promise<PaginationResultDto> {
        const { page, limit } = paginationDto;
        const [total, users] = await Promise.all([
            dbClient.user.count(),
            dbClient.user.findMany({
                where: { isDeleted: false },
                include: {
                    roles: {
                        select: {
                            role: true
                        }
                    },
                },
                skip: ((page - 1) * limit),
                take: limit
            })
        ])
        const userWithRoles: any = users.map(user => (
            {
                ...user,
                roles: user.roles.map(({ role }) => role)
            }
        ))
        const result = userWithRoles.map((user: any) => (UserWithRolesDto.mapFrom(user)));
        return {
            pagination: {
                total,
                page,
                limit,
                prev: page - 1 > 0 ? `/api/users/roles?page=${page - 1}&limit=${limit}` : null,
                next: page * limit < total ? `/api/users/roles?page=${page + 1}&limit=${limit}` : null,
            },
            result
        }
    }

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


    public async createUserWithRoles(createUserWithRoleDto: CreateUserWithRolesDto, currentUser: CurrentUserDto) {
        const { roleIds } = createUserWithRoleDto;
        const roles = await dbClient.role.findMany({
            where: {
                isDeleted: false,
                id: { in: roleIds }
            }
        })
        if (roles.length && (roles.length !== roleIds.length)) {
            throw CustomError.badRequest(`At least one of the role IDs specified does not exists`)
        }

        createUserWithRoleDto.password = bcryptAdapter.hash(createUserWithRoleDto.password);
        createUserWithRoleDto.userName = generateUserName(createUserWithRoleDto.firstName, createUserWithRoleDto.lastName);
        const userToCreate = UserMapper.from(createUserWithRoleDto);

        userToCreate.changedBy = currentUser.userName;
        const newUser = await dbClient.user.create({
            data: {
                ...userToCreate,
                roles: {
                    create: roleIds.map(id => (
                        {
                            changedBy: currentUser.userName,
                            role: {
                                connect: { id }
                            }
                        }
                    ))
                }
            }
        })
        return UserDto.mapFrom({ ...newUser, roles });
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

    public async updateUserWithRoles(updateUserRolesDto: UpdateUserWithRolesDto, currentUser: CurrentUserDto) {
        const { id, roleIds } = updateUserRolesDto;

        const roles = await dbClient.role.findMany({
            where: {
                isDeleted: false,
                id: { in: roleIds }
            }
        })
        if (roles.length && (roles.length !== roleIds.length)) {
            throw CustomError.badRequest(`At least one of the role IDs specified does not exists`)
        }

        const userToUpdate = UserMapper.from(updateUserRolesDto);
        userToUpdate.changedBy = currentUser.userName;
        userToUpdate.changeType = "U";
        const userUpdated = await dbClient.user.update({
            where: { id },
            data: {
                ...userToUpdate,
                roles: {
                    deleteMany: {},
                    create: roleIds.map(id => (
                        {
                            changedBy: currentUser.userName,
                            role: {
                                connect: { id }
                            }
                        }
                    ))
                }
            }
        })
        return UserDto.mapFrom({ ...userUpdated, roles })

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