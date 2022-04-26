import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ConvertDocumentDto } from './convert-document.dto';

export class ConvertTextDocumentDto extends ConvertDocumentDto {
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}
