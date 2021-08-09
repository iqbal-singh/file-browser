import * as express from 'express';
import cors = require('cors');
import faker = require('faker');
import { Directory } from '@file-browser/api-interfaces';

const app = express();
app.use(cors());

const createFiles = (n: number) => {
  const files: Directory[] = [];
  for (let i = 0; i < n; i++) {
    files.push({
      name: faker.system.commonFileName(),
      sizeKb: faker.datatype.number(),
      type: 'file',
    });
  }
  return files;
};

const createDirs = (n: number) => {
  const dirs: Directory[] = [];
  for (let i = 0; i < n; i++) {
    dirs.push({
      name: faker.lorem.word(10),
      sizeKb: 0,
      type: 'dir',
      items: createFiles(faker.datatype.number(200)),
    });
  }
  return dirs;
};

const mock: Directory = {
  name: 'home',
  sizeKb: 0,
  type: 'dir',
  items: [
    {
      name: 'lib',
      sizeKb: 0,
      type: 'dir',
      items: [
        ...createFiles(faker.datatype.number(10)),
        ...createDirs(faker.datatype.number(5)),
        {
          name: 'teleport.go',
          sizeKb: 320,
          type: 'file',
        },
        {
          name: 'te',
          sizeKb: 0,
          type: 'dir',
          items: [
            {
              name: 'testpoo',
              sizeKb: 10,
              type: 'dir',
              items: [
                {
                  name: 'test2.js',
                  sizeKb: 1033,
                  type: 'file',
                },
                {
                  name: 'test33.js',
                  sizeKb: 130,
                  type: 'file',
                },
                {
                  name: 'test333.js',
                  sizeKb: 130,
                  type: 'file',
                },
                {
                  name: 'test4433.js',
                  sizeKb: 1220,
                  type: 'file',
                },
                {
                  name: 'f3',
                  sizeKb: 0,
                  type: 'dir',
                  items: [],
                },
              ],
            },
          ],
        },

        {
          name: 'teleport.json',
          sizeKb: 1011111111,
          type: 'file',
        },
        {
          name: 'test.go',
          sizeKb: 3320,
          type: 'file',
        },
      ],
    },
    ...createDirs(10),
    {
      name: 'README.md',
      sizeKb: 4340,
      type: 'file',
    },
    {
      name: '11lenl1el21kenl12enl1ken12len1l2enl12eknl1e.png',
      sizeKb: 320,
      type: 'file',
    },
    ...createFiles(30),
  ],
};

app.get('/api/files', (req, res) => {
  res.send(mock);
});

app.get('/api/file/preview', (req, res) => {
  res.send({ a: 'a' });
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
server.on('error', console.error);
