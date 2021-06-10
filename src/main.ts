import { NestFactory } from "@nestjs/core";
import { locale } from "moment";
import { ConfigService } from "nestjs-config";
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

// Sets moment locale to Spanish globally
locale("es");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Middlewares
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["self"],
      },
    }),
  );
  app.use(compression());

  app.use(bodyParser.json({ limit: "500mb" }));

  app.enableCors();

  const options = new DocumentBuilder().setTitle("Lombax API").setVersion("1.0").addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("*explorer", app, document);

  const configService: ConfigService = app.get(ConfigService);

  await app.listen(configService.get("application.port"));
}
bootstrap();
