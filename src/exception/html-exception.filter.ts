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
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).send(`
        <html>
          <head>
            <title>Error</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #000000;
                color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .error-container {
                text-align: center;
                padding: 20px;
                border-radius: 10px;
                background-color: #333333;
              }
              h2 {
                color: #ff4444;
              }
            </style>
          </head>
          <body>
            <div class="error-container">
              <h2>Error ${status}</h2>
              <p>${message}</p>
            </div>
          </body>
        </html>
      `);
  }
}
