import faker = require('faker');

import { Directory } from '@file-browser/api-interfaces';
import {
  findSubDirectory,
  formatKbFileSize,
  getFileExtension,
  truncateFileName,
} from './utils';

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
      name: faker.commerce.color(),
      sizeKb: 0,
      type: 'dir',
      items: createFiles(faker.datatype.number(20)),
    });
  }
  return dirs;
};

const mockDirectory: Directory = {
  name: 'home',
  sizeKb: 0,
  type: 'dir',
  items: [
    {
      name: 'lib',
      sizeKb: 0,
      type: 'dir',
      items: [
        ...createFiles(faker.datatype.number(5)),
        ...createDirs(faker.datatype.number(5)),
        {
          name: 'main.go',
          sizeKb: 320,
          type: 'file',
        },
        {
          name: 'app',
          sizeKb: 0,
          type: 'dir',
          items: [
            {
              name: 'src',
              sizeKb: 10,
              type: 'dir',
              items: [
                {
                  name: 'test2.css',
                  sizeKb: 1033,
                  type: 'file',
                },
                {
                  name: 'test33.js',
                  sizeKb: 130,
                  type: 'file',
                },
                {
                  name: 'test333.html',
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
      name: 'App.js',
      sizeKb: 320,
      type: 'file',
    },
    ...createFiles(10),
  ],
};

const mockGitHubTree: any[] = [
  {
    path: '.gitignore',
    mode: '100644',
    type: 'blob',
    sha: 'c947773500b8d37e961cf9949b23a1630b563894',
    size: 507,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/c947773500b8d37e961cf9949b23a1630b563894',
  },
  {
    path: 'README.md',
    mode: '100644',
    type: 'blob',
    sha: '361df9128f0ba8a49a0f859566f0c6608fdcef51',
    size: 3242,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/361df9128f0ba8a49a0f859566f0c6608fdcef51',
  },
  {
    path: 'amplify',
    mode: '040000',
    type: 'tree',
    sha: '87bedb49cee6a33bd82c512371df13f7f80ec942',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/87bedb49cee6a33bd82c512371df13f7f80ec942',
  },
  {
    path: 'amplify/.config',
    mode: '040000',
    type: 'tree',
    sha: 'd71a548dd6104588aadb3480c3939227f83f8d3c',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/d71a548dd6104588aadb3480c3939227f83f8d3c',
  },
  {
    path: 'amplify/.config/project-config.json',
    mode: '100644',
    type: 'blob',
    sha: '7b3e3da035c4ab23d9cd202deaab67953f462ded',
    size: 412,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/7b3e3da035c4ab23d9cd202deaab67953f462ded',
  },
  {
    path: 'amplify/backend',
    mode: '040000',
    type: 'tree',
    sha: '91315661303dbfa7daccbd69ed78b770fb9874bf',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/91315661303dbfa7daccbd69ed78b770fb9874bf',
  },
  {
    path: 'amplify/backend/api',
    mode: '040000',
    type: 'tree',
    sha: '3350988462eccb2b2efe091b1f11cdd1dabbcbad',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/3350988462eccb2b2efe091b1f11cdd1dabbcbad',
  },
  {
    path: 'amplify/backend/api/api',
    mode: '040000',
    type: 'tree',
    sha: '3f97ce47cb809d6801a253f932ac71dde8a2d05a',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/3f97ce47cb809d6801a253f932ac71dde8a2d05a',
  },
  {
    path: 'amplify/backend/api/api/api-cloudformation-template.json',
    mode: '100644',
    type: 'blob',
    sha: '02cfa2cf95f68853dbd5c3b4a8bcdf107981e865',
    size: 12764,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/02cfa2cf95f68853dbd5c3b4a8bcdf107981e865',
  },
  {
    path: 'amplify/backend/api/api/api-params.json',
    mode: '100644',
    type: 'blob',
    sha: '594f751215209ad6b49fb7fc8f30112168f3dd1b',
    size: 759,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/594f751215209ad6b49fb7fc8f30112168f3dd1b',
  },
  {
    path: 'amplify/backend/api/api/parameters.json',
    mode: '100644',
    type: 'blob',
    sha: 'f88dfa272ae5b41055accce6d35585d5f9300718',
    size: 124,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/f88dfa272ae5b41055accce6d35585d5f9300718',
  },
  {
    path: 'amplify/backend/auth',
    mode: '040000',
    type: 'tree',
    sha: '4f608a6a7c6e082df711ae80512a47b89ad88a4d',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/4f608a6a7c6e082df711ae80512a47b89ad88a4d',
  },
  {
    path: 'amplify/backend/auth/cognito1896bdfc',
    mode: '040000',
    type: 'tree',
    sha: '2919ec12f6321039692bd18cf374b453619f84b8',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/2919ec12f6321039692bd18cf374b453619f84b8',
  },
  {
    path: 'amplify/backend/auth/cognito1896bdfc/cognito1896bdfc-cloudformation-template.yml',
    mode: '100644',
    type: 'blob',
    sha: '31c5f143da756071f7e497a782e2a8551fc61a87',
    size: 11524,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/31c5f143da756071f7e497a782e2a8551fc61a87',
  },
  {
    path: 'amplify/backend/auth/cognito1896bdfc/parameters.json',
    mode: '100644',
    type: 'blob',
    sha: '6e7d52d565fb4e551f57502d347f6f88dbb71d10',
    size: 2645,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/6e7d52d565fb4e551f57502d347f6f88dbb71d10',
  },
  {
    path: 'amplify/backend/backend-config.json',
    mode: '100644',
    type: 'blob',
    sha: '38bf5bf380db0fda6f4d345c3c814190e18a5b56',
    size: 976,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/38bf5bf380db0fda6f4d345c3c814190e18a5b56',
  },
  {
    path: 'amplify/backend/function',
    mode: '040000',
    type: 'tree',
    sha: '1b07e99e47c56e22c65173149c436280ce4fd6b6',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/1b07e99e47c56e22c65173149c436280ce4fd6b6',
  },
  {
    path: 'amplify/backend/function/audiouploadcf1e6401',
    mode: '040000',
    type: 'tree',
    sha: '938512837ce2596a33ee6bd0f985865d9512ff13',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/938512837ce2596a33ee6bd0f985865d9512ff13',
  },
  {
    path: 'amplify/backend/function/audiouploadcf1e6401/audiouploadcf1e6401-cloudformation-template.json',
    mode: '100644',
    type: 'blob',
    sha: '0cd0c4e09c60b0542c25026f8650bc5b49d9bf77',
    size: 3536,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/0cd0c4e09c60b0542c25026f8650bc5b49d9bf77',
  },
  {
    path: 'amplify/backend/function/audiouploadcf1e6401/src',
    mode: '040000',
    type: 'tree',
    sha: '673f3f745adb42ed130da51c982129fbf600a5c0',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/673f3f745adb42ed130da51c982129fbf600a5c0',
  },
  {
    path: 'amplify/backend/function/audiouploadcf1e6401/src/app.js',
    mode: '100644',
    type: 'blob',
    sha: 'd3a807b295e625963e286347c89458405d6fc15d',
    size: 9229,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/d3a807b295e625963e286347c89458405d6fc15d',
  },
  {
    path: 'amplify/backend/function/audiouploadcf1e6401/src/event.json',
    mode: '100644',
    type: 'blob',
    sha: 'e7cf98603e085463a78cf339462ac09cc00883e5',
    size: 68,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/e7cf98603e085463a78cf339462ac09cc00883e5',
  },
  {
    path: 'amplify/backend/function/audiouploadcf1e6401/src/index.js',
    mode: '100644',
    type: 'blob',
    sha: '951246da897c10cc527b4309451f371182d23553',
    size: 298,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/951246da897c10cc527b4309451f371182d23553',
  },
  {
    path: 'amplify/backend/function/audiouploadcf1e6401/src/package-lock.json',
    mode: '100644',
    type: 'blob',
    sha: 'f0ad162ffe7acbc978889e1dced5db2be7c42037',
    size: 21686,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/f0ad162ffe7acbc978889e1dced5db2be7c42037',
  },
  {
    path: 'amplify/backend/function/audiouploadcf1e6401/src/package.json',
    mode: '100644',
    type: 'blob',
    sha: 'c0658a17bf842d228fd9268364183b5a30de2ed6',
    size: 386,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/c0658a17bf842d228fd9268364183b5a30de2ed6',
  },
  {
    path: 'amplify/backend/hosting',
    mode: '040000',
    type: 'tree',
    sha: '9363e30c9c59f5f0016f58c049b73230b52a81dc',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/9363e30c9c59f5f0016f58c049b73230b52a81dc',
  },
  {
    path: 'amplify/backend/hosting/S3AndCloudFront',
    mode: '040000',
    type: 'tree',
    sha: 'bb51fff0879153c363da011276ab3722a0913472',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/bb51fff0879153c363da011276ab3722a0913472',
  },
  {
    path: 'amplify/backend/hosting/S3AndCloudFront/parameters.json',
    mode: '100644',
    type: 'blob',
    sha: '8a2b2f396e6afaeadd768d216319fcd477ee784e',
    size: 64,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/8a2b2f396e6afaeadd768d216319fcd477ee784e',
  },
  {
    path: 'amplify/backend/hosting/S3AndCloudFront/template.json',
    mode: '100644',
    type: 'blob',
    sha: 'd98d68931004521f8b0bd3d91bf30f203f5c9f33',
    size: 3334,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/d98d68931004521f8b0bd3d91bf30f203f5c9f33',
  },
  {
    path: 'amplify/backend/storage',
    mode: '040000',
    type: 'tree',
    sha: 'c7c05cdd5eab9bd7b339f074f56baab7b1207514',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/c7c05cdd5eab9bd7b339f074f56baab7b1207514',
  },
  {
    path: 'amplify/backend/storage/dynamocd12af10',
    mode: '040000',
    type: 'tree',
    sha: 'bf3363e3b613503c4cfa0878618c2ba559eec526',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/bf3363e3b613503c4cfa0878618c2ba559eec526',
  },
  {
    path: 'amplify/backend/storage/dynamocd12af10/dynamocd12af10-cloudformation-template.json',
    mode: '100644',
    type: 'blob',
    sha: 'efad2af7675d1daaf91b5b2b877bad7f27f341f3',
    size: 2830,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/efad2af7675d1daaf91b5b2b877bad7f27f341f3',
  },
  {
    path: 'amplify/backend/storage/dynamocd12af10/parameters.json',
    mode: '100644',
    type: 'blob',
    sha: '5de41be9452ec25374f9bf8be7a9aaa7e9acdad8',
    size: 96,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/5de41be9452ec25374f9bf8be7a9aaa7e9acdad8',
  },
  {
    path: 'amplify/backend/storage/s32831ee2b',
    mode: '040000',
    type: 'tree',
    sha: '31d59dda0256853efddb75e5c07d3d686934c7f7',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/31d59dda0256853efddb75e5c07d3d686934c7f7',
  },
  {
    path: 'amplify/backend/storage/s32831ee2b/parameters.json',
    mode: '100644',
    type: 'blob',
    sha: 'e4499bc4237efb23a357ced78b65e9b8cfdde2b2',
    size: 1209,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/e4499bc4237efb23a357ced78b65e9b8cfdde2b2',
  },
  {
    path: 'amplify/backend/storage/s32831ee2b/s3-cloudformation-template.json',
    mode: '100644',
    type: 'blob',
    sha: 'a85f60dbe684a973c922bfbf519e5585a416eaae',
    size: 11400,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/a85f60dbe684a973c922bfbf519e5585a416eaae',
  },
  {
    path: 'amplify/team-provider-info.json',
    mode: '100644',
    type: 'blob',
    sha: '18d74b8fb6738ea546f0d4de8b4f818fb381c5f6',
    size: 816,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/18d74b8fb6738ea546f0d4de8b4f818fb381c5f6',
  },
  {
    path: 'package-lock.json',
    mode: '100644',
    type: 'blob',
    sha: '0b12d2881d506b6c1e96889576bb4d9aae7c135e',
    size: 688307,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/0b12d2881d506b6c1e96889576bb4d9aae7c135e',
  },
  {
    path: 'package.json',
    mode: '100644',
    type: 'blob',
    sha: '1c5dd6e219e852ae6deb6bf35546ef02fcd9e8da',
    size: 843,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/1c5dd6e219e852ae6deb6bf35546ef02fcd9e8da',
  },
  {
    path: 'public',
    mode: '040000',
    type: 'tree',
    sha: 'f319404c34f425da5c1aadd167c4cdb8e4e90ae8',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/f319404c34f425da5c1aadd167c4cdb8e4e90ae8',
  },
  {
    path: 'public/index.html',
    mode: '100644',
    type: 'blob',
    sha: '106ffe4089699b0c9b12dbf53cf5a1efdd6f2f7f',
    size: 1981,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/106ffe4089699b0c9b12dbf53cf5a1efdd6f2f7f',
  },
  {
    path: 'public/manifest.json',
    mode: '100644',
    type: 'blob',
    sha: 'b416ba4ba6df7e3a2ddba15cd6c6b3d552c13cd6',
    size: 292,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/b416ba4ba6df7e3a2ddba15cd6c6b3d552c13cd6',
  },
  {
    path: 'screenshots',
    mode: '040000',
    type: 'tree',
    sha: '848427ae882d029413e7295f762bb08ab402241b',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/848427ae882d029413e7295f762bb08ab402241b',
  },
  {
    path: 'screenshots/home.png',
    mode: '100644',
    type: 'blob',
    sha: 'fd047e4927965c70d1ffaf70a3db8af1e405be98',
    size: 40980,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/fd047e4927965c70d1ffaf70a3db8af1e405be98',
  },
  {
    path: 'screenshots/upload.png',
    mode: '100644',
    type: 'blob',
    sha: 'e9ea7b6fdbd2c1bcc36bbc1d8acf23eec6afa582',
    size: 56664,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/e9ea7b6fdbd2c1bcc36bbc1d8acf23eec6afa582',
  },
  {
    path: 'src',
    mode: '040000',
    type: 'tree',
    sha: 'b9af3c118d71f73a7203436f31428a5f1b41e877',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/b9af3c118d71f73a7203436f31428a5f1b41e877',
  },
  {
    path: 'src/App.css',
    mode: '100644',
    type: 'blob',
    sha: '83d6ef83ebdad9ecf8faea008a86c5ba5a271ac8',
    size: 273,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/83d6ef83ebdad9ecf8faea008a86c5ba5a271ac8',
  },
  {
    path: 'src/App.js',
    mode: '100644',
    type: 'blob',
    sha: '178341c8b49da756494663bf1db74ff2096d9b56',
    size: 738,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/178341c8b49da756494663bf1db74ff2096d9b56',
  },
  {
    path: 'src/App.test.js',
    mode: '100644',
    type: 'blob',
    sha: 'a754b201bf9c6caf5271293588189fb4210f99d1',
    size: 248,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/a754b201bf9c6caf5271293588189fb4210f99d1',
  },
  {
    path: 'src/components',
    mode: '040000',
    type: 'tree',
    sha: '9b4693c490c579343e702a95a5aa51b82115b05a',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/9b4693c490c579343e702a95a5aa51b82115b05a',
  },
  {
    path: 'src/components/AudioPlayer.js',
    mode: '100644',
    type: 'blob',
    sha: '81393c9739d0d50661ada3133425b3a964367a7f',
    size: 2145,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/81393c9739d0d50661ada3133425b3a964367a7f',
  },
  {
    path: 'src/components/DownloadBtn.js',
    mode: '100644',
    type: 'blob',
    sha: 'c2b5a93711c0a5deb122bffa9b3ee8c33fa383b4',
    size: 333,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/c2b5a93711c0a5deb122bffa9b3ee8c33fa383b4',
  },
  {
    path: 'src/components/MuteBtn.js',
    mode: '100644',
    type: 'blob',
    sha: 'c70342e9bb2180022c461a59b5fdb4b8afbe3552',
    size: 764,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/c70342e9bb2180022c461a59b5fdb4b8afbe3552',
  },
  {
    path: 'src/components/ScoreBtns.js',
    mode: '100644',
    type: 'blob',
    sha: '0674321b413e964fd650e7c8783a37f16b69e99b',
    size: 2318,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/0674321b413e964fd650e7c8783a37f16b69e99b',
  },
  {
    path: 'src/components/Search.js',
    mode: '100644',
    type: 'blob',
    sha: 'b96d7a54f7d71de98a656c172cc3a421c4430087',
    size: 710,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/b96d7a54f7d71de98a656c172cc3a421c4430087',
  },
  {
    path: 'src/components/TopNav.js',
    mode: '100644',
    type: 'blob',
    sha: '1eaf5411ad95e6e044da7cf533d1c5f32c2ff1a7',
    size: 786,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/1eaf5411ad95e6e044da7cf533d1c5f32c2ff1a7',
  },
  {
    path: 'src/components/UploadBtn.js',
    mode: '100644',
    type: 'blob',
    sha: 'd84040069a6043735e6d202b59fa1c2a696f5fa1',
    size: 935,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/d84040069a6043735e6d202b59fa1c2a696f5fa1',
  },
  {
    path: 'src/components/UploadCard.js',
    mode: '100644',
    type: 'blob',
    sha: '090b48b04a2de4202ac381a4ca16f47aa118389e',
    size: 953,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/090b48b04a2de4202ac381a4ca16f47aa118389e',
  },
  {
    path: 'src/components/UploadFileDropzone.js',
    mode: '100644',
    type: 'blob',
    sha: '5d2e2cebaaed2c6d4d1db309e812a47d15b16103',
    size: 5006,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/5d2e2cebaaed2c6d4d1db309e812a47d15b16103',
  },
  {
    path: 'src/index.css',
    mode: '100644',
    type: 'blob',
    sha: '139597f9cb07c5d48bed18984ec4747f4b4f3438',
    size: 2,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/139597f9cb07c5d48bed18984ec4747f4b4f3438',
  },
  {
    path: 'src/index.js',
    mode: '100644',
    type: 'blob',
    sha: '25b6c8497df88302f1e89d950b3ff348f8b41982',
    size: 551,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/25b6c8497df88302f1e89d950b3ff348f8b41982',
  },
  {
    path: 'src/pages',
    mode: '040000',
    type: 'tree',
    sha: 'bbb53398c9b3e9704b37b542e2969216f1cc4181',
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/trees/bbb53398c9b3e9704b37b542e2969216f1cc4181',
  },
  {
    path: 'src/pages/Page404.js',
    mode: '100644',
    type: 'blob',
    sha: '0f958cb2e60df15c1bbc3cc030179a4c1733077e',
    size: 218,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/0f958cb2e60df15c1bbc3cc030179a4c1733077e',
  },
  {
    path: 'src/pages/SearchResults.js',
    mode: '100644',
    type: 'blob',
    sha: '03007fe6a09e7d24cc110e1bcdd7cfd6efb83122',
    size: 1895,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/03007fe6a09e7d24cc110e1bcdd7cfd6efb83122',
  },
  {
    path: 'src/pages/UploadCards.js',
    mode: '100644',
    type: 'blob',
    sha: '4883ec671db6d2cea5e8b91ea438d6d1d8af8309',
    size: 2640,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/4883ec671db6d2cea5e8b91ea438d6d1d8af8309',
  },
  {
    path: 'src/serviceWorker.js',
    mode: '100644',
    type: 'blob',
    sha: '2283ff9ced126ba2ba3cadde952135b3728880f8',
    size: 4948,
    url: 'https://api.github.com/repos/iqbal-singh/audio-upload/git/blobs/2283ff9ced126ba2ba3cadde952135b3728880f8',
  },
];

describe('findSubDirectory', () => {
  it('should return the root directory', () => {
    const subDirectory = findSubDirectory(mockDirectory, ['test']);
    expect(subDirectory).toEqual(mockDirectory);
  });
  it('should return the correct subdirectory', () => {
    const subDirectory = findSubDirectory(mockDirectory, ['test', 'videos']);
    expect(subDirectory).toEqual(mockDirectory.items[1]);
  });
  it('should return undefined for an invalid path', () => {
    const subDirectory = findSubDirectory(mockDirectory, ['test', 'aaaaa']);
    expect(subDirectory).toEqual(undefined);
  });
});

describe('formatKbFileSize', () => {
  it('should format the file size', () => {
    expect(formatKbFileSize(mockDirectory.sizeKb)).toEqual('120 KB');
    expect(formatKbFileSize(0)).toEqual('-');
  });
});

describe('getFileExtension', () => {
  it('should return the extension', () => {
    expect(getFileExtension('test.txt')).toEqual('txt');
    expect(getFileExtension('test.mp3')).toEqual('mp3');
    expect(getFileExtension('test.....mp3')).toEqual('mp3');
    expect(getFileExtension('folder')).toEqual('-');
  });
});

describe('truncateFileName', () => {
  it('should truncate the file name', () => {
    expect(truncateFileName('test111111111111111.txt', 3)).toEqual(
      'tes[...].txt'
    );
    expect(truncateFileName('test.txt', 2)).toEqual('te[...].txt');
  });
});
