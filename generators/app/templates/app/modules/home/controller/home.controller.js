(function () {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);


    /*@ngInject*/
    function HomeController() {
        var vm = this;
		vm.test = 'Test output';
        console.log('Hermann');
    }
	
})();
