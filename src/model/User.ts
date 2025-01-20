import mongoose, { Schema, Document } from "mongoose";
// document is for the typesafety

export interface Message extends Document {
    content: string;
    createdAt: Date;
    
}

// mongoose syntax has S capital and typescript has s lowercase

// <> is a generic type used for type safety
const messageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required : true, default: Date.now },
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifycode: string;
    verifycodeexpiry: Date;
    isacceptingmssg: boolean;
    isverified: boolean;
    messages: Message[];
    createdAt: Date;
    
}

const userSchema: Schema<User> = new Schema({
    username: { type: String, required: [true, "Username is required"],trim: true, unique: true },
    email: { type: String, required:[true, "Email is required"], unique: true ,match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Email is not valid"]},
    password: { type: String, required: [true, "Password is required"] },
    verifycode: { type: String,required:[true, "Verification code is required"] },
    verifycodeexpiry: { type: Date, required : [true, "Verification code expiry is required"], default: Date.now },
    isacceptingmssg: { type: Boolean, default: true },
    isverified: { type: Boolean, default: false },
    messages: [messageSchema],  
    createdAt: { type: Date, required : true, default: Date.now },
});

// as nextjs is edge time framework and not know wether model is exported or not previously so we conditionally export it

//here we use the mongoose.models<> for the type safety 
const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel; 