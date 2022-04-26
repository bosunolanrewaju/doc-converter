import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/documents.module';
import { ConvertersModule } from './converters/converters.module';

@Module({
  imports: [DocumentsModule, ConvertersModule],
  exports: [],
})
export class AppModule {}
