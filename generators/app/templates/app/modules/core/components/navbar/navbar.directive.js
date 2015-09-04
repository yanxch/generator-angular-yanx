(function() {
'use strict';

	angular
		.module('app.core')
		.directive('navbar', NavbarDirective);
		
	function NavbarDirective() {
		return {
			restrict: 'E',
			controller: 'NavbarController',
			controllerAs: 'vm',
			templateUrl: 'modules/core/components/navbar/navbar.html',
			bindToController: true,
			link: link
		};
		
		function link(scope, element, attrs) {
	
		}
	}	
	
})();