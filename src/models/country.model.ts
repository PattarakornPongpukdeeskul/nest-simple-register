import { prop } from '@typegoose/typegoose';

export class Country {
  @prop({ required: true })
  name: string;
}
