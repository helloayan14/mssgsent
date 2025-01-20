import { Message } from "@/model/User";
export interface ApiResponse {
    success: boolean;
    message: string;
    isacceptingmssg?: boolean;
    messages?:Array<Message>;
    

}