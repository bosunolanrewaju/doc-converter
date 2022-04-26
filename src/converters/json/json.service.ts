import { Injectable } from '@nestjs/common';
import { IConverterService } from '../interfaces/converters.interface';

@Injectable()
export class JsonService implements IConverterService {
  public convertToObject(fileContent: string): object {
    return JSON.parse(fileContent);
  }

  public convertFromObject(contentObject: object): string {
    return JSON.stringify(contentObject);
  }
}
