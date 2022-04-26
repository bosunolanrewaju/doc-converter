import { Test, TestingModule } from '@nestjs/testing';
import { ConvertersModule } from '../converters/converters.module';
import { DocumentsController } from './documents.controller';

describe('DocumentsController', () => {
  let controller: DocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      imports: [ConvertersModule],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
