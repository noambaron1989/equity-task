import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor(config: ConfigService){
        super({
            datasources: {
                db: {
                    url: config.get<string>('DATABASE_URL')
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }

    async cleanEquityGrantTable() {
        if (process.env.NODE_ENV === 'production') return;
      
        const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
      
        const deletePromises = models.map((modelKey) => {
          if (modelKey === 'equityGrant') {
            // Only delete records from the 'equityGrant' table
            return this[modelKey].deleteMany({});
          }
          return Promise.resolve(); // Do nothing for other tables
        });
      
        return Promise.all(deletePromises);
    }

    async cleanAllTables() {
        if (process.env.NODE_ENV === 'production') return;

        // Delete child table records first
        await this.equityGrant.deleteMany({});
    
        // Then delete parent table records
        await this.employee.deleteMany({});
        await this.company.deleteMany({});
    }
}