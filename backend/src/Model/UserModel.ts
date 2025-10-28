import AutoIncrementFactory from 'mongoose-sequence';
import { Connection, Document as MongooseDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

export interface UserDocument extends MongooseDocument {
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  validatePassword(password: string): Promise<boolean>;
}

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

// Pre-save hook untuk hash password sebelum disimpan
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method untuk validasi password
if (!UserSchema.methods.validatePassword) {
  UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  };
}

export const applyAutoIncrement = (connection: Connection) => {
  const AutoIncrement = AutoIncrementFactory(connection as any) as any;
  UserSchema.plugin(AutoIncrement, { inc_field: 'id' });
};
