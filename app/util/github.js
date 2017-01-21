import got from 'got';
import ghGot from 'gh-got';

import log from './log';

const query = {
  'client_id': process.env.CLIENT_ID,
  'client_secret': process.env.CLIENT_SECRET
};

const headers = {
  'Authorization': `bearer ${process.env.GRAPHQL_KEY}`
};

const beta_headers = {
  'accept': 'application/vnd.github.cloak-preview'
};

function getProperName(name) {
  return ghGot(`users/${name}`, {query}).then(res => {
    if ('login' in res.body) {
      return res.body.login;
    } else {
      return '';
    }
  })
}

function getContributedRepoList(name) {
  let body =  JSON.stringify({
    'query': `query { user(login:"${name}") { email location name websiteURL avatarURL bio contributedRepositories(first: 100) { edges { node { name path description isFork isPrivate homepageURL stargazers { totalCount } } } } } }`
  });

  let json = true;

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
  return ghGot(`repos${repoURL}/contributors`, {query}).then(res => {
    if (!Array.isArray(res.body)) {
      // error
      return 0;
    } else {
      let result = res.body.filter(itm => itm.login === name);
      if (result.length == 0) {
        return 0;
      } else {
        return result[0].contributions;
      }
    }
  }).catch(error => {
    console.log(error);
    return 0;
  });
}

function extractRepoProgrammingLanguage(repoURL) {
  return ghGot(`repos${repoURL}/languages`, {query}).then(res => {
    return Object.keys(res.body);
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
function getRepoContribStats(name) {
  return (repoURL) => {
    let commits = extractContributionsForRepo(name, repoURL);
    let languages = extractRepoProgrammingLanguage(repoURL);

    return Promise.all([commits, languages]).then(res => {
      return {'commits': res[0], 'langs': res[1]};
    }).catch(error => {
      return {'commits': 0, 'langs': []};
    });
  };
}

function filterIrrelevantRepo(contribution) {
  return !contribution.isFork && !contribution.isPrivate;
}

function collectProgrammingLanguages(repos) {
  const langMap = {};
  repos.forEach((repo) => {
    repo.langs.forEach((lang) => {
      if (lang in langMap) {
        langMap[lang]++;
      } else {
        langMap[lang] = 1;
      }
    })
  });

  return langMap;
}

export default async (enteredName) => {
  try {
    const name = await getProperName(enteredName);
    const rawInfo = await getContributedRepoList(name);
    const contribRepos = rawInfo.contributedRepositories.edges.map((item) => item.node);
    let nonForkRepos = contribRepos.filter(filterIrrelevantRepo);

    let userRepo = getRepoContribStats(name);
    let stats = await Promise.all(nonForkRepos.map(itm => userRepo(itm.path)));

    let zip = (a1, a2) => a1.map((x, i) => Object.assign(x, a2[i]));
    let contributedRepositories = zip(stats, nonForkRepos).filter(itm => itm.commits > 0);

    let languages = collectProgrammingLanguages(contributedRepositories);

    return Object.assign({}, rawInfo, {contributedRepositories, languages});
  } catch (error) {
    console.log(error);
    return {};
  }
};
