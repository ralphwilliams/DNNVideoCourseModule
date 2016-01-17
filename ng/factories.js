angular
.module('CCVideoApp')
.factory('statusFactory', function ($http, $q) {
	var service = {};
	var _users = '';

	// var dataUrl = "/DesktopModules/Calvary_VideoCourse/data/users.json";
	var dataUrl = "/DesktopModules/Calvary_VideoCourse/API/Calvary_VideoCourse/";

	// DNN Services Framework
	var $self = this;
	if ($.ServicesFramework) {
		var _sf = $.ServicesFramework(moduleId);
		$self.ServiceRoot = _sf.getServiceRoot(moduleName);
		$self.ServicePath = $self.ServiceRoot + "Event/";
		$self.Headers = {
			"ModuleId": moduleId,
			"TabId": _sf.getTabId(),
			"RequestVerificationToken": _sf.getAntiForgeryValue()
		};
	}

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
			url: dataUrl + "GetListOfUsers",
			headers: $self.Headers
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

	// DNN Services Framework
	var $self = this;
	if ($.ServicesFramework) {
		var _sf = $.ServicesFramework(moduleId);
		$self.ServiceRoot = _sf.getServiceRoot(moduleName);
		$self.ServicePath = $self.ServiceRoot + "Event/";
		$self.Headers = {
			"ModuleId": moduleId,
			"TabId": _sf.getTabId(),
			"RequestVerificationToken": _sf.getAntiForgeryValue()
		};
	}

	// GET - SET - UPDATE
	service.setUsersData = function (videoDto) {
		var sf = $.ServicesFramework(moduleId);
		return $http({
			method: 'POST',
			url: dataUrl + "SaveComplete",
			headers: $self.Headers,
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
			url: dataUrl + "GetVideosComplete",
			headers: $self.Headers
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function () {
			console.log('There was an error getting the users.');
		})
		return deferred.promise;
	}
	return service;
})
.factory('rolesFactory', function ($http, $q) {
	var service = {};
	var _users = '';
	var _userName = '';
	var _userId = '';

	var dataUrl = "/DesktopModules/Calvary_VideoCourse/API/Calvary_VideoCourse/";

	// DNN Services Framework
	var $self = this;
	if ($.ServicesFramework) {
		var _sf = $.ServicesFramework(moduleId);
		$self.ServiceRoot = _sf.getServiceRoot(moduleName);
		$self.ServicePath = $self.ServiceRoot + "Event/";
		$self.Headers = {
			"ModuleId": moduleId,
			"TabId": _sf.getTabId(),
			"RequestVerificationToken": _sf.getAntiForgeryValue()
		};
	}

	// GET - SET - UPDATE
	service.editRole = function (NewRolesDTO) {
		var sf = $.ServicesFramework(moduleId);
		return $http({
			method: 'POST',
			url: dataUrl + "EditRole",
			headers: $self.Headers,
			data: NewRolesDTO
		});
	};
	service.editRoleGroup = function (NewRoleGroupDTO) {
		var sf = $.ServicesFramework(moduleId);
		return $http({
			method: 'POST',
			url: dataUrl + "EditRoleGroup",
			headers: $self.Headers,
			data: NewRoleGroupDTO
		});
	};
	return service;
})
.factory('myInterceptor', ['$log', function ($log) {
	// DNN Services Framework
	var $self = this;
	if ($.ServicesFramework) {
		var _sf = $.ServicesFramework(moduleId);
		$self.ServiceRoot = _sf.getServiceRoot(moduleName);
		$self.ServicePath = $self.ServiceRoot + "Event/";
		$self.Headers = {
			"ModuleId": moduleId,
			"TabId": _sf.getTabId(),
			"RequestVerificationToken": _sf.getAntiForgeryValue()
		};
	}

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

	// DNN Services Framework
	var $self = this;
	if ($.ServicesFramework) {
		var _sf = $.ServicesFramework(moduleId);
		$self.ServiceRoot = _sf.getServiceRoot(moduleName);
		$self.ServicePath = $self.ServiceRoot + "Event/";
		$self.Headers = {
			"ModuleId": moduleId,
			"TabId": _sf.getTabId(),
			"RequestVerificationToken": _sf.getAntiForgeryValue()
		};
	}

	// GET - SET - UPDATE
	service.setVideos = function (videos) {
		var sf = $.ServicesFramework(moduleId);

		return $http({
			method: 'POST',
			url: dataUrl + 'AddVideo?moduleId=' + moduleId,
			headers: $self.Headers,
			data: JSON.stringify(videos)
		});
	};

	// Delete Video
	service.deleteVideo = function (videoToDelete) {
		var sf = $.ServicesFramework(moduleId);

		return $http({
			method: 'POST',
			url: dataUrl + 'DeleteVideo',
			headers: $self.Headers,
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
			url: dataUrl + 'GetVideos?moduleId=' + moduleId,
			headers: $self.Headers
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

	// DNN Services Framework
	var $self = this;
	if ($.ServicesFramework) {
		var _sf = $.ServicesFramework(moduleId);
		$self.ServiceRoot = _sf.getServiceRoot(moduleName);
		$self.ServicePath = $self.ServiceRoot + "Event/";
		$self.Headers = {
			"ModuleId": moduleId,
			"TabId": _sf.getTabId(),
			"RequestVerificationToken": _sf.getAntiForgeryValue()
		};
	}

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
			url: dataUrl,
			headers: $self.Headers
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function () {
			console.log('There was an error getting the categories');
		});
		return deferred.promise;
	}
	return service;
})
.factory('localizationFactory', function ($http, $q) {
	var service = {};

	var dataUrl = "/DesktopModules/Calvary_VideoCourse/API/Calvary_VideoCourse/ResxData";


	// DNN Services Framework
	var $self = this;
	if ($.ServicesFramework) {
		var _sf = $.ServicesFramework(moduleId);
		$self.ServiceRoot = _sf.getServiceRoot(moduleName);
		$self.ServicePath = $self.ServiceRoot + "Event/";
		$self.Headers = {
			"ModuleId": moduleId,
			"TabId": _sf.getTabId(),
			"RequestVerificationToken": _sf.getAntiForgeryValue()
		};
	}

	// GET 
	this.getResx = function () {
		return _RESX;
	}
	service.callResx = function () {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: dataUrl,
			headers: $self.Headers
		}).success(function (data) {
			deferred.resolve(data);
		}).error(function () {
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

	// DNN Services Framework
	var $self = this;
	if ($.ServicesFramework) {
		var _sf = $.ServicesFramework(moduleId);
		$self.ServiceRoot = _sf.getServiceRoot(moduleName);
		$self.ServicePath = $self.ServiceRoot + "Event/";
		$self.Headers = {
			"ModuleId": moduleId,
			"TabId": _sf.getTabId(),
			"RequestVerificationToken": _sf.getAntiForgeryValue()
		};
	}

	// GET - SET - UPDATE
	service.sendEmail = function (subjectTitle) {
		return $http({
			method: 'POST',
			url: dataUrl + "SendEmail",
			headers: $self.Headers,
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
			url: dataUrl + "GetVideosComplete",
			headers: $self.Headers
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