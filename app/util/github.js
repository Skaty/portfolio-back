import got from 'got';
import gotCached from './gotCached';

import log from './log';

const query = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
};

const headers = {
  Authorization: `bearer ${process.env.GRAPHQL_KEY}`,
};

const beta_headers = {
  accept: 'application/vnd.github.cloak-preview'
};

function getProperName(name) {
  return gotCached(`users/${name}`, {query}).then(webpage => {
    if ('login' in webpage) {
      return webpage.login;
    }
    return '';
  });
}

function getContributedRepoList(name) {
  const body = JSON.stringify({
    query: `query { user(login:"${name}") { email location name websiteURL avatarURL bio contributedRepositories(first: 100) { edges { node { name path description isFork isPrivate homepageURL stargazers { totalCount } languages(first: 3, orderBy: { field: SIZE, direction: DESC }) { edges { node { name } } } } } } } }`
  });

  const json = true;

  return got('https://api.github.com/graphql', {json, body, headers}).then(res => {
    if ('errors' in res.body) {
      return {};
    } else {
      // no error
      return res.body.data.user;
    }
  });
}

function extractContributionsForRepo(name, repoURL) {
  return gotCached(`repos${repoURL}/contributors`, {query}).then((webpage) => {
    if (!Array.isArray(webpage)) {
      // error
      return 0;
    }
    const result = webpage.filter(itm => itm.login === name);
    if (result.length === 0) {
      return 0;
    }
    return result[0].contributions;
  }).catch((error) => {
    console.log(error);
    return 0;
  });
}

/*
async function extractFirstAndRecentCommit(name, repoURL) {
  let repoName = repoURL.substring(1);
  let q = `author:${name} repo:${repoName}`;
  const sort = 'author-date';
  const order = 'asc'

  const recent = await ghGot('search/commits', {
    'query': {...query, q, sort},
    'headers': beta_headers
  });

  const first = await ghGot('search/commits', {
    'query': {...query, q, sort, order},
    'headers': beta_headers
  });

  return {first, recent};
}
*/
function filterIrrelevantRepo(contribution) {
  return !contribution.isFork && !contribution.isPrivate;
}

function collectProgrammingLanguages(repos) {
  const langMap = {};
  repos.forEach((repo) => {
    repo.languages.edges.forEach((edge) => {
      const lang = edge.node.name;
      if (lang in langMap) {
        langMap[lang] += 1;
      } else {
        langMap[lang] = 1;
      }
    });
  });

  return langMap;
}

export default async (enteredName) => {
  try {
    const name = await getProperName(enteredName);
    const rawInfo = await getContributedRepoList(name);
    const contribRepos = rawInfo.contributedRepositories.edges.map(item => item.node);
    const nonForkRepos = contribRepos.filter(filterIrrelevantRepo);

    const contributedRepositories = [];
    await Promise.all(nonForkRepos.map(async (repo) => {
      repo.commits = await extractContributionsForRepo(name, repo.path);
      if (repo.commits > 0) {
        contributedRepositories.push(repo);
      }
    }));
    const languages = collectProgrammingLanguages(contributedRepositories);

    return Object.assign({}, rawInfo, { contributedRepositories, languages });
  } catch (error) {
    console.log(error);
    return {};
  }
};
