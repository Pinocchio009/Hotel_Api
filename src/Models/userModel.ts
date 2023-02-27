import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    role: 'guest' | 'admin';
    accessToken?: string;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ["guest", "admin"],
        default: "guest"
    },
    accessToken: {
        type: String
    }
}, {timestamps: true});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
