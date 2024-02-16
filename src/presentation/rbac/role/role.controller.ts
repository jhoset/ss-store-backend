import { RoleService } from "../../../domain/services";
import { handleError } from "../../../domain/helpers";
import { CreateRoleDto, CreateRoleWithPermissionsDto, UpdateRoleDto, UpdateRoleWithPermissionsDto } from "../../../domain/dtos/role";
import { CustomRequest, CustomResponse } from "../../interfaces";

export class RoleController {

    constructor(private readonly roleService: RoleService) { }

    public getRolesWithPermissions = (req: CustomRequest, res: CustomResponse) => {
        this.roleService.getRolesWithPermissions()
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }

    public createRoleWithPermissions = (req: CustomRequest, res: CustomResponse) => {
        const [validationError, createRoleWithPermissionsDto] = CreateRoleWithPermissionsDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);
        this.roleService.createRoleWithPermissions(createRoleWithPermissionsDto!, req.currentUser)
            .then(result => res.status(201).json(result))
            .catch(error => handleError(error, res));
    }

    public updateRoleWithPermissions = (req: CustomRequest, res: CustomResponse) => {
        const [validationError, updateRoleWithPermissionDto] = UpdateRoleWithPermissionsDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);
        this.roleService.updateRoleWithPermissions(updateRoleWithPermissionDto!, req.currentUser)
            .then(result => res.status(200).json(result))
            .catch(error => handleError(error, res))
    }

    public getRoles = (req: CustomRequest, res: CustomResponse) => {
        this.roleService.getRoles()
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }

    public createRole = (req: CustomRequest, res: CustomResponse) => {
        const [validationError, createRoleDto] = CreateRoleDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);
        this.roleService.createRole(createRoleDto!, req.currentUser)
            .then(result => res.status(201).json({ result }))
            .catch(error => handleError(error, res));
    }

    public updateRole = (req: CustomRequest, res: CustomResponse) => {
        const id = +req.params.id;
        const [validationError, updateRoleDto] = UpdateRoleDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);
        this.roleService.updateRole(id, updateRoleDto!, req.currentUser)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }

    public deleteRole = (req: CustomRequest, res: CustomResponse) => {
        const id = +req.params.id;
        this.roleService.deleteRole(id, req.currentUser)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res))
    }

}