import { Module } from '@nestjs/common';
import { ConvertersModule } from '../converters/converters.module';
import { DocumentsController } from './documents.controller';

@Module({
  imports: [ConvertersModule],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
