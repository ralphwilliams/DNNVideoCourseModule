$('body').attr('ng-app', 'DVCideoApp');

'use strict';
var convertToMinutes = function (n) { function i(n, t, i) { return (new Array(i + 1).join(t) + n).slice(-i) } var t = Math.floor(n / 60), r = n - t * 60, u = Math.floor(n / 3600); return n = n - u * 3600, i(t, "", 2) + ":" + i(r, "0", 2) };
/* App Module */

angular
	.module('DVCideoApp', [
		'ngRoute',
		'ngSanitize',
		'videoControllers',
		'ui.sortable',
		'ui.bootstrap'
	])
	.config(['$routeProvider', '$httpProvider',
		function ($routeProvider) {
			$routeProvider
			.when('/videos/:VideoId', {
				templateUrl: '/DesktopModules/DNNVideoCourse/ng/Views/videoPlayerView.html',
				controller: 'videoPlayerCtrl'
			})
			.when('/courses/:courseId', {
				templateUrl: '/DesktopModules/DNNVideoCourse/ng/Views/editCourseView.html',
				controller: 'editCourseCtrl'
			})
			.when('/categories', {
				templateUrl: '/DesktopModules/DNNVideoCourse/ng/Views/editCategories.html',
				controller: 'editCategoriesCtrl'
			})
			.when('/status', {
				templateUrl: '/DesktopModules/DNNVideoCourse/ng/Views/statusView.html',
				controller: 'statusCtrl'
			})
			.when('/questions/:VideoId', {
			    templateUrl: '/DesktopModules/DNNVideoCourse/ng/Views/editQuestionsView.html',
			    controller: 'editQuestionsCtrl'
			})
			.when('/answers/:CourseId', {
			    templateUrl: '/DesktopModules/DNNVideoCourse/ng/Views/answerListView.html',
			    controller: 'answerListCtrl'
			})
            .when('/answers/:CourseId/user/:UserId', {
			    templateUrl: '/DesktopModules/DNNVideoCourse/ng/Views/answerListView.html',
			    controller: 'answerListCtrl'
			})
			.otherwise({
				templateUrl: '/DesktopModules/DNNVideoCourse/ng/Views/videoListView.html',
				controller: 'videoCtrl'
			});
		}]);


