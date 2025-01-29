import { Message } from "@/model/User";
export interface UserReturn {
    id: string;
    username: string;
    email: string;
    verifycode: string;
    verifycodeexpiry: Date;
    isacceptingmssg: boolean;
    isverified: boolean;
    messages: Message[];
    createdAt: Date;
}