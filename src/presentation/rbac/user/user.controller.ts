import { UserService } from "../../../domain/services";
import { PaginationDto } from "../../../domain/dtos/shared";
import { handleError } from "../../../domain/helpers";
import { CreateUserDto, CreateUserWithRoleDto, UpdateUserDto, UpdateUserRolesDto } from "../../../domain/dtos/user";
import { CustomRequest, CustomResponse } from "../../interfaces";

export class UserController {


    constructor(private readonly userService: UserService) { }


    public getUsersWithRoles = (req: CustomRequest, res: CustomResponse) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.mapFrom(+page, +limit);
        if (error) return res.status(400).json(error);

        this.userService.getUsersWithRoles(paginationDto!)
            .then(paginationResult => res.status(200).json(paginationResult))
            .catch(error => handleError(error, res));
    }

    public getUsers = (req: CustomRequest, res: CustomResponse) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.mapFrom(+page, +limit);
        if (error) return res.status(400).json(error);

        this.userService.getUsers(paginationDto!)
            .then(paginationResult => res.status(200).json(paginationResult))
            .catch(error => handleError(error, res));
    }


    public createUserWithExistingRoles = (req: CustomRequest, res: CustomResponse) => {

        const [validationError, createUserDto] = CreateUserWithRoleDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);

        this.userService.createUserWithExistingRoles(createUserDto!, req.currentUser)
            .then(result => res.status(201).json({ result }))
            .catch(error => handleError(error, res));
    }

    public updateUserRoles = (req: CustomRequest, res: CustomResponse) => {
        const [validationError, updateUserRolesDto] = UpdateUserRolesDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);

        this.userService.updateUserRoles(updateUserRolesDto!, req.currentUser)
            .then(result => res.status(201).json({ result }))
            .catch(error => handleError(error, res));
    }

    public createUser = (req: CustomRequest, res: CustomResponse) => {

        const [validationError, createUserDto] = CreateUserDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);

        this.userService.createUser(createUserDto!, req.currentUser)
            .then(result => res.status(201).json({ result }))
            .catch(error => handleError(error, res));
    }

    public updateUser = (req: CustomRequest, res: CustomResponse) => {
        const id = +req.params.id;
        const [validationError, updateUserDto] = UpdateUserDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);

        this.userService.updateUser(id, updateUserDto!, req.currentUser)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }

    public deleteUser = (req: CustomRequest, res: CustomResponse) => {
        const id = +req.params.id;
        this.userService.deleteUser(id, req.currentUser)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }




}