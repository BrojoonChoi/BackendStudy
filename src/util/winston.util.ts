import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

const env = process.env.NODE_ENV;
const logDir = __dirname + '/../../logs'; // log 파일을 관리할 폴더

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 14,
    zippedArchive: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      utilities.format.nestLike('WAIS', {
        prettyPrint: true, // nest에서 제공하는 옵션. 로그 가독성을 높여줌
      }),
    ),
  };
};

// rfc5424를 따르는 winston만의 log level
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const winstonLogger = WinstonModule.createLogger({
  // export const winstonLoggerCreat =
  // export const winstonLogger = {
  transports: [
    new winston.transports.Console({
      level: env === 'prod' ? 'http' : 'silly',
      // level: 'http',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('WAIS', {
          prettyPrint: true, // nest에서 제공하는 옵션. 로그 가독성을 높여줌
        }),
      ),
    }),

    // info, warn, error 로그는 파일로 관리
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
    new winstonDaily(dailyOptions('debug')),
  ],
});
