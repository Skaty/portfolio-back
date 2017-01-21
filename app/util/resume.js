import caffeine from 'jsonresume-theme-caffeine';
import crisp from 'jsonresume-theme-crisp';
import eloquent from 'jsonresume-theme-eloquent';
import kate from 'jsonresume-theme-kate';
import kendall from 'jsonresume-theme-kendall';
import material from 'jsonresume-theme-material';
import moon from 'jsonresume-theme-moon';
import simplistic from 'jsonresume-theme-simplistic';
import smart from 'jsonresume-theme-smart';
import spartacus from 'jsonresume-theme-spartacus';
import stackoverflow from 'jsonresume-theme-stackoverflow';

const TEMPLATES_AVAILABLE = [
  caffeine,
  crisp,
  eloquent,
  kate,
  kendall,
  material,
  moon,
  simplistic,
  smart,
  spartacus,
  stackoverflow,
];

const JSON_SCHEMA = {
  basics: {
    name: 'John Doe',
    label: 'Programmer',
    picture: '',
    email: 'john@gmail.com',
    website: 'http://johndoe.com',
    summary: 'A summary of John Doe...',
    location: {
      city: 'San Francisco',
    },
    profiles: [{
      network: 'GitHub',
      username: 'john',
      url: 'http://twitter.com/john',
    }],
  },
  volunteer: [{
    organization: 'Organization',
    position: 'Volunteer',
    website: 'http://organization.com/',
    startDate: '2012-01-01',
    endDate: '2013-01-01',
    summary: 'Description...',
    highlights: [
      "Awarded 'Volunteer of the Month'",
    ],
  }],
  skills: [{
    name: 'Web Development',
    level: '',
    keywords: [
      'HTML',
      'CSS',
      'Javascript',
    ],
  }],
};

export default (idx, data) => {
  const template = TEMPLATES_AVAILABLE[idx];

  if (!template.render) {
    return '';
  }
  return template.render({
    ...JSON_SCHEMA,
    ...data,
  });
};
