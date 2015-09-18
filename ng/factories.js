angular
.module('CCVideoApp')
.factory('statusFactory', function ($http, $q) {
	var service = {};
	var _users = '';

	// var dataUrl = "/DesktopModules/Calvary_VideoCourse/data/users.json";
	var dataUrl = "/DesktopModules/Calvary_VideoCourse/API/Calvary_VideoCourse/";

	// GET - SET - UPDATE
	this.setUsers = function (users) {
		_users = users;
	}
	this.getUsers = function () {
		return _users;
	}
	service.callUsersData = function () {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: dataUrl + "GetListOfUsers"
	    }).success(function(data) {
			deferred.resolve(data);
	    }).error(function() {
			console.log('There was an error getting the users.');
	    });
		return deferred.promise;
	}
	return service;
})
.factory('usersFactory', function ($http, $q) {
	var service = {};
	var _users = '';
	var _userName = '';
	var _userId = '';
	var _courseComplete = [];
	var _videosComplete = [];

	// var dataUrl = "/DesktopModules/Calvary_VideoCourse/data/users.json";
	var dataUrl = "/DesktopModules/Calvary_VideoCourse/API/Calvary_VideoCourse/";


	// GET - SET - UPDATE
	service.setUsersData = function (videoDto) {
		var sf = $.ServicesFramework(moduleId);
		return $http({
			method: 'POST',
			url: dataUrl + "SaveComplete",
			data: videoDto
		});
	};


	// GET - SET - UPDATE
	this.setUsers = function (users) {
		_users = users;
	}
	this.getUsers = function () {
		return _users;
	}
	service.callUsersData = function () {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: dataUrl + "GetVideosComplete"
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function () {
			console.log('There was an error getting the users.');
		})
		return deferred.promise;
	}
	return service;
})
.factory('myInterceptor', ['$log', function ($log) {
	// var sessionInjector = {
	// 	request: function (config) {
	// 		
	// 			config.headers = sf.;
	// 		return config;
	// 	}
	// };
	// return sessionInjector;
}])
.factory('videosFactory', function ($http, $q) {
	var service = {};

	//var dataUrl = "/DesktopModules/Calvary_VideoCourse/data/videos.json";
	var dataUrl = "/DesktopModules/Calvary_VideoCourse/API/Calvary_VideoCourse/";

	// GET - SET - UPDATE
	service.setVideos = function (videos) {
		var sf = $.ServicesFramework(moduleId);

		return $http({
			method: 'POST',
			url: dataUrl + 'AddVideo?moduleId=' + moduleId,
			data: JSON.stringify(videos)
		});
	};

	// Delete Video
	service.deleteVideo = function (videoToDelete) {
		var sf = $.ServicesFramework(moduleId);

		return $http({
			method: 'POST',
			url: dataUrl + 'DeleteVideo',
			headers: {
				"Content-Type": "application/json"
			},
			data: angular.fromJson(videoToDelete)
		});
	}

	this.getVideos = function () {
		return _videos;
	}
	service.callVideosData = function () {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: dataUrl + 'GetVideos?moduleId=' + moduleId
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function () {
			console.log('There was an error getting the videos.');
		});
		return deferred.promise;
	}
	return service;
})
.factory('categoriesFactory', function ($http, $q) {
	var service = {};

	var dataUrl = "/DesktopModules/Calvary_VideoCourse/API/Calvary_VideoCourse/GetAllGroups";

	// GET - SET - UPDATE
	this.setCategories = function (categories) {
		_categories = categories;
	}

	this.getCategories = function () {
		return _categories;
	}
	service.callCategoriesData = function () {
		var deferred = $q.defer();
		$http({
			method: 'GET',
	        url: dataUrl
	    }).success(function(data) {
			deferred.resolve(data);
	    }).error(function() {
			console.log('There was an error getting the categories');
	    });
		return deferred.promise;
	}
	return service;
})
.factory('emailFactory', function ($http, $q) {
	var service = {};

	// var dataUrl = "/DesktopModules/Calvary_VideoCourse/data/users.json";
	var dataUrl = "/DesktopModules/Calvary_VideoCourse/API/Calvary_VideoCourse/";

	// GET - SET - UPDATE
	service.sendEmail = function (subjectTitle) {
		return $http({
			method: 'POST',
			url: dataUrl + "SendEmail",
			data: subjectTitle
		});
	};


	// // GET - SET - UPDATE
	// this.setUsers = function (users) {
	// 	_users = users;
	// }
	// this.getUsers = function () {
	// 	return _users;
	// }
	service.callUsersData = function () {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: dataUrl + "GetVideosComplete"
	    }).success(function(data) {
			deferred.resolve(data);
	    }).error(function() {
			console.log('There was an error getting the users.');
	    });
		return deferred.promise;
	}
	return service;
})
.factory('vimeoFactory', function ($http, $q) {
	var service = {};
	var _vimeo = '';

	var dataUrl = 'https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/';

	// GET - SET - UPDATE
	//this.setVimeo = function (vimeo) {
	//	_vimeo = vimeo;
	//}

	this.getVimeo = function () {
		return _vimeo;
	}
	service.callVimeoData = function (vimeoApiUrl) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: dataUrl + vimeoApiUrl
	    }).success(function(data) {
			deferred.resolve(data);
	    }).error(function() {
			console.log('There was an error getting the vimeo information');
	    });
		return deferred.promise;
	}
	return service;
});