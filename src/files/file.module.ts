import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { FilesModuleConfigAsyncOptionsInterface, FilesModuleConfigInterface } from './interfaces/files-module-config.interface';
import { FilesService } from './files.service';
import { FileEntity } from './file.entity';
import { FILES_CONFIG } from './constants/files-module.constants';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {
  static registerAsync(options: FilesModuleConfigAsyncOptionsInterface): DynamicModule {
    const optionsProvider: Provider<FilesModuleConfigInterface | Promise<FilesModuleConfigInterface>> = {
      provide: FILES_CONFIG,
      inject: options.inject,
      useFactory: options.useFactory,
    };

    return {
      module: FilesModule,
      imports: options.imports,
      providers: [optionsProvider],
    };
  }
}
