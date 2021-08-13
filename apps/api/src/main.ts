import { Directory } from '@file-browser/api-interfaces';
import { unflattenGitHubTree } from '@file-browser/utils';
import axios from 'axios';
import * as express from 'express';
import cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/files', async (req, res) => {
  try {
    let { userRepoBranch } = req.query;
    userRepoBranch = userRepoBranch.toString();

    const [user, repo, branch] = userRepoBranch.toString().split('/');
    const url = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`;
    const fetchRes = await axios.get(url);

    if (fetchRes.status === 200) {
      const data = fetchRes.data;
      const tree = unflattenGitHubTree(data.tree);

      res.send(tree);
    }
  } catch (e) {
    const { response } = e;
    if (response.status === 404) {
      res.status(200).send({
        name: '',
        sizeKb: 0,
        type: 'dir',
        items: [],
      } as Directory);
    }

    res
      .status(response.status)
      .send({ error: response.statusText || e.message });
  }
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
server.on('error', console.error);
