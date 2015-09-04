'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the superior ' + chalk.red('AngularYanx') + ' generator!'
    ));

    var prompts = [
      {
        name: 'appName',
        message: 'What is your apps name?'
      }
    ];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      done();
    }.bind(this));
  },

  scaffoldFolder: function(){
    mkdirp('app');
  },
  
  copy: function() {
    this.fs.copy(
      this.templatePath("app/*"),
      this.destinationPath("app")
    );   
    
    this.fs.copy(
      this.templatePath("app/*/**"),
      this.destinationPath("app")
    );   
    
    this.fs.copy(this.templatePath("package.json"), this.destinationPath("package.json"));
    this.fs.copy(this.templatePath("bower.json"), this.destinationPath("bower.json"));
    this.fs.copy(this.templatePath("gulpfile.js"), this.destinationPath("gulpfile.js"));
    this.fs.copy(this.templatePath("karma.conf.js"), this.destinationPath("karma.conf.js"));
    this.fs.copy(this.templatePath("protractor.conf.js"), this.destinationPath("protractor.conf.js"));
    this.fs.copy(this.templatePath(".jshintrc"), this.destinationPath(".jshintrc"));
    this.fs.copy(this.templatePath(".bowerrc"), this.destinationPath(".bowerrc"));
    this.fs.copy(this.templatePath(".editorconfig"), this.destinationPath(".editorconfig"));
  },

  install: function () {
    this.installDependencies();
  }
});
