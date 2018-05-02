(function() {
  'use strict';

  jest.mock('fs');
  jest.mock('shelljs');
  jest.mock('inquirer');

  const expander = require('expand-home-dir');
  const shelljs = require('shelljs');
  const fs = require('fs');
  const inquirer = require('inquirer');

  const gitprofile = require('./index.js');

  const target = expander('~/.gitprofiles');

  describe('on missing .gitprofiles file', () => {
    test('should display message that configuration file is missing', () => {
      jest.spyOn(global.console, 'log').mockImplementation(() => {});

      expect(gitprofile.selectProfile()).toBe(-1);
      expect(shelljs.__executedCommands()).toEqual([]);
    });
  });


  describe('on invalid .gitprofiles file', () => {
    beforeAll(() => {
      // Set up some mocked out file info before each test
      fs.__setMockFile(target, '<lol />');
      jest.spyOn(global.console, 'log').mockImplementation(() => {});
    });

    it('should throw an Error about parsing errors of configuration file', () => {

      expect(gitprofile.selectProfile)
        .toThrow('Error parsing ~/.gitprofiles. Is is valid ' +
          'JSON? Unexpected token < in JSON at position 0');
    });
  });

  describe('on proper .gitprofiles file', () => {

    beforeAll(() => {
      // Set up some mocked out file info before each test
      fs.__setMockFile(target, JSON.stringify({
        global: {
          'user.name': 'Aria Stark',
          'user.email': 'a.stark@winterfell.org',
          'core.editor': 'vscode'
        },
        work: {
          'user.name': "Jaqen H'ghar",
          'user.email': 'noone@nowhere.io',
          'core.editor': 'intellij'
        },
        personal: {
          'user.name': 'daenerys',
          'user.email': 'daenerys.drogo@gmail.com',
          'core.editor': 'atom'
        }
      }));
    });

    describe('user selected exit', () => {
      beforeEach(() => {
        inquirer.__selectProfile('exit');
        shelljs.__resetCommands();
      });

      it('should exit without modification', () => {
        expect.assertions(2);

        return gitprofile.selectProfile()
          .then(data => {
            expect(data).toBe(0);
            expect(shelljs.__executedCommands()).toEqual([]);
          });
      });

    });

    describe('user selected work', () => {
      beforeEach(() => {
        inquirer.__selectProfile('work');
        shelljs.__resetCommands();
      });

      it('should set values for Jaqen H\'ghar', () => {

        expect.assertions(2);

        return gitprofile.selectProfile()
          .then(data => {
            expect(data).toBe(0);
            expect(shelljs.__executedCommands()).toEqual([
              "git config --unset-all user.name",
              "git config  user.name 'Jaqen H\\'ghar'",
              "git config --unset-all user.email",
              "git config  user.email 'noone@nowhere.io'",
              "git config --unset-all core.editor",
              "git config  core.editor 'intellij'",
              "git config -l "
            ]);
          });
      });
    });

    describe('user selected personal', () => {
      beforeEach(() => {
        inquirer.__selectProfile('personal');
        shelljs.__resetCommands();
      });

      it('should set values for Daenerys', () => {

        expect.assertions(2);
        return gitprofile.selectProfile()
          .then(data => {
            expect(data).toBe(0);
            expect(shelljs.__executedCommands()).toEqual([
              "git config --unset-all user.name",
              "git config  user.name 'daenerys'",
              "git config --unset-all user.email",
              "git config  user.email 'daenerys.drogo@gmail.com'",
              "git config --unset-all core.editor",
              "git config  core.editor 'atom'",
              "git config -l "
            ]);
          });
      });
    });

    describe('user selected global', () => {
      beforeEach(() => {
        inquirer.__selectProfile('global');
        shelljs.__resetCommands();
      });

      it('should set values for Aria Stark as global values', () => {

        expect.assertions(2);
        return gitprofile.selectProfile()
          .then(data => {
            expect(data).toBe(0);
            expect(shelljs.__executedCommands()).toEqual([
              "git config --unset-all user.name",
              "git config --global user.name 'Aria Stark'",
              "git config --unset-all user.email",
              "git config --global user.email 'a.stark@winterfell.org'",
              "git config --unset-all core.editor",
              "git config --global core.editor 'vscode'",
              "git config -l --global"
            ]);
          });
      });
    });
  });
})();
