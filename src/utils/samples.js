const assessmentSampleAlpha = [
  {
    id: 1,
    section: 'Monitor cyber security systems',
    questions: [
      {
        q_name: 'Perform cyber security monitoring activities on IT systems and applications',
        answer: ''
      },
      {
        q_name: 'Categorise security incidents and breaches that occur',
        answer: ''
      },
      {
        q_name: 'Track and react to security monitoring alerts',
        answer: ''
      },
      {
        q_name: 'Compile reports on the performance of security operations for management reporting',
        answer: ''
      },
      {
        q_name: 'Assist with the implementation of agreed security system changes and maintenance routines',
        answer: ''
      },
      {
        q_name: 'Assist in the implementation of new cyber security programs',
        answer: ''
      },
      {
        q_name: 'Assist with conducting vulnerability and penetration assessments',
        answer: ''
      },
      {
        q_name: 'Assist in aligning cyber security systems with established service agreement standards',
        answer: ''
      },
      {
        q_name: 'Maintain documentation of all maintenance procedures and tests on cyber security systems',
        answer: ''
      }
    ]
  },
  {
    id: 2,
    section: 'Respond to cyber security queries',
    questions: [
      {
        q_name: 'Assist in responding to cyber security issues',
        answer: ''
      },
      {
        q_name: 'Assist in forensic threat investigations',
        answer: ''
      },
      {
        q_name: 'Assist with resolution of security-related issues',
        answer: ''
      },
      {
        q_name: 'Assist with simulation of user problems to identify drawbacks of cyber security systems',
        answer: ''
      },
      {
        q_name: 'Recommend modifications to cyber security systems to address issues',
        answer: ''
      },
      {
        q_name: 'Maintain logs of cyber security incidents',
        answer: ''
      }

    ]
  },
  {
    id: 3,
    section: 'Facilitate cyber security compliance',
    questions: [
      {
        q_name: 'Assist with the implementation security policies, standards and procedures',
        answer: ''
      },
      {
        q_name: 'Educate users on cyber security policies, standards and practices',
        answer: ''
      },
      {
        q_name: 'Identify improvement areas to existing security policies and procedures',
        answer: ''
      },
      {
        q_name: 'Monitor third party compliance with organisational cyber security policies, standards and procedures',
        answer: ''
      },
      {
        q_name: "Monitor users' adherence to cyber security policies, standards and procedures",
        answer: ''
      }
    ]
  },
  {
    id: 4,
    section: 'Optimise cyber security system performance',
    questions: [
      {
        q_name: 'Assist with piloting of new cyber security tools, technologies, and processes',
        answer: ''
      },
      {
        q_name: 'Assist with installation of new cyber security related hardware and software',
        answer: ''
      },
      {
        q_name: 'Assist with security system testing and ongoing optimisation or changes such as scheduled upgrades and updates',
        answer: ''
      },
      {
        q_name: 'Maintain documentation of all optimisation activities ',
        answer: ''
      },
      {
        q_name: 'Recommend security products, services and/or procedures',
        answer: ''
      },
      {
        q_name: 'Propose improvements to IT operational processes, procedure manuals, and documentation',
        answer: ''
      }
    ]
  }
];

const assessmentSampleBeta = [
  {
    id: 5,
    section: 'Gather and evaluate user requirements',
    questions: [
      {
        q_name: 'Review requirements for user interfaces (UIs) and provide advice on design aspects',
        answer: ''
      },
      {
        q_name: 'Evaluate overall user experience concept and design specifications to inform UI design',
        answer: ''
      },
      {
        q_name: 'Advise stakeholders on feasibility of UI solutions and recommend alternatives',
        answer: ''
      },
      {
        q_name: 'Oversee the preparation of UI design specifications',
        answer: ''
      },
      {
        q_name: 'Advice on the application of new and/or innovative UI concepts',
        answer: ''
      }
    ]
  }
];

const assessmentSampleCharlie = [
  {
    id: 9,
    section: 'Manage the design of software',
    questions: [
      {
        q_name: 'Evaluate the effectiveness of the application of software design enabling techniques',
        answer: ''
      },
      {
        q_name: 'Determine the process, strategy and design methodology to be used in software design',
        answer: ''
      },
      {
        q_name: 'Provide guidance and advice on the use of software design strategies and methods',
        answer: ''
      },
      {
        q_name: 'Assess the effectiveness of the application of the selected software design methodology',
        answer: ''
      },
      {
        q_name: 'Evaluate the effectiveness of the software architecture',
        answer: ''
      },
      {
        q_name: 'Assess the quality of the software design',
        answer: ''
      },
      {
        q_name: 'Provide guidance and direction on the need for requirements change resulting from design review',
        answer: ''
      }
    ]
  }
];

const assessmentSample = [
  {
    label: 'Setup cybersecurity for company',
    template: 'Cybersecurity',
    competencies: [...assessmentSampleAlpha]
  },
  {
    label: 'Design new software systems for market',
    template: 'UI / UX',
    competencies: [...assessmentSampleBeta]
  },
  {
    label: 'Build new software systems for market',
    template: 'Software Application',
    competencies: [...assessmentSampleCharlie]
  }
];

const probMark = {
  0: {
    label: 'Very Unlikely',
    text: 'blah bla'
  },
  1: {
    label: 'Unlikely',
    text: 'bla bla bla'
  },
  2: {
    label: 'Moderate',
    text: 'bla bla blafff'
  },
  3: {
    label: 'Likely',
    text: 'bla bla blafsssff'
  },
  4: {
    label: 'Very Likely',
    text: 'bla bla blasff'
  },
  5: {
    label: 'Sure happen',
    text: 'bla bla bsdsdlasff'
  }
};

const impactMark = {
  0: {
    label: 'Very Low',
    text: 'bla bla bsdsdlasff'
  },
  1: {
    label: 'Low',
    text: 'bla bla bsdsdlasff'
  },
  2: {
    label: 'Moderate',
    text: 'bla bla bsdsdlas;;;;lll'
  },
  3: {
    label: 'High',
    text: 'bla bla bsdsd'
  },
  4: {
    label: 'Very High',
    text: 'bla bla bsff'
  },
  5: {
    label: 'Sure Die',
    text: 'bla bldsdlasff'
  }
};

export { assessmentSample, impactMark, probMark };
