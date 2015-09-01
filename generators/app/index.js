'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

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
    this.mkdir('app');
    this.mkdir('app/assets');
    this.mkdir('app/assets/font');
    this.mkdir('app/assets/font/material-design-icons');
    this.mkdir('app/assets/font/roboto');
    this.mkdir('app/assets/sass');
    this.mkdir('app/assets/sass/materialize');
    this.mkdir('app/assets/sass/materialize/components');
    
    this.mkdir('app/modules');   
    this.mkdir('app/modules/core');
    this.mkdir('app/modules/core/components');
    this.mkdir('app/modules/core/components/navbar');
    this.mkdir('app/modules/core/components/sidebar');
    this.mkdir('app/modules/core/layout');
    this.mkdir('app/modules/core/layout/config');
    this.mkdir('app/modules/core/layout/views');  
    this.mkdir('app/modules/home');
  },

  install: function () {
    this.installDependencies();
  }
});
