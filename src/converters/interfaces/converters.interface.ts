export type IConvertibleFormat = 'string' | 'json' | 'xml';

export interface IStringConverterOptions {
  elementDelimiter: string;
  lineDelimiter: string;
}

export interface IConverterService {
  convertToObject(
    fileContent: string,
    options?: IStringConverterOptions,
  ): object;
  convertFromObject(
    contentObject: object,
    options: IStringConverterOptions,
  ): string;
}
