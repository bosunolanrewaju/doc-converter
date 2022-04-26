import { Injectable } from '@nestjs/common';
import {
  IConverterService,
  IStringConverterOptions,
} from '../interfaces/converters.interface';

@Injectable()
export class StringService implements IConverterService {
  public convertToObject(
    fileContent: string,
    options: IStringConverterOptions,
  ): object {
    return this.convertFromString(fileContent, options);
  }

  public convertFromObject(
    contentObject: object,
    options: IStringConverterOptions,
  ) {
    return this.convertToString(contentObject, options);
  }

  private convertToString(
    contentObject: object,
    options: IStringConverterOptions,
  ) {
    const delim = options.elementDelimiter;

    const allLines = Object.entries(contentObject).reduce(
      (acc, [segment, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            acc.push([segment, ...Object.values(v)].join(delim));
          });
        } else {
          acc.push([segment, ...Object.values(value)].join(delim));
        }

        return acc;
      },
      [],
    );

    const str = allLines.join(options.lineDelimiter);

    return `${str}${options.lineDelimiter}`;
  }

  private convertFromString(
    fileContent: string,
    options: IStringConverterOptions,
  ) {
    const lines = fileContent.split(options.lineDelimiter);
    const contentAsObject = lines.reduce((acc: any, line: string) => {
      const [key, ...values] = line
        .replace(/\n/, '')
        .split(options.elementDelimiter);
      if (key) {
        const objValues = values?.reduce?.(
          (valueAcc, value: string, index: number) => {
            const label = `${key}${index + 1}`;
            valueAcc[label] = value;
            return valueAcc;
          },
          {},
        );

        if (Array.isArray(acc[key])) {
          acc[key].push(objValues);
        } else if (acc[key]) {
          acc[key] = [acc[key], objValues];
        } else {
          acc[key] = objValues;
        }
      }

      return acc;
    }, {});

    return contentAsObject;
  }
}
