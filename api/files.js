import axios from 'axios';

const unflattenGitHubTree = (nodes) => {
  const tree = {
    name: 'home',
    path: '/home',
    sha: '',
    url: '',
    type: 'dir',
    size: 0,
    sizeKb: 0,
    items: [],
  };
  nodes.forEach((node) => {
    const dirs = node.path?.split('/') ?? [];
    if (dirs.length === 1 && dirs[0] === '') {
      dirs.slice(1);
    }
    let traversed = tree;
    let totalPath = '';

    dirs.forEach((dir, index) => {
      const foundChild = traversed.items?.find(
        (child) => child.path === `${totalPath}/${dir}`
      );

      const currSubtree = foundChild
        ? foundChild
        : {
            path: `${totalPath}/${dir}`,
            name: dir,
            sizeKb:
              node.size === 0 || !node.size
                ? 0
                : Number((node.size / 1024).toFixed(2)),
            type: node.type === 'tree' ? 'dir' : 'file',
            items: node.type === 'tree' ? [] : undefined,
            sha: node.sha,
            url: node.url,
            mode: node.mode,
          };

      if (!foundChild) traversed.items?.push(currSubtree);
      if (index === dirs.length - 1) currSubtree.sha = node.sha;
      traversed = currSubtree;
      totalPath += `/${dir}`;
    });
  });

  return tree;
};

module.exports = async (req, res) => {
  try {
    const { userRepoBranch } = req.query;
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
      });
    }

    res
      .status(response.status)
      .send({ error: response.statusText || e.message });
  }
};
