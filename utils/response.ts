type Status = "success" | "failure" | "error";

export default class JSONResponse{
    status: Status;
    statusCode: number;
    message?: String;
    data: any;
    metaData?: any;

    constructor(status: Status, statusCode: number, data: any, message?: String, metaData?: any){
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.metaData = metaData;
    }

    static success(data?: any) {
        return new JSONResponse('success', 200, data);
    }

    static failure(metaData?: any, message?: String, statusCode: number = 400){
        return new JSONResponse('failure', statusCode, undefined, message, metaData);
    }

    static error(message?: string){
        return new JSONResponse('error', 500, undefined, message);
    }
}