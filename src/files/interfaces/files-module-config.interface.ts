import { ModuleMetadata } from '@nestjs/common';

import { AwsConfigInterface } from '../../common/interfaces/aws-config.interface';

export type FilesModuleConfigInterface = AwsConfigInterface;

export interface FilesModuleConfigAsyncOptionsInterface extends Pick<ModuleMetadata, 'imports'> {
  inject?: Array<Function>;
  useFactory: (...args: any[]) => Promise<FilesModuleConfigInterface> | FilesModuleConfigInterface;
}
