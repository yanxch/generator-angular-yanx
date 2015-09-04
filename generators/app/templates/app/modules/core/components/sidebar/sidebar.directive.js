(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('sidebar', Sidebar);

    function Sidebar() {
        return {
            restrict: 'E',
            templateUrl: 'modules/core/components/sidebar/sidebar.html',
            controller: SidebarController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {}
        };

        function SidebarController($location) {
            var vm = this;
            
            vm.isActiveItem = isActiveItem;
            vm.items = [
                    {
                        name: 'User Management',
                        href: '#/entry1',
                        icon: 'group'
                    },
                    {
                        name: 'Controlling',
                        href: '#/entry2',
                        icon: 'local_florist'
                    }];

            function isActiveItem(item) {
                if (item.href === ('#' + $location.url())) {
                    return true;
                }

                return false;
            }
        }
    }

})();