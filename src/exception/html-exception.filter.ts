import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HtmlExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    response.send(`
      <html>
        <head>
          <title>Error</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
              height: 100vh;
              margin: 0;
            }
            .error-container {
              text-align: center;
              padding: 20px;
            }
            h2 {
              color: #3080C6;
            }
            p {
              color: #3080C6;
            }
            img {
              width: 120px;
              margin: 5px;
            }
          </style>
        </head>
        <body>
          <div class="error-container">
            <img src="https://github.com/GBSWHS/CI-Signature/raw/main/symbol/symbol-solid.png" alt="경북소프트웨어고등학교 로고">
            <p>${message}</p>
          </div>
        </body>
      </html>
    `);
  }
}
