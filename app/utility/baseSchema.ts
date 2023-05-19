import { Schema } from "mongoose";

export class BaseSchema extends Schema {
  constructor(schema: any) {
    super(
      {
        ...schema,
        isDeleted: {
          type: Boolean,
          default: false,
        },
      },
      {
        timestamps: true,
      }
    );
  }
}
