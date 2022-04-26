import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { ConverterService } from '../converters/converter/converter.service';
import { ConvertDocumentDto } from './dto/convert-document.dto';
import { ConvertTextDocumentDto } from './dto/convert-text-document.dto';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private converterService: ConverterService) {}

  @ApiBadRequestResponse()
  @HttpCode(200)
  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ transform: true }))
  convertDocument(
    @Body() body: ConvertDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): { body: string } {
    const data = this.converterService
      .loadFile(file?.path)
      .loadFileContent(file.buffer.toString())
      .setStringOptions({
        elementDelimiter: body.elementDelimiter,
        lineDelimiter: body.lineDelimiter,
      })
      .convert(body.from, body.to);

    return { body: data };
  }

  @ApiBadRequestResponse()
  @HttpCode(200)
  @Post('convert-text')
  @UsePipes(new ValidationPipe({ transform: true }))
  convertText(@Body() body: ConvertTextDocumentDto): { body: string } {
    const data = this.converterService
      .loadFileContent(body.text)
      .setStringOptions({
        elementDelimiter: body.elementDelimiter,
        lineDelimiter: body.lineDelimiter,
      })
      .convert(body.from, body.to);

    return { body: data };
  }
}
