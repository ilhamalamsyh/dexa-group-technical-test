import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

interface SerializedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(fileData: SerializedFile) {
    if (!fileData || !fileData.buffer) {
      throw new BadRequestException('No file provided');
    }

    try {
      const buffer = Buffer.isBuffer(fileData.buffer)
        ? fileData.buffer
        : Buffer.from(fileData.buffer);

      const result = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'attendance_photos' },
            (error, uploadResult) => {
              if (error) {
                reject(new Error(error.message || 'Upload failed'));
              } else if (uploadResult) {
                resolve({
                  secure_url: uploadResult.secure_url,
                  public_id: uploadResult.public_id,
                });
              } else {
                reject(new Error('Upload result is undefined'));
              }
            },
          )
          .end(buffer);
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'File upload failed';
      throw new BadRequestException(errorMessage);
    }
  }
}
