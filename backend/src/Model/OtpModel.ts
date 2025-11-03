import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiresAt: Date;
  
  @Prop({ required: true })
  userData: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Index untuk auto-delete expired tokens
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
