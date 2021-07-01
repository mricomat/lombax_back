import { v4, v5 } from 'uuid';
import { DeepPartial, Repository } from 'typeorm';
import { Readable } from "stream";
import { GetObjectRequest, ManagedUpload } from "aws-sdk/clients/s3";
import { AWSError, S3 } from "aws-sdk";
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { ReadableFileInterface } from "./interfaces/readable-file.interface";
import { FilesModuleConfigInterface } from "./interfaces/files-module-config.interface";
import { FileToUploadInterface } from "./interfaces/file-to-upload.interface";
import { FileEntity } from './file.entity';
import { S3_BASE_URL } from './constants/s3-base-url.constants';
import { FILES_CONFIG } from './constants/files-module.constants';

@Injectable()
export class FilesService {
  private readonly s3Client: S3;
  private readonly bucket: string;

  constructor(
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
    @Inject(FILES_CONFIG) private readonly s3Config: FilesModuleConfigInterface,
  ) {
    const { accessKeyId, region, secretAccessKey, bucket } = this.s3Config;

    this.s3Client = new S3({
      accessKeyId,
      secretAccessKey,
      region,
    });

    this.bucket = bucket;
  }

  deleteFile(file: FileEntity, repository: Repository<FileEntity> = this.fileRepository): Promise<FileEntity> {
    return repository.save({ ...file, isDeleted: true });
  }

  async uploadFiles(files: FileToUploadInterface[], repository: Repository<FileEntity> = this.fileRepository): Promise<FileEntity[]> {
    const filesEntities: DeepPartial<FileEntity>[] = [];

    const uploadPromises: Promise<ManagedUpload.SendData>[] = [];

    for (const file of files) {
      const { name, folder, content } = file;

      const fileExtension = this.getFileExtension(content);
      const fileFullPath = this.generateFilePath(name, folder, fileExtension);
      const mimetype = this.getMimetypeFromBase64(content);
      const { fileStream, bufferSize } = this.convertBase64FileToReadableStream(content);

      const params: S3.PutObjectRequest = {
        Bucket: this.bucket,
        Body: fileStream,
        Key: fileFullPath,
        ContentType: mimetype,
        ACL: "public-read",
        ContentLength: bufferSize,
      };

      const uploadPromise = this.s3Client.upload(params).promise();
      uploadPromises.push(uploadPromise);

      const fileEntity: DeepPartial<FileEntity> = {
        name,
        path: fileFullPath,
        url: this.buildFileUrl(fileFullPath),
        mimetype,
      };

      filesEntities.push(fileEntity);
    }

    await Promise.all(uploadPromises);

    return repository.save(filesEntities);
  }

  private sanitizeFolder(folder: string): string {
    const lastCharacterPosition = folder.length - 1;
    const lastCharacter = folder[lastCharacterPosition];

    if (lastCharacter === "/") {
      return folder.substring(0, lastCharacterPosition);
    }

    return folder;
  }

  private convertBase64FileToReadableStream(content: string): ReadableFileInterface {
    const sanitizedFile = content.replace(/^data:([a-zA-Z0-9]*)\/\w+;base64,/, "");
    const contentBuffer = Buffer.from(sanitizedFile, "base64");
    const bufferSize = contentBuffer.length;

    const fileStream = new Readable();

    fileStream._read = () => {};

    fileStream.push(contentBuffer);
    fileStream.push(null);

    return {
      fileStream,
      bufferSize,
    };
  }

  private getMimetypeFromBase64(file: string): string {
    const mimetype = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/.exec(file);

    return mimetype[1];
  }

  private getFileExtension(file: string): string {
    const mimetype = this.getMimetypeFromBase64(file);

    return mimetype.split("/")[1];
  }

  private generateFilePath(name: string, folder: string, extension: string): string {
    const fileUniqueName = v5(name, v4());
    const sanitizedFolder = this.sanitizeFolder(folder);

    return `${sanitizedFolder}/${fileUniqueName}.${extension}`;
  }

  private buildFileUrl(filePath: string) {
    return `https://${this.bucket}.s3-${this.s3Config.region}.${S3_BASE_URL}/${filePath}`;
  }
}
