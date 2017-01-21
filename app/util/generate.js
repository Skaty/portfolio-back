import resume from './resume';
import github from './github';

function formatBio(name, bio) {
  return {
    "name": bio.name,
    "label": "Programmer",
    "picture": bio.avatarURL,
    "email": bio.email,
    "website": bio.websiteURL,
    "summary": bio.bio,
    "location": {
      "city": bio.location
    },
    "profiles": [{
      "network": "GitHub",
      "username": name,
      "url": `http://github.com/${name}`
    }]
  };
}

function formatExperience(experience) {
  return {
    "organization": experience.name,
    "position": "Contributor",
    "website": experience.homepageURL,
    "startDate": "2012-01-01",
    "endDate": "2013-01-01",
    "summary": experience.description,
    "highlights": [
      `${experience.commits} commits`
    ]
  };
}

export default async (name, template) => {
  const GITHUB_DATA = await github(name);

  if (Object.keys(GITHUB_DATA).length === 0 && GITHUB_DATA.constructor === Object) {
    return resume(template, {});
  }

  let basics = formatBio(name, GITHUB_DATA);
  let experience = GITHUB_DATA.contributedRepositories.map(exp => formatExperience(exp));

  return resume(template, {basics, 'volunteer': experience})
};
