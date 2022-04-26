import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import {
  IConvertibleFormat,
  IStringConverterOptions,
} from '../interfaces/converters.interface';
import { JsonService } from '../json/json.service';
import { StringService } from '../string/string.service';
import { XmlService } from '../xml/xml.service';

@Injectable()
export class ConverterService {
  private fileContent: string;
  private stringOptions: IStringConverterOptions;

  constructor(
    private jsonService: JsonService,
    private stringService: StringService,
    private fileService: FileService,
    private xmlService: XmlService,
  ) {}

  public loadFile(filePath: string) {
    if (filePath) {
      this.fileContent = this.fileService.loadFileContent(filePath);
    }
    return this;
  }

  public loadFileContent(fileContent: string) {
    if (fileContent && !this.fileContent) {
      this.fileContent = fileContent;
    }

    return this;
  }

  public setStringOptions(stringConversionOptions: IStringConverterOptions) {
    this.stringOptions = stringConversionOptions;
    return this;
  }

  public convert(fromFormat: IConvertibleFormat, toFormat: IConvertibleFormat) {
    const contentObject = this.convertToObject(fromFormat);

    return this.convertFromObject(contentObject, toFormat);
  }

  private convertToObject(fromFormat: IConvertibleFormat) {
    const fileContent = this.fileContent;
    if (!fileContent) {
      return {};
    }

    const docService = this.getServiceFor(fromFormat);
    try {
      return docService.convertToObject(fileContent, this.stringOptions);
    } catch (error) {
      throw new ConverterFailureError(error.message);
    }
  }

  private convertFromObject(contentObject: object, toFormat) {
    const docService = this.getServiceFor(toFormat);
    try {
      return docService.convertFromObject(contentObject, this.stringOptions);
    } catch (error) {
      throw new ConverterFailureError(error.message);
    }
  }

  private getServiceFor(format: IConvertibleFormat) {
    switch (format) {
      case 'json':
        return this.jsonService;
      case 'string':
        return this.stringService;
      case 'xml':
        return this.xmlService;

      default:
        throw new ServiceNotFoundError();
        break;
    }
  }
}

export class ConverterFailureError extends Error {
  constructor(message?: string) {
    super(`File conversion failed: ${message}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ServiceNotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'The service type requested for does not exist.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
