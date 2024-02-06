import { PermissionService } from "../../../domain/services";
import { handleError } from "../../../domain/helpers";
import { CreatePermissionDto, UpdatePermissionDto } from "../../../domain/dtos/permission";
import { CustomRequest, CustomResponse } from "../../interfaces";

export class PermissionController {

    constructor(
        private readonly permissionService: PermissionService
    ) { }

    public getPermissions = (req: CustomRequest, res: CustomResponse) => {
        this.permissionService.getPermissions()
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }

    public createPermission = (req: CustomRequest, res: CustomResponse) => {
        const [validationError, createPermissionDto] = CreatePermissionDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);
        this.permissionService.createPermission(createPermissionDto!, req.currentUser)
            .then(result => res.status(201).json({ result }))
            .catch(error => handleError(error, res));
    }

    public updatePermission = (req: CustomRequest, res: CustomResponse) => {
        const id = +req.params.id;
        const [validationError, updatePermissionDto] = UpdatePermissionDto.mapFrom(req.body)
        if (validationError) return res.status(400).json(validationError);

        this.permissionService.updatePermission(id, updatePermissionDto!, req.currentUser)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res));
    }

    public deletePermission = (req: CustomRequest, res: CustomResponse) => {
        const id = +req.params.id;
        this.permissionService.deletePermission(id, req.currentUser)
            .then(result => res.status(200).json({ result }))
            .catch(error => handleError(error, res))
    }


}