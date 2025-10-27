import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema()
export class Url {
  @Prop()
  shortenedUrl: string;
  
  @Prop()
  originalUrl: string;

  @Prop({default:0})
  timesClicked: number;
  
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
