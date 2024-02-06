import { AuthService } from "../../domain/services";
import { CreateUserDto } from "../../domain/dtos/user";
import { handleError } from "../../domain/helpers";
import { LoginUserDto } from "../../domain/dtos/auth";
import { CustomRequest, CustomResponse } from "../interfaces";


export class AuthController {

    constructor(private readonly authService: AuthService) { }

    public registerUser = (req: CustomRequest, res: CustomResponse) => {
        const [validationError, createUserDto] = CreateUserDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);

        this.authService.registerUser(createUserDto!)
            .then(result => res.status(201).json({ result }))
            .catch(error => handleError(error, res));
    }

    public loginUser = (req: CustomRequest, res: CustomResponse) => {
        const [validationError, loginUserDto] = LoginUserDto.mapFrom(req.body);
        if (validationError) return res.status(400).json(validationError);

        this.authService.loginUser(loginUserDto!)
            .then(result => res.status(201).json({ result }))
            .catch(error => handleError(error, res));
    }
}