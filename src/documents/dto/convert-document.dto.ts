import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, ValidateIf } from 'class-validator';
import { IConvertibleFormat } from 'src/converters/interfaces/converters.interface';

const ALLOWED_FORMATS: IConvertibleFormat[] = ['json', 'xml', 'string'];

export class ConvertDocumentDto {
  @ApiProperty()
  @IsIn(ALLOWED_FORMATS)
  from: IConvertibleFormat;

  @ApiProperty()
  @IsIn(ALLOWED_FORMATS)
  to: IConvertibleFormat;

  @ApiProperty()
  @ValidateIf((o) => o.from === 'string' || o.to === 'string')
  @IsNotEmpty()
  lineDelimiter?: string;

  @ApiProperty()
  @ValidateIf((o) => o.from === 'string' || o.to === 'string')
  @IsNotEmpty()
  elementDelimiter?: string;
}
