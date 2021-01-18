import mongoose, { Model, Schema, Document } from 'mongoose';
import { uuid as uuidv4 } from 'uuidv4';

const validateEmail = function (email: string) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const userSchema: Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ''),
        },
        name: String,
        password: String,
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            validate: {
                validator: validateEmail,
                message: 'Пожалуйста, введите корректный Email',
            },
            required: [true, 'Поле Email обязательное'],
        },
    },
    {
        timestamps: true,
        collection: 'users',
    }
);

userSchema.statics.createUser = async function ({
    name,
    email,
    password,
}: {
    name: string;
    email: string;
    password: string;
}) {
    try {
        const user = await this.create({ name, email, password });
        return user;
    } catch (error) {
        throw error;
    }
};

userSchema.statics.getUserById = async function (id: string) {
    try {
        const user = await this.findOne({ _id: id });
        if (!user) {
            throw { error: 'Пользователь с таким id не найден' };
        }
        return user;
    } catch (error) {
        throw error;
    }
};

userSchema.statics.getUserByEmail = async function (email: string): Promise<IUserDocument | null> {
    try {
        const user = await this.findOne({ email: email });
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        throw error;
    }
};

userSchema.statics.deleteByUserById = async function (id: string) {
    try {
        const result = await this.remove({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
};

export interface IUserDocument extends Document {
    _id: string;
    name: string;
    password: string;
    email: string;
}

export interface IUserModel extends Model<IUserDocument> {
    findByName(name: string): Promise<Array<IUserDocument>>;
    createUser({
        name,
        email,
        password,
    }: {
        name: string;
        email: string;
        password: string;
    }): Promise<IUserDocument>;
    getUserById(id: string): Promise<IUserDocument>;
    getUserByEmail(email: string): Promise<IUserDocument>;
    deleteByUserById(id: string): Promise<void | Error>;
}

export const UserModel: IUserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
