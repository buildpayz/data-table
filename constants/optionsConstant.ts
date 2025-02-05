export enum StatusEnum {
    PENDING = "Pending",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
}

export const STATUS_OPTIONS = Object.values(StatusEnum).map((status) => ({
    label: status,
    value: status,
}));