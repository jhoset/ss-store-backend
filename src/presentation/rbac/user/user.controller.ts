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
        // TODO: Creation of middleware to manage user Auth
        createUserDto?.initMetaData('admin', 'C');

        this.userService.createUser(createUserDto!)
            .then(result => res.status(201).json({ result }))
            .catch(error => handleError(error, res));
    }

    public updateUser = (req: Request, res: Response) => {
        const id =  +req.params.id;
        if (isNaN(id) || id <= 0) throw res.status(400).json({ error: "Invalid User ID Parameter." })
        const [validationError, updateUserDto] = UpdateUserDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);
        updateUserDto?.initMetaData('admin', 'U');

        this.userService.updateUser(id, updateUserDto!)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }

    public deleteUser = (req: Request, res: Response) => {
        const id = +req.params.id;
        //TODO: Set Delete acction with userName
        if (isNaN(id) || id <= 0) throw res.status(400).json({ error: "Invalid User ID Parameter." })
        this.userService.deleteUser(id)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }




}