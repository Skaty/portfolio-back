import ace from 'jsonresume-theme-ace';
import caffeine from 'jsonresume-theme-caffeine';
import eloquent from 'jsonresume-theme-eloquent';
import flatOptimized from 'jsonresume-theme-flat-optimized';
import foxyboxy from 'jsonresume-theme-foxyboxy';
import kate from 'jsonresume-theme-kate';
import kendall from 'jsonresume-theme-kendall';
import riga from 'jsonresume-theme-riga';
import simplistic from 'jsonresume-theme-simplistic';
import spartacus from 'jsonresume-theme-spartacus';
import stackoverflow from 'jsonresume-theme-stackoverflow';

import bunyan from 'bunyan';

const log = bunyan.createLogger({ name: 'resume' });

const TEMPLATES_AVAILABLE = [
  ace,
  caffeine,
  eloquent,
  flatOptimized,
  foxyboxy,
  kate,
  kendall,
  riga,
  simplistic,
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
  work: [],
  education: [],
};

export default (idx, data) => {
  const template = TEMPLATES_AVAILABLE[idx % TEMPLATES_AVAILABLE.length];

  if (!template.render) {
    log.error('Not rendering!');
    return '';
  }
  return template.render({
    ...JSON_SCHEMA,
    ...data,
  });
};
