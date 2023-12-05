import { Injectable } from "@nestjs/common";
import { db, migrate } from "db";

@Injectable()
export class DatabaseService {
  db: ReturnType<typeof db>["db"];

  constructor() {
    this.db = db(process.env.BACKEND_DATABASE_CONNECTION).db;
    void migrate(this.db);
  }
}
