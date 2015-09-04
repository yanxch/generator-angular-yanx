(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('NavbarController', NavbarController);

  /*@ngInject*/

  function NavbarController() {

    /*jshint validthis: true */
    var vm = this;
	
	vm.entries = entries();
	
	function entries(){
		return [
                {
                    name: 'Search',
                    href: '#/search',
                    icon: 'search',
                    active: false
                },
                {
                    name: 'Folders',
                    href: '#/ablage',
                    icon: 'clear_all',
                    active: false
                },
                {
                    name: 'Inbox',
                    href: '#/inbox',
                    icon: 'business',
                    active: false
                },
                {
                    name: 'User Management',
                    href: '#/usermanagement',
                    icon: 'clear_all',
                    active: false
                }
            ];
	} 

  }
  
})();
