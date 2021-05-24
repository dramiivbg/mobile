import { E_MODULETYPE, E_PROCESSTYPE } from "@var/enums";

export interface Permission {
    permissionId: string;
    description: string;
    allow: boolean;
} 

export interface Process {
    processId: string;
    processName: string;
    permissions: Array<Permission>;
    salesType?: string;
    sysPermits?: Array<E_PROCESSTYPE>
}

export interface Module {
    subscriptionId: string;
    moduleId: string;
    description: string;
    moduleType: E_MODULETYPE;
    userType: number;
    erpUserId: string;
    active: true;
    processes: Array<Process>;
}