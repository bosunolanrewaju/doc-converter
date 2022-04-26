import * as fs from 'fs';
import * as path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns 400 when line delimiter is not provided for string conversion', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert')
      .attach('file', path.resolve(__dirname, './string-file.txt'))
      .field('from', 'string')
      .field('to', 'json')
      .field('elementDelimiter', '*')
      .expect(400);
  });

  it('returns 400 when element delimiter is not provided for string conversion', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert')
      .attach('file', path.resolve(__dirname, './string-file.txt'))
      .field('from', 'string')
      .field('to', 'json')
      .field('lineDelimiter', '~')
      .expect(400);
  });

  it('returns 400 when conversion format is not support', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert')
      .attach('file', path.resolve(__dirname, './string-file.txt'))
      .field('from', 'pdf')
      .field('to', 'json')
      .expect(400);
  });

  it('returns 400 when conversion format is not support', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert')
      .attach('file', path.resolve(__dirname, './string-file.txt'))
      .field('from', 'xml')
      .field('to', 'pdf')
      .expect(400);
  });

  it('convert document from string to json', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert')
      .set('Content-Type', 'multi-part/form-data')
      .attach('file', path.resolve(__dirname, './string-file.txt'))
      .field('from', 'string')
      .field('to', 'json')
      .field('lineDelimiter', '~')
      .field('elementDelimiter', '*')
      .expect(200)
      .expect({
        body: fs
          .readFileSync(path.resolve(__dirname, './json-file.json'))
          .toString()
          .trim(),
      });
  });

  it('convert document from json to string', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert')
      .attach('file', path.resolve(__dirname, './json-file.json'))
      .field('from', 'json')
      .field('to', 'string')
      .field('lineDelimiter', '~')
      .field('elementDelimiter', '*')
      .expect(200)
      .expect({
        body: fs
          .readFileSync(path.resolve(__dirname, './string-file.txt'))
          .toString()
          .trim(),
      });
  });

  it('converts text from string to json', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert-text')
      .send({
        from: 'string',
        to: 'json',
        lineDelimiter: '~',
        elementDelimiter: '*',
        text: 'ProductID* 4* 8* 15* 16*23~AddressID* 42* 108*3* 14 ~ContactID* 59* 26~',
      })
      .expect(200)
      .expect({
        body: JSON.stringify({
          ProductID: {
            ProductID1: ' 4',
            ProductID2: ' 8',
            ProductID3: ' 15',
            ProductID4: ' 16',
            ProductID5: '23',
          },
          AddressID: {
            AddressID1: ' 42',
            AddressID2: ' 108',
            AddressID3: '3',
            AddressID4: ' 14 ',
          },
          ContactID: { ContactID1: ' 59', ContactID2: ' 26' },
        }),
      });
  });

  it('converts text from json to string', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert-text')
      .send({
        from: 'json',
        to: 'string',
        lineDelimiter: '~',
        elementDelimiter: '*',
        text: JSON.stringify({
          ProductID: {
            ProductID1: ' 4',
            ProductID2: ' 8',
            ProductID3: ' 15',
            ProductID4: ' 16',
            ProductID5: '23',
          },
          AddressID: {
            AddressID1: ' 42',
            AddressID2: ' 108',
            AddressID3: '3',
            AddressID4: ' 14 ',
          },
          ContactID: { ContactID1: ' 59', ContactID2: ' 26' },
        }),
      })
      .expect(200)
      .expect({
        body: 'ProductID* 4* 8* 15* 16*23~AddressID* 42* 108*3* 14 ~ContactID* 59* 26~',
      });
  });

  it('converts text from xml to string', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert-text')
      .send({
        from: 'xml',
        to: 'string',
        lineDelimiter: '~',
        elementDelimiter: '*',
        text: '<?xml version="1.0" encoding="UTF-8"?><root><ProductID><ProductID1> 4</ProductID1><ProductID2> 8</ProductID2><ProductID3> 15</ProductID3><ProductID4> 16</ProductID4><ProductID5>23</ProductID5></ProductID><AddressID><AddressID1> 42</AddressID1><AddressID2> 108</AddressID2><AddressID3>3</AddressID3><AddressID4> 14 </AddressID4></AddressID><ContactID><ContactID1> 59</ContactID1><ContactID2> 26</ContactID2></ContactID></root>',
      })
      .expect(200)
      .expect({
        body: 'ProductID* 4* 8* 15* 16*23~AddressID* 42* 108*3* 14 ~ContactID* 59* 26~',
      });
  });

  it('converts text from string to xml', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert-text')
      .send({
        from: 'string',
        to: 'xml',
        lineDelimiter: '~',
        elementDelimiter: '*',
        text: 'ProductID* 4* 8* 15* 16*23~AddressID* 42* 108*3* 14 ~ContactID* 59* 26~',
      })
      .expect(200)
      .expect({
        body: '<?xml version="1.0" encoding="UTF-8"?><root><ProductID><ProductID1> 4</ProductID1><ProductID2> 8</ProductID2><ProductID3> 15</ProductID3><ProductID4> 16</ProductID4><ProductID5>23</ProductID5></ProductID><AddressID><AddressID1> 42</AddressID1><AddressID2> 108</AddressID2><AddressID3>3</AddressID3><AddressID4> 14 </AddressID4></AddressID><ContactID><ContactID1> 59</ContactID1><ContactID2> 26</ContactID2></ContactID></root>',
      });
  });

  it('converts text from xml to json', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert-text')
      .send({
        from: 'xml',
        to: 'json',
        text: '<?xml version="1.0" encoding="UTF-8"?><root><ProductID><ProductID1> 4</ProductID1><ProductID2> 8</ProductID2><ProductID3> 15</ProductID3><ProductID4> 16</ProductID4><ProductID5>23</ProductID5></ProductID><AddressID><AddressID1> 42</AddressID1><AddressID2> 108</AddressID2><AddressID3>3</AddressID3><AddressID4> 14 </AddressID4></AddressID><ContactID><ContactID1> 59</ContactID1><ContactID2> 26</ContactID2></ContactID></root>',
      })
      .expect(200)
      .expect({
        body: JSON.stringify({
          ProductID: {
            ProductID1: ' 4',
            ProductID2: ' 8',
            ProductID3: ' 15',
            ProductID4: ' 16',
            ProductID5: '23',
          },
          AddressID: {
            AddressID1: ' 42',
            AddressID2: ' 108',
            AddressID3: '3',
            AddressID4: ' 14 ',
          },
          ContactID: { ContactID1: ' 59', ContactID2: ' 26' },
        }),
      });
  });

  it('converts text from json to xml', async () => {
    return request(app.getHttpServer())
      .post('/documents/convert-text')
      .send({
        from: 'json',
        to: 'xml',
        text: JSON.stringify({
          ProductID: {
            ProductID1: ' 4',
            ProductID2: ' 8',
            ProductID3: ' 15',
            ProductID4: ' 16',
            ProductID5: '23',
          },
          AddressID: {
            AddressID1: ' 42',
            AddressID2: ' 108',
            AddressID3: '3',
            AddressID4: ' 14 ',
          },
          ContactID: { ContactID1: ' 59', ContactID2: ' 26' },
        }),
      })
      .expect(200)
      .expect({
        body: '<?xml version="1.0" encoding="UTF-8"?><root><ProductID><ProductID1> 4</ProductID1><ProductID2> 8</ProductID2><ProductID3> 15</ProductID3><ProductID4> 16</ProductID4><ProductID5>23</ProductID5></ProductID><AddressID><AddressID1> 42</AddressID1><AddressID2> 108</AddressID2><AddressID3>3</AddressID3><AddressID4> 14 </AddressID4></AddressID><ContactID><ContactID1> 59</ContactID1><ContactID2> 26</ContactID2></ContactID></root>',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
