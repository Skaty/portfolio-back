import resume from './resume';
import github from './github';

function formatBio(name, bio) {
  return {
    name: bio.name || '',
    label: 'Programmer',
    picture: bio.avatarURL,
    email: bio.email || '',
    website: bio.websiteURL,
    summary: bio.bio,
    location: {
      city: bio.location,
    },
    profiles: [{
      network: 'GitHub',
      username: name,
      url: `http://github.com/${name}`,
    }],
  };
}

function formatExperience(experience) {
  const result = {
    organization: experience.name,
    website: `http://github.com${experience.path}`,
    position: 'Contributor',
    summary: experience.description,
    startDate: '',
    endDate: '',
  };
  result.highlights = [
    `${experience.commits} commits`,
    `${experience.stargazers.totalCount} stars`,
  ];
  if (experience.homepageURL) {
    result.highlights.push(`Website: ${experience.homepageURL}`);
  }
  return result;
}

function formatProgramming(language) {
  return [{
    name: '',
    level: '',
    keywords: Object.keys(language),
  }];
}

export default async (name, template) => {
  const GITHUB_DATA = await github(name);

  if (Object.keys(GITHUB_DATA).length === 0 && GITHUB_DATA.constructor === Object) {
    return resume(template, {});
  }

  const basics = formatBio(name, GITHUB_DATA);
  const experience = GITHUB_DATA.contributedRepositories.map(exp => formatExperience(exp));
  const skills = formatProgramming(GITHUB_DATA.languages);

  return resume(template, { basics, volunteer: experience, skills });
};
