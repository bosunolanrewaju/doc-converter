import { v4 as uuidV4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ConverterService } from '../converters/converter/converter.service';
import { ConvertDocumentDto } from './dto/convert-document.dto';
import { ConvertTextDocumentDto } from './dto/convert-text-document.dto';
import { IConvertibleFormat } from 'src/converters/interfaces/converters.interface';

@Injectable()
export class DocumentsService {
  private documentData: string;
  private ext: IConvertibleFormat;
  private contentTypes: Record<IConvertibleFormat, string> = {
    json: 'application/json',
    xml: 'application/xml',
    string: 'text/plain',
  };

  constructor(private converterService: ConverterService) {}

  convert(file: Express.Multer.File, body: ConvertDocumentDto) {
    this.ext = body.to;
    this.documentData = this.converterService
      .loadFile(file?.path)
      .loadFileContent(file.buffer.toString())
      .setStringOptions({
        elementDelimiter: body.elementDelimiter,
        lineDelimiter: body.lineDelimiter,
      })
      .convert(body.from, body.to);

    return this;
  }

  convertText(body: ConvertTextDocumentDto) {
    this.documentData = this.converterService
      .loadFileContent(body.text)
      .setStringOptions({
        elementDelimiter: body.elementDelimiter,
        lineDelimiter: body.lineDelimiter,
      })
      .convert(body.from, body.to);

    return this;
  }

  toFile() {
    return this.converterService.toFile(this.documentData);
  }

  toString() {
    return this.documentData.toString();
  }

  getFilename() {
    const uuid = uuidV4();
    const ext = this.ext === 'string' ? 'txt' : this.ext;
    return `${uuid}.${ext}`;
  }

  getContentType() {
    return this.contentTypes[this.ext];
  }
}
