type Status = "success" | "failure" | "error";

export default class JSONResponse{
    status: Status;
    message?: String;
    data: any;

    constructor(status: Status, data: any, message?: String,){
        this.status = status;
        this.message = message;
        this.data = data
    }

    static success(data: any) {
        return new JSONResponse('success', data);
    }

    static failure(data: any){
        return new JSONResponse('failure', data);
    }

    static error(message?: string){
        return new JSONResponse('error', undefined, message);
    }
}