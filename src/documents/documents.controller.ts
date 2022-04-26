import * as fs from 'fs';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { Express, Response } from 'express';
import { ConvertDocumentDto } from './dto/convert-document.dto';
import { ConvertTextDocumentDto } from './dto/convert-text-document.dto';
import { DocumentsService } from './documents.service';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @ApiBadRequestResponse()
  @HttpCode(200)
  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ transform: true }))
  convertDocument(
    @Body() body: ConvertDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const doc = this.documentsService.convert(file, body);

    res.set({
      'Content-Type': doc.getContentType(),
      'Content-Disposition': `attachment; filename="${doc.getFilename()}"`,
    });

    return doc.toFile();
  }

  @ApiBadRequestResponse()
  @HttpCode(200)
  @Post('convert-text')
  @UsePipes(new ValidationPipe({ transform: true }))
  convertText(@Body() body: ConvertTextDocumentDto): { body: string } {
    const data = this.documentsService.convertText(body);
    return { body: data.toString() };
  }
}
