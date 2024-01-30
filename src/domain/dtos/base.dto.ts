export class BaseDto {

    constructor(
        private changedBy?: string,
        private changeType?: string,
        private createdAt?: Date,
        private updatedAt?: Date,
        private isDeleted?: boolean
    ) {

    }

    public initMetaData(changeBy: string, changeType: string) {
        this.changedBy = changeBy;
        this.changeType = changeType
    }


}