import { Injectable } from "@angular/core";

@Injectable()
export class LogsService {
    public Logs: any = {
        Status: '',
        Message: '',
        DateTime: ''
    }


    async LogsError(e : any) {

    }
}