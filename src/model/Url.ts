import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  id: number;

  @Prop()
  shortenedUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
