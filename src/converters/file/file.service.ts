import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  public loadFileContent(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      throw new FileCorruptError();
    }

    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  }

  public removeFile(filePath: string): void {
    return fs.unlinkSync(filePath);
  }
}

export class FileCorruptError extends Error {
  constructor(message?: string) {
    super(message || 'Unable to convert file. File may be corrupt.');
  }
}
