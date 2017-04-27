#! /usr/bin/env node

var inquirer = require('inquirer');
var program = require('commander');
var sh = require('shelljs');
var fs = require('fs');
var chalk = require('chalk');
var expander = require('expand-home-dir');

function getProfiles(fname) {
  fname = fname || '~/.gitprofiles';
  try {
    return JSON.parse(fs.readFileSync(expander(fname)));
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    } else {
      message = 'Error parsing ' + fname + '. Is is valid JSON? ' + err.message;
      err.message = message;
      console.log(chalk.red(message));
      throw err;
    }
  }
}

function selectProfile() {
  var profiles = getProfiles('~/.gitprofiles');
  var profileNames = profiles === null ? [] : Object.keys(profiles);
  if (profileNames.length === 0) {
    console.log(chalk.yellow('~/.gitprofiles is empty or not found'));
    return -1;
  } 
  profileNames.push('exit');
  inquirer.prompt({
    type: 'list',
    message: 'Pick a git profile to switch to:',
    name: 'profile',
    choices: profileNames
  }, function proc(answers) {
    if (answers.profile === 'exit') {
      return;
    }
    var picked = profiles[answers.profile];
    var globalFlag = (answers.profile === 'global') ? '--global' : '';
    Object.keys(picked).map(function(key) {
      sh.exec('git config ' + globalFlag + ' ' + key + ' ' + picked[key]);
    });
    sh.exec('git config -l ' + globalFlag);
  });
}

/*
function createProfile() {
  var profiles = [];
  try { 
    profiles = JSON.parse(fs.readFileSync(expander(fname)));
  } catch (err) {
    // ignore error
  }
  var profileList = Object.keys(profiles);
  profileList.append('other');
  var picked = null;
  var questions = [{
    type: 'list',
    choices: profileList,
    name: 'picked'
    when: function when(answers) {
      return 1 < profileList.length;
    }
  }, {
    type: 'input',
    name: 'profileName',
    when: function when(answers) {
      return ( profileList.length <= 1 ) || 
             ( answers.picked === 'other' );
    }
  }]
}

function updateProfile() {
}

function deleteProfile() {
}
*/

selectProfile();
