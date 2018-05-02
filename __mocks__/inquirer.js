const inquirer = jest.genMockFromModule('inquirer');

let selectedProfile;

function __selectProfile(profile) {
  selectedProfile = profile;
}

function prompt(config) {

  return Promise.resolve({
    profile: selectedProfile
  });
}

inquirer.__selectProfile = __selectProfile;
inquirer.prompt = prompt;

module.exports = inquirer;
