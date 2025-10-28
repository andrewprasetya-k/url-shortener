import * as AutoIncrementFactory from 'mongoose-sequence';
import { Connection } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import * as bycrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;
  
  @Prop()
  password: string;
  
  @Prop()
  email: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

if (!UserSchema.methods.validatePassword) {
  UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return bycrypt.compare(password, this.password);
  };
}

export const applyAutoIncrement = (connection: Connection) => {
  const AutoIncrement = AutoIncrementFactory(connection);
  UserSchema.plugin(AutoIncrement, { inc_field: 'id' });
};
