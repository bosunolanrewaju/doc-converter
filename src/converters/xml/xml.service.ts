import { convert, create } from 'xmlbuilder2';
import { Injectable } from '@nestjs/common';
import { IConverterService } from '../interfaces/converters.interface';

@Injectable()
export class XmlService implements IConverterService {
  convertToObject(fileContent: string): object {
    const obj = convert({ encoding: 'UTF-8' }, fileContent, {
      format: 'object',
    });

    return (obj as any).root;
  }

  convertFromObject(contentObject: object): string {
    const doc = create({ encoding: 'UTF-8' }, { root: contentObject });
    const xml = doc.end();

    return xml;
  }
}
