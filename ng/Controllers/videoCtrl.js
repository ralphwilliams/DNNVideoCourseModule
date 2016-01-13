/// <reference path="C:\websites\dnndev.me\Website\DesktopModules\Calvary_VideoCourse\Scripts/angular.js" />
angular
	.module('videoControllers', [])
	.controller('videoCtrl', ['$scope', '$http', 'usersFactory', 'rolesFactory', 'videosFactory', 'categoriesFactory', 'vimeoFactory', 'localizationFactory', 'profileFactory', '$location',
	function ($scope, $http, usersFactory, rolesFactory, videosFactory, categoriesFactory, vimeoFactory, localizationFactory, profileFactory, $location, $sce) {

		// #region Test for Edit Mode

		if (typeof editMode !== 'undefined') {
			$scope.editMode = true;
		} else {
			$scope.editMode = false;
		}

		// #endregion

		// #region Get Data from sources

		// Get user's completed videos
		usersFactory.callUsersData()
			.then(function (data) {
				$scope.videosComplete = angular.fromJson(data);
				loadCats();
			}, function (data) {
				console.log('Error Getting User Data');
				//console.log(data);
			});
		// Get categories
		var loadCats = function () {
			categoriesFactory.callCategoriesData()
				.then(function(data) {
				$scope.categories = angular.fromJson(data);
					angular.forEach($scope.categories, function(valueCategory, keyCategory) {
					valueCategory.RoleGroupName = valueCategory.RoleGroupName.replace('CCV_', '');
				});
				loadVids();
				}, function(data) {
				alert(data);
				});
		}

		// Get videos
		var loadVids = function () {
			videosFactory.callVideosData()
			.then(function (data) {
				$scope.videos = angular.fromJson(data);
				buildVideoList($scope.videos);
			}, function (data) {
				alert(data);
			})
		}

		// Get Vimeo data
		function callVimeo(vimeoId, video, videoId, completedVideos, loadVimeoList) {
			vimeoFactory.callVimeoData(vimeoId, video)
			.then(function (data) {
				$scope.vimeo = data;
				loadVimeoList(data, video, videoId, completedVideos);
			}, function (data) {
				alert('vimeo Ajax Fail');
			});
		}

		// Add New Roles
		function addProfileProperty() {
			profileFactory.addProfileProperty()
				.success(function () {
					console.log('add success');
				}).
				error(function (error) {
					$scope.status = 'Unable to Create new Role: ' + error.message;
					console.log();
				});
		}
		$scope.testProfile = function() {
			addProfileProperty();
		}
		// Add New Role Groups
		function addRoleGroup(NewRoleGroupDTO) {
			rolesFactory.addNewRoleGroup(NewRoleGroupDTO)
				.success(function () {
					loadCats();
				}).
				error(function (error) {
					$scope.status = 'Unable to Create new Role Group: ' + error.message;
					console.log(NewRoleGroupDTO);
				});
		}

		// Get Localization Resources
		localizationFactory.callResx()
		.then(function (data) {
			$scope.resx = angular.fromJson(data.ClientResources);
		}, function (data) {
			alert(data);
		})

		// #endregion


		// #region Load Video List

		// update initial video list with Vimeo data
		var buildVideoList = function (videos) {

			for (var i = 0; i < $scope.videos.length; i++) {

				// Update videos objects with Vimeo data
				function loadVimeoList(data, video) {
					video.description = data.description;
					video.thumbnail_url = data.thumbnail_url;
					video.duration = $scope.showDuration();
					video.title = data.title;
				}

				// Get Vimeo data for each video
				callVimeo($scope.videos[i].VimeoId, $scope.videos[i], $scope.videos[i].VideoId, $scope.videosComplete, loadVimeoList)

				// convert duration to minutes
				$scope.showDuration = function () {
					var time = $scope.vimeo.duration;
					return convertToMinutes(time);
				}
			}

			// Once initial video list is updated with Vimeo data, 
			// Add updated video list to categories/roles objects
			$scope.videoList($scope.videos);

		}


		// Create Video List
		$scope.videoList = function (videos) {

			// show or hide list depending onf if courses and categories list exists
			$scope.noCourses = $scope.categories.length > 0 ? false : true;
			if ($scope.noCourses == true && $scope.editMode == true) {
				$location.path('/categories/');
			}


			// Iterate through each Category
			angular.forEach($scope.categories, function (valueCategory, keyCategory) {

				// Trim Category name

				// Iterate through each Role
				angular.forEach($scope.categories[keyCategory].Roles, function (valueCourse, keyCourse) {

					// Set courseId to RoleID
					$scope.categories[keyCategory].Roles[keyCourse].CourseId = valueCourse.RoleID;

					// Create link for Managing users in roles
					var roleLink = "/Admin/Security-Roles/ctl/User%2520Roles/mid/392/RoleId/" +
										valueCourse.RoleID +
										"?popUp=true";
					var roleAction = "javascript:dnnModal.show('" + roleLink + "',/*showReturn*/false,550,950,false,'')";

					$('#roleEdit_' + valueCourse.RoleID).attr('href', roleAction);

					// Iterate through list of videos
					var videoList = [];
					angular.forEach($scope.videos, function (valueVideo, keyVideo) {

						// Check to see that video is in the course
						if (valueVideo.CourseId == valueCourse.RoleID) {
							// Iterate through list of user's completed videos and set the video to complete
							for (var j = 0; j < $scope.videosComplete.length; j++) {
								if (valueVideo.complete != true) {
									valueVideo.complete = $scope.videosComplete[j] == valueVideo.VideoId ? true : false;
								}
							}

							// Create list of updated videos
							videoList.push(valueVideo);
						}
					}, videoList);

					// Sort the videos
					videoList.sort(function (a, b) {
						return a.OrderIndex > b.OrderIndex;
					});

					// Find Next Video to watch
					var orderBig = 0;

					// If first video is not complete, mark as isNext
					// Else, iterate through each video and find the first 
					// video that is not complete, then break from loop
					if (videoList.length > 0 && videoList[0].complete != true) {
						videoList[0].isNext = true;
					} else {
						for (var i = 0; i < videoList.length; i++) {
							if (videoList[i].complete != true) {
								videoList[i].isNext = true;
								break;
							};
						}
					}

					// Populate videos in roles with new video list
					$scope.categories[keyCategory].Roles[keyCourse].videos = videoList;
				});
			});
		}

		// #endregion 

		// #region Edit Course and Category mode
		$scope.editCourseMode = true;

		$scope.addCourseName = true;
		$scope.toggleAddCourseName = function () {
			$scope.addCourseName = $scope.addCourseName === false ? true : false;
		};

		$scope.editCourseName = true;
		$scope.toggleEditCourseName = function () {
			$scope.editCourseName = $scope.editCourseName === false ? true : false;
		};

		$scope.addCategoryMode = true;
		$scope.toggleAddCategoryMode = function () {
			$scope.addCategoryMode = $scope.addCategoryMode === false ? true : false;
		};

		$scope.editCategoryName = true;
		$scope.toggleEditCategoryName = function () {
			$scope.editCategoryName = $scope.editCategoryName === false ? true : false;
		};



		// #endregion

		// #region Show Duration helper function

		$scope.showDuration = function () {
			var time = $scope.selectedVimeo.duration;
			var minutes = Math.floor(time / 60);
			var seconds = time - minutes * 60;
			var hours = Math.floor(time / 3600);
			time = time - hours * 3600;
			function str_pad_left(string, pad, length) {
				return (new Array(length + 1).join(pad) + string).slice(-length);
			}

			var finalTime = str_pad_left(minutes, '', 2) + ':' + str_pad_left(seconds, '0', 2);
			return finalTime;
		}

		// #endregion

	}]);