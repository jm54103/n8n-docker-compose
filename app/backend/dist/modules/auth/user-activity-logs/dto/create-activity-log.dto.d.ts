export declare class CreateActivityLogDto {
    actorId?: string;
    actionType: string;
    targetTable?: string;
    targetId?: string;
    oldValue?: Record<string, any>;
    newValue?: Record<string, any>;
}
