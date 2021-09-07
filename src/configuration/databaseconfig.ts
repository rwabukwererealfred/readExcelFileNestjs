import { TypeOrmModule } from "@nestjs/typeorm";

export const dbConfig:TypeOrmModule = {
    
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'fred18404',
      database: 'readfiledb',
      autoLoadEntities :true,
      synchronize: true
    
  };