/// <reference path="C:\websites\dnndev.me\Website\DesktopModules\Calvary_VideoCourse\Scripts/angular.js" />
angular
	.module('videoControllers')
	.controller('editCourseCtrl', ['$scope', '$routeParams', '$http', '$sce', 'vimeoFactory', '$location', 'videosFactory', 'categoriesFactory', 'localizationFactory',
function ($scope, $routeParams, $http, $sce, vimeoFactory, $location, videosFactory, categoriesFactory, localizationFactory) {

	// #region Controller Global Variables
	thisCourse = parseInt($routeParams.courseId);
	if (typeof editMode !== 'undefined') {
		$scope.editMode = true;
	} else {
		$scope.editMode = false;
	}

	// #endregion 

	// #region Get Data from sources

	// Get video Data
	function getVideoData() {
		videosFactory.callVideosData()
		.then(function (data) {
			$scope.videos = angular.fromJson(data);
			buildVideoList($scope.videos);
		}, function (data) {
			alert(data);
		})
	}
	getVideoData();

	function saveNewVideo(newVideo) {
		videosFactory.setVideos(newVideo)
			.success(function () {
				$scope.status = 'Inserted Video! Refreshing video list.';
				vimeoFactory.callVimeoData(newVideo.VimeoId);
				$scope.videos.push(newVideo);
			}).
			error(function (error) {
				$scope.status = 'Unable to insert video: ' + error.message;
			});
	}

	// Get Vimeo Data
	function callVimeo(vimeoId, video, videoId, loadVimeoList) {
		vimeoFactory.callVimeoData(parseInt(vimeoId), video)
		.then(function (data) {
			$scope.vimeo = data;
			loadVimeoList(data, video, videoId);
		}, function (data) {
			alert('vimeo Ajax Fail');
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

	$scope.editVideo = true;
	$scope.toggleEditVideo = function () {
		$scope.editVideo = $scope.editVideo === false ? true : false;
	};

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
		    callVimeo(parseInt($scope.videos[i].VimeoId), $scope.videos[i], $scope.videos[i].videoId, loadVimeoList);

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
		// Iterate throuh list of videos
		var videoList = [];
		angular.forEach($scope.videos, function (valueVideo, keyVideo) {

			// Check to see that video is in the course
			if (valueVideo.CourseId == thisCourse) {

				// Create list of updated videos
				videoList.push(valueVideo);

			}
		}, videoList);

		// Populate videos in roles with new video list
		$scope.videos = videoList;

		// #region Drag and Drop directive

		function assignOrder() {
			angular.forEach($scope.videos, function (value, key) {
				value.OrderIndex = key;
				var video = value;
				$scope.editVimeo(video);
			}, $scope.videos);
		}

		// Sortable directive
		$scope.sortableOptions = {
			handle: '> .video-drag-handle',
			placeholder: "sortable-placeholder",
			helper: 'helper',
			forceHelperSize: true,
			update: function (e, ui) {
			},
			stop: function (e, ui) {
				assignOrder();
			}
		};

		// #endregion

		function loadVimeo(vimeoId, video) {
			video.title = $scope.vimeo.title;
			video.description = $scope.vimeo.description;
			video.thumbnail_url = $scope.vimeo.thumbnail_url;
		}

		// #region Edit Vimeo

		$scope.editVimeo = function (video) {

			// updated Video Class
			function updateVideo(video) {
				this.VideoId = video.VideoId;
				this.VimeoId = parseInt(video.VimeoId);
				this.CourseId = video.CourseId;
				this.OrderIndex = video.OrderIndex;
				this.ModuleId = moduleId;
				// this.CreatedOnDate = currentDate;
				// this.CreatedByUserId = currentUser;
				// this.LastModifiedOnDate = currentDate;
				// this.LastModifiedByUserId = currentUser;
			}

			// Create updated video object
			var updatedVideo = new updateVideo(video);

			// Save video updated video object
			videosFactory.setVideos(updatedVideo)
				.success(function () {
					$scope.status = 'Upadated Video! Refreshing video list.';
					loadVimeo(video.VimeoId, $scope.videos);
				}).
				error(function (error) {
					$scope.status = 'Unable to insert video: ' + error.message;
				});

			function loadVimeoList(data, video) {
				video.description = data.description;
				video.thumbnail_url = data.thumbnail_url;
				video.duration = $scope.showDuration();
				video.title = data.title;
			}

		    callVimeo(parseInt(video.VimeoId), video, video.VideoId, loadVimeoList);

		};

		// #endregion

		// #region Add new video

		$scope.addNewVideo = function () {

			// Video object constructor
			function Video(videos, courseId, vimeoId, orderIndex) {
				this.OrderIndex = orderIndex;
				this.CourseId = courseId;
				this.VimeoId = vimeoId;
				this.ModuleId = moduleId;
			}

			// Service for getting Vimeo Data
			function callVimeo(vimeoId, currentVideo) {
				vimeoFactory.callVimeoData(parseInt(vimeoId))
				.then(function (data) {
					$scope.vimeo = data;
					function loadVimeoList(data, currentVideo) {
						currentVideo.description = data.description;
						currentVideo.thumbnail_url = data.thumbnail_url;
						currentVideo.duration = $scope.showDuration();
						currentVideo.title = data.title;
					}
					loadVimeoList(data, currentVideo);
					getVideoData();
				}, function (data) {
					alert('vimeo Ajax Fail');
				});
			}

			// Create temporary new id (does not save to db)
			var newIndex = $scope.videos.length;


			var newVideo = new Video(videos, thisCourse, parseInt($scope.newVimeoId), newIndex);

			function saveNewVideo(newVideo, newIndex) {
				vimeoId = newVideo.VimeoId;
				videosFactory.setVideos(newVideo, vimeoId)
					.success(function () {
						$scope.status = 'Inserted Video! Refreshing video list.';
						$scope.videos.push(newVideo);
						callVimeo(vimeoId, $scope.videos[newIndex]);
					}).
					error(function (error) {
						$scope.status = 'Unable to insert video: ' + error.message;
					});
			}


			saveNewVideo(newVideo, newIndex);
			$scope.newVimeoId = '';

		}

		// #endregion

		// #region Remove Video
			
		$scope.removeVideo = function (item) {
			var index = $scope.videos.indexOf(item);
			var videoToDelete = item;
			$scope.videos.splice(index, 1);
			videosFactory.deleteVideo(videoToDelete);

			// Sort the videos
			$scope.videos.sort(function (a, b) {
				return a.OrderIndex > b.OrderIndex;
			});

			assignOrder();

			// buildVideoList($scope.videos);
		}

		// #endregion

	}

	// #endregion 

}]);