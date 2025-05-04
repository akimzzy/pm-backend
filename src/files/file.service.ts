import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class FileService {
  getFilePath(filename: string): string {
    return join(__dirname, '../../../uploads', filename);
  }

  deleteFile(filename: string): boolean {
    const filePath = this.getFilePath(filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      return true;
    }
    return false;
  }
}
