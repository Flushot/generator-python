'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var PythonGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.appName = path.basename(process.cwd());
    this.templateVals = {};
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Python generator!'));

    var prompts = [{
      type: 'input',
      name: 'APP_DESCRIPTION',
      message: 'Give me a description of your app:',
      default: 'Python module'
    }, {
      type: 'input',
      name: 'AUTHOR_NAME',
      message: "What is the author's name?",
      default: "Chris Lyon"
    }, {
      type: 'input',
      name: 'AUTHOR_EMAIL',
      message: "What is the author's email address?",
      default: "flushot@gmail.com"
    }];

    this.templateVals.APP_NAME = this.appName;
    this.prompt(prompts, function (props) {
      this.templateVals.APP_DESCRIPTION = props.APP_DESCRIPTION;
      this.templateVals.AUTHOR_NAME = props.AUTHOR_NAME;
      this.templateVals.AUTHOR_EMAIL = props.AUTHOR_EMAIL;
      done();
    }.bind(this));
  },

  app: function () {
    var copyTemplate = function(sourceFile, targetFile) {
      var contents = this.readFileAsString(path.join(this.sourceRoot(), sourceFile));
      for (var k in this.templateVals)
        contents = contents.split('<<<' + k + '>>>').join(this.templateVals[k]);
      this.write(path.join(this.destinationRoot(), targetFile), contents);
    }.bind(this);

    this.mkdir(this.appName);
    this.mkdir(this.appName + '/test');
    this.mkdir('.idea');
    this.mkdir('bin');

    this.copy('_gitignore', '.gitignore');
    this.copy('Makefile', 'Makefile');
    this.copy('MANIFEST.in', 'MANIFEST.in');
    copyTemplate('README.txt', 'README.txt');
    this.copy('requirements.txt', 'requirements.txt');
    copyTemplate('setup.py', 'setup.py');
    copyTemplate('_app.iml', this.appName + '.iml');
    this.copy('src/__init__.py', this.appName + '/__init__.py');
    copyTemplate('src/_app.py', this.appName + '/' + this.appName + '.py');
    this.copy('src/test/__init__.py', this.appName + '/test/__init__.py');
    copyTemplate('src/test/_app_test.py', this.appName + '/test/' + this.appName + '_test.py');
  }
});

module.exports = PythonGenerator;
