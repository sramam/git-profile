# git-profile
Easily switch the config on a git repo between multiple git profiles (work, github-public, private projects).

# Installation
    npm install -g git-profile
    # setup configuration in ~/.gitprofiles
    git-profile

# Configuration
git-profile uses ~/.gitprofiles to set various git config options. The file is assumed to be contain JSON.
For each profile, it expects a set of key value pairs. It basically runs 'git config key value'.
If the profile name is 'global', the equivalent command run is 'git config --global key value'

    cat ~/.gitprofiles
    'profile1': {
      'section.key': val
    }
