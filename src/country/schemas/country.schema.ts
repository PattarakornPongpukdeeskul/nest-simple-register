import * as mongoose from 'mongoose';

export const CountrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
  { timestamps: true },
);

export interface Country extends mongoose.Document {
  name: string;
  code: string;
}
