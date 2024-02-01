import { Request, Response } from "express";
import { UserService } from "../../../domain/services";
import { PaginationDto } from "../../../domain/dtos/shared";
import { handleError } from "../../../domain/helpers";
import { CreateUserDto, UpdateUserDto } from "../../../domain/dtos/user";

export class UserController {


    constructor(private readonly userService: UserService) { }


    public getUsers = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.mapFrom(+page, +limit);
        if (error) return res.status(400).json(error);

        this.userService.getUsers(paginationDto!)
            .then(paginationResult => res.status(201).json(paginationResult))
            .catch(error => handleError(error, res));
    }

    public createUser = (req: Request, res: Response) => {

        const [validationError, createUserDto] = CreateUserDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);

        this.userService.createUser(createUserDto!, req.body.currentUser)
            .then(result => res.status(201).json({ result }))
            .catch(error => handleError(error, res));
    }

    public updateUser = (req: Request, res: Response) => {
        const id =  +req.params.id;
        const [validationError, updateUserDto] = UpdateUserDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);

        this.userService.updateUser(id, updateUserDto!, req.body.currentUser)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }

    public deleteUser = (req: Request, res: Response) => {
        const id = +req.params.id;
        this.userService.deleteUser(id, req.body.currentUser)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }




}