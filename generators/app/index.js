'use strict';

const Generator = require('yeoman-generator'),
      path = require('path'),
      inspect = require('util').inspect;

const {
  info,
  debug,
  verbose,
  verbosePriority
} = require('../../colors');

/*
 * The available priorities are (in running order):
 *
 * initializing - Your initialization methods (checking current project state, getting configs, etc)
 * prompting - Where you prompt users for options (where you'd call this.prompt())
 * configuring - Saving configurations and configure the project
 *    (creating .editorconfig files and other metadata files)
 * default - If the method name doesn't match a priority, it will be pushed to this group.
 * writing - Where you write the generator specific files (routes, controllers, etc)
 * conflicts - Where conflicts are handled (used internally)
 * install - Where installations are run (npm, bower)
 * end - Called last, cleanup, say good bye, etc
 */

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('project', {
      type: String,
      required: false,
      desc: 'Project name for the new project.'
    });

    this.option('verbose', {
      type: Boolean,
      alias: 'v',
      desc: 'Verbosely log progress.',
      default: false,
      hide: false
    });

    this.option('debug', {
      type: Boolean,
      alias: 'd',
      desc: 'Debug logging.',
      default: false,
      hide: true
    });

    if (this.options.verbose) {
      this.log(verbosePriority, 'Generator constructor.');
    }

    this._logDebug(`Called with options of: ${inspect(this.options)}`);
  }

  initializing() {
    this._logPriority('initializing');
  }

  prompting() {
    this._logPriority('prompting');

    let forCurrectDirectory = {
      type: 'confirm',
      name: 'makeNewDiretory',
      message: 'Are you making a new folder?',
      default: true
    };

    let forProjectName = {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'angular-template'
    };

    let forUserConfig = {
      type: 'confirm',
      name: 'createUserConfig',
      message: 'Do you want to make a user override file for config?',
      default: false
    };

    let prompts = [];
    prompts.push(this.options.project ?
      '' :
      forCurrectDirectory
    );

    return this.prompt(prompts)
      .then(answers => {
        if (answers.makeNewDiretory) {
          return this.prompt([forProjectName]).then(answers => {
            this.project = answers.projectName;
            this.destinationRoot(this.project);
          });
        }

        this.project = path.basename(this.contextRoot);
      }).then(() => {
        if (this.options.verbose) {
          this.log(verbose, `Project destination: ${this.destinationRoot()}`);
        }
        this.config.set('project', this.project);

        return this.prompt([forUserConfig]);
      }).then(answers => {
        this.createUserConfig = answers.createUserConfig;
      });
  }

  default() {
    this._logPriority('default');
    this._logDebug(this.sourceRoot());
  }

  writing() {
    this._logPriority('writing');
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        project: this.project
      }
    );

    this.config.save();
  }

  install() {
    this._logPriority('install');
  }

  end() {
    this._logPriority('end');
    this.log(info, 'All done!');
  }

  _logPriority(priority) {
    if (this.options.verbose) {
      this.log(verbosePriority, `Running ${priority} priority.`);
    }
  }

  _logDebug(message) {
    if (this.options.debug) {
      this.log(debug, message);
    }
  }
};
