import { Request, Response } from "express";
import { RoleService } from "../../../domain/services";
import { handleError } from "../../../domain/helpers";
import { CreateRoleDto, UpdateRoleDto } from "../../../domain/dtos/role";

export class RoleController {

    constructor(private readonly roleService: RoleService) { }

    public getRoles = (req: Request, res: Response) => {
        this.roleService.getRoles()
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }

    public createRole = (req: Request, res: Response) => {
        const [validationError, createRoleDto] = CreateRoleDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);
        this.roleService.createRole(createRoleDto!, req.body.currentUser)
            .then(result => res.status(201).json({ result }))
            .catch(error => handleError(error, res));
    }

    public updateRole = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [validationError, updateRoleDto] = UpdateRoleDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);
        this.roleService.updateRole(id, updateRoleDto!, req.body.currentUser)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }

    public deleteRole = (req: Request, res: Response) => {
        const id = +req.params.id;
        this.roleService.deleteRole(id, req.body.currentUser)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res))
    }

}