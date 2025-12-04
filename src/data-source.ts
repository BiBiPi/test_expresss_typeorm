import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mariadb",
    url: process.env.DATABASE_URL ?? "mariadb://root:root@localhost:3306/test_db",
    synchronize: true,
    logging: false,
    entities: [User],
})
