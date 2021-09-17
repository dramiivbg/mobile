import { E_MODULETYPE, E_PROCESSTYPE } from "@var/enums";

/**
 * { processId: "P001", salesType: "Sales Order" }
 * { processId: "P002", salesType: "Return Order" }
 * { processId: "P003", salesType: "Sales Invoice" }
 * { processId: "P004", salesType: "Sales Credit Memo" }
 */
export interface Permission {
    permissionId: string;
    description: string;
    allow: boolean;
} 

export interface Process {
    processId: string;
    description: string;
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