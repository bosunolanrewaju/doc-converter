import { Module } from '@nestjs/common';
import { JsonService } from './json/json.service';
import { StringService } from './string/string.service';
import { FileService } from './file/file.service';
import { ConverterService } from './converter/converter.service';
import { XmlService } from './xml/xml.service';

@Module({
  providers: [
    JsonService,
    StringService,
    FileService,
    ConverterService,
    XmlService,
  ],
  exports: [ConverterService],
})
export class ConvertersModule {}
