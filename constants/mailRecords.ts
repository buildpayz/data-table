export type Mail = {
    from: string;
    to: string[] | string;
    cc: string[] | string;
    subject: string;
    html: string;
    text: string;
    attachments: {
        filename: string | undefined;
        contentType: string;
        size: number;
        content: string;
    }[]
}

export const projectMapping: Record<string, Mail[]> = {};

export function getProjectMapping() {
    return projectMapping;
}

export function addToProjectMapping(projectId: string, mail: Mail) {
    if (!projectMapping[projectId]) {
        projectMapping[projectId] = [];
    }
    projectMapping[projectId].push(mail);
}