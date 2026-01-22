import { WinstonModule } from "nest-winston";
import winston from "winston";

export const winstonConfig = WinstonModule.createLogger({
    level: 'info',
    format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
        ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log'}),  
    ]
});