import { SystemChgType } from "../../config/constants";

export class BaseDto {

    constructor(
        private changedBy?: string,
        private changeType?: SystemChgType,
        private createdAt?: Date,
        private updatedAt?: Date,
        private isDeleted?: boolean
    ) {

    }

    public setChangeBy(userName: string) {
        this.changedBy = userName;
    }
    
    public setChangeByAndChangeType(userName: string, changeType: SystemChgType) {
        this.changedBy = userName;
        this.changeType = changeType;
    }


}