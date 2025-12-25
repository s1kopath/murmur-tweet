import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./entities/user.entity";
import { Murmur } from "./entities/murmur.entity";
import { Follow } from "./entities/follow.entity";
import { Like } from "./entities/like.entity";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { MurmursModule } from "./murmurs/murmurs.module";
import { FollowsModule } from "./follows/follows.module";
import { LikesModule } from "./likes/likes.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "murmur_db",
      entities: [User, Murmur, Follow, Like],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    MurmursModule,
    FollowsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
