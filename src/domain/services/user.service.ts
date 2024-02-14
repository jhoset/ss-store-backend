import { dbClient } from "../../data";
import { UserMapper } from "../mappers";
import { CustomError, generateUserName } from "../helpers";
import { CreateUserDto, CreateUserWithRoleDto, UpdateUserDto, UpdateUserRolesDto, UserDto, UserRolesDto } from "../dtos/user";
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
        const result = userWithRoles.map((user: any) => (UserRolesDto.mapFrom(user)));
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


    public async createUserWithExistingRoles(createUserWithRoleDto: CreateUserWithRoleDto, currentUser: CurrentUserDto) {
        const { roleIds } = createUserWithRoleDto;
        const existingRoles = await dbClient.role.findMany({
            where: {
                id: {
                    in: roleIds
                }
            }
        })
        if (!existingRoles || !existingRoles.length || (existingRoles.length !== roleIds.length)) {
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
                    create: roleIds.map(roleId => (
                        {
                            changedBy: currentUser.userName,
                            role: {
                                connect: {
                                    id: roleId,
                                }
                            }
                        }
                    ))
                }
            }
        })
        return UserDto.mapFrom(newUser);
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

    public async updateUserRoles(updateUserRolesDto: UpdateUserRolesDto, currentUser: CurrentUserDto) {
        const { userId, roleIds } = updateUserRolesDto;
        const existUser = await dbClient.user.findFirst({ where: { id: userId, isDeleted: false }, include: { roles: true } });
        if (!existUser) throw CustomError.notFound(`No user found with ID: ${userId}`)
        await this.removeRolesOfUser(userId);
        if (roleIds.length) {
            const existingRoles = await this.getExistingRoleByIds(roleIds);
            if (!existingRoles || !existingRoles.length || (existingRoles.length !== roleIds.length)) {
                throw CustomError.badRequest(`At least one of the role IDs specified does not exists`)
            }
            await this.assignRolesToUser(userId, roleIds, currentUser.userName);
        }

        const roles = await this.roleService.getManyRolesByIds(roleIds);
        return UserRolesDto.mapFrom({ ...existUser, roles })

    }

    private async removeRolesOfUser(userId: number) {
        const rolesDeleted = await dbClient.userRoleDetail.deleteMany({ where: { userId } })
        return rolesDeleted;
    }

    private async assignRolesToUser(userId: number, roleIds: number[], currentUserName: string) {
        const rolesAssigned = await dbClient.userRoleDetail.createMany({
            data: roleIds.map(roleId => ({
                changedBy: currentUserName,
                userId,
                roleId
            }))
        })
        return rolesAssigned;
    }

    private async getExistingRoleByIds(roleIds: number[]) {
        const existingRoles = await dbClient.role.findMany({
            where: {
                id: {
                    in: roleIds
                }
            }
        })
        return existingRoles;
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