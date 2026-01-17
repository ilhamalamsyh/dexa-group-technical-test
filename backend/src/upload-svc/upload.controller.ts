import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UploadService } from './upload.service';

interface SerializedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @MessagePattern({ cmd: 'upload_file' })
  async uploadFile(fileData: SerializedFile) {
    return this.uploadService.uploadFile(fileData);
  }
}
