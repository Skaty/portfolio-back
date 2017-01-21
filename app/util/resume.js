const TEMPLATES_AVAILABLE = [
  'jsonresume-theme-caffeine',
  'jsonresume-theme-crisp',
  'jsonresume-theme-eloquent',
  'jsonresume-theme-kate',
  'jsonresume-theme-kendall',
  'jsonresume-theme-material',
  'jsonresume-theme-moon',
  'jsonresume-theme-simplistic',
  'jsonresume-theme-smart',
  'jsonresume-theme-spartacus',
  'jsonresume-theme-stackoverflow'
];

const JSON_SCHEMA = {
  "basics": {
    "name": "John Doe",
    "label": "Programmer",
    "picture": "",
    "email": "john@gmail.com",
    "website": "http://johndoe.com",
    "summary": "A summary of John Doe...",
    "location": {
      "city": "San Francisco"
    },
    "profiles": [{
      "network": "GitHub",
      "username": "john",
      "url": "http://twitter.com/john"
    }]
  },
  "volunteer": [{
    "organization": "Organization",
    "position": "Volunteer",
    "website": "http://organization.com/",
    "startDate": "2012-01-01",
    "endDate": "2013-01-01",
    "summary": "Description...",
    "highlights": [
      "Awarded 'Volunteer of the Month'"
    ]
  }],
  "skills": [{
    "name": "Web Development",
    "level": "Master",
    "keywords": [
      "HTML",
      "CSS",
      "Javascript"
    ]
  }],
  "languages": [{
    "name": "English",
    "level": "Native speaker"
  }]
};

export default () => { throw 'Not Implemented'; };
