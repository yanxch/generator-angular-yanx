(function () {
  'use strict';

  angular
    .module('app.core')
    .config(LayoutRouter);

  /*@ngInject*/
  function LayoutRouter($stateProvider) {
    $stateProvider
      .state('container', containerLayout())
      .state('container_header', containerHeaderLayout())
      .state('container_header_sidebar', containerHeaderSidebarLayout());
      
      function containerLayout(){
        return {
          abstract: true,
          templateUrl: 'modules/core/layout/views/container.html'
        };
      } 
      
      function containerHeaderLayout() {
        return {
          views: {
            '': {
                abstract: true,
                templateUrl: 'modules/core/layout/views/container_header.html',
            },
            'header@container_header': {
                template: '<navbar></navbar>'
            }
          }
        };
      }
      
      function containerHeaderSidebarLayout() { 
        return {
          views: {
            '': {
                abstract: true,
                templateUrl: 'modules/core/layout/views/container_header_sidebar.html'
            },
            'header@container_header_sidebar': {
                template: '<navbar></navbar>'
            },
            'sidebar@container_header_sidebar': {
                template: '<sidebar></sidebar>'
            }  
          }
        };
      }
  }

})();
