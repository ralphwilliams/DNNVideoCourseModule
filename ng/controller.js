angular
	.controller('editCourseCtrl', ['$scope', '$routeParams', '$http', '$sce', 'vimeoFactory', '$location', 'videosFactory', 'coursesFactory', 'categoriesFactory',
	function ($scope, $routeParams, $http, $sce, vimeoFactory, $location, videosFactory, coursesFactory, categoriesFactory) {

		$scope.selectedCourseID = parseInt($routeParams.courseId);

		// #region Get Data from sources

		var loadCats = function () {
			categoriesFactory.callCategoriesData()
			.then(function (data) {
				$scope.categories = angular.fromJson(data);
				loadVids();
			}, function (data) {
				alert(data);
			})
		}
			loadCats();

		var loadVids = function () {
			videosFactory.callVideosData()
			.then(function (data) {
				$scope.videos = angular.fromJson(data);
				buildVideoList($scope.videos);
			}, function (data) {
				alert(data);
			})
		}


		// #endregion

		// #region Load Video List

		var buildVideoList = function (videos) {
			// var completedVideos = $scope.videosComplete;

			var i = 0;
			while (i < $scope.videos.length) {
				if ($scope.selectedCourseID == $scope.videos[i].courseId) {
					var vimeoId = $scope.videos[i].vimeoId;
					var videoId = $scope.videos[i].videoId;
					function callVimeo(vimeoId, videos, i) {
						vimeoFactory.callVimeoData(vimeoId, videos[i])
						.then(function (data) {
							$scope.vimeo = data;
							loadVimeoList(data, i, videoId);
						}, function (data) {
							alert('vimeo Ajax Fail');
						});
					}
					callVimeo(vimeoId, videos, i)

					$scope.showDuration = function () {
						var time = $scope.vimeo.duration;
						return convertToMinutes(time);
					}

					function loadVimeoList(data, i, videoId) {
						$scope.videos[i].description = data.description;
						$scope.videos[i].thumbnail_url = data.thumbnail_url;
						$scope.videos[i].duration = $scope.showDuration();
						$scope.videos[i].title = data.title;
						var videoId = $scope.videos[i].videoId;
					}
				}
				i++;
			}
			console.log('editing');
			$scope.courseList($scope.videos);
			$scope.list = $scope.courseVideos;
			$scope.sortingLog = [];
			$scope.sortableOptions = {
				handle: '> .video-drag-handle',
				placeholder: "sortable-placeholder",
				helper: 'helper',
				forceHelperSize: true,
				update: function (e, ui) {
					// var logEntry = $scope.list.map(function (i) {
					// 	return i.value;
					// }).join(', ');
					// $scope.sortingLog.push('Update: ' + logEntry);
					//console.log('update - $scope.sortingLog');
					//console.log($scope.sortingLog);
				},
				stop: function (e, ui) {
					for (var index in $scope.courseVideos) {
						if (typeof ($scope.courseVideos[index]) == 'object') {
							console.log('sorting')
							$scope.courseVideos[index].i = index;
							//var video = $scope.courseVideos[index];
							//$scope.editVimeo(index, video);
						}
					}

					// logModels();
					updateorderIndex();

					// TODO: Save List

					//console.log('stop - $scope.sortingLog');
					//console.log($scope.sortingLog);
				}
			};
			//#region MOVED CODE

			function updateorderIndex() {
				angular.forEach($scope.courseVideos, function (value, key) {
					$scope.courseVideos[key].orderIndex = key;
					var video = $scope.courseVideos[key];
					$scope.editVimeo(key, video);
				});
			}

			$scope.courseVideos.sort(function (a, b) {
				return a.orderIndex > b.orderIndex;
			});
			function loadVimeo(id, vimeoId, videoArray) {
				$scope.showDuration = function () {
					var time = $scope.vimeo.duration;
					return convertToMinutes(time);
				}
				// console.log($scope.vimeo);
				videoArray[id].title = $scope.vimeo.title;
				videoArray[id].description = $scope.vimeo.description;
				videoArray[id].thumbnail_url = $scope.vimeo.thumbnail_url;
				videoArray[id].duration = $scope.showDuration();
				function Video(videos, videoId, courseId, vimeoId, orderIndex, id) {
					this.orderIndex = orderIndex;
					this.videoId = videoId;
					this.courseId = courseId;
					this.vimeoId = vimeoId;
				}
				$scope.courseVideos.push(
					new Video(videoArray[id].orderIndex, videoArray[id].videoId, videoArray[id].courseId, vimeoId, id)
				)
				if (id == videoArray.length - 1) {
					//buildCourse();
					//loadView();
					//buildVideoList($scope.videos);
				}
			}


			$scope.editVimeo = function (id, video) {
				$scope.editVideo = true;
				console.log('test the edit');

				// TODO: Save video
				var newVideo = new updateVideo(video);
				videosFactory.setVideos(newVideo)
					.success(function () {
						$scope.status = 'Upadated Video! Refreshing video list.';
						//$scope.buildList(id, $scope.courseVideos);
						loadVimeo(id, video.vimeoId, $scope.courseVideos);
					}).
					error(function (error) {
						$scope.status = 'Unable to insert video: ' + error.message;
					});



				//$scope.buildList(id, $scope.courseVideos);
				loadVimeo(id, video.vimeoId, $scope.courseVideos);
			};


			$scope.list = $scope.courseVideos;
			$scope.sortingLog = [];
			$scope.sortableOptions = {
				handle: '> .video-drag-handle',
				placeholder: "sortable-placeholder",
				helper: 'helper',
				forceHelperSize: true,
				update: function (e, ui) {
					// var logEntry = $scope.list.map(function (i) {
					// 	return i.value;
					// }).join(', ');
					// $scope.sortingLog.push('Update: ' + logEntry);
					//console.log('update - $scope.sortingLog');
					//console.log($scope.sortingLog);
				},
				stop: function (e, ui) {
					for (var index in $scope.courseVideos) {
						if (typeof ($scope.courseVideos[index]) == 'object') {
							$scope.courseVideos[index].i = index;
							//var video = $scope.courseVideos[index];
							//$scope.editVimeo(index, video);
						}
					}

					// logModels();
					updateorderIndex();

					// TODO: Save List

					//console.log('stop - $scope.sortingLog');
					//console.log($scope.sortingLog);
				}
			};


			function logModels() {
				var logEntry = $scope.courseVideos.map(function (i) {
					return i.txt + '(pos:' + i.i + ')';
				}).join(', ');
				$scope.sortingLog.push('Stop: ' + logEntry);
			}
			//console.log($scope.courseVideos);
s
			//#endregion
		}


		$scope.courseList = function (videos) {
				$scope.nextVideo = 0;
				$scope.courseVideos = [];
				angular.forEach($scope.videos, function (valueVideo, keyVideo) {
					var videoId = valueVideo.videoId;
					if (valueVideo.courseId == $scope.selectedCourseID) {
						$scope.courseVideos.push(valueVideo);
					}
				}, $scope.courseVideos);
		}

		// #endregion

		function Video() {
			//this.videoId = newVideoId;
			this.vimeoId = parseInt($scope.newVimeoId);
			this.orderIndex = $scope.courseVideos.length;
			this.courseId = $scope.selectedCourseID;
			this.ModuleId = moduleId;
			this.CreatedOnDate = currentDate;
			this.CreatedByUserId = currentUser;
			this.LastModifiedOnDate = currentDate;
			this.LastModifiedByUserId = currentUser;
		}

		function updateVideo(video) {
			this.videoId = video.videoId;
			this.vimeoId = video.vimeoId;
			this.courseId = video.courseId;
			this.orderIndex = video.orderIndex;
			this.ModuleId = moduleId;
			this.CreatedOnDate = currentDate;
			this.CreatedByUserId = currentUser;
			this.LastModifiedOnDate = currentDate;
			this.LastModifiedByUserId = currentUser;
		}


		$scope.byVideo = $scope.courseList;
		$scope.loadVideo = function () {

			function loadVimeo(id, vimeoId, videoArray) {
				$scope.showDuration = function () {
					var time = $scope.vimeo.duration;
					return convertToMinutes(time);
				}
				// console.log($scope.vimeo);
				videoArray[id].title = $scope.vimeo.title;
				videoArray[id].description = $scope.vimeo.description;
				videoArray[id].thumbnail_url = $scope.vimeo.thumbnail_url;
				videoArray[id].duration = $scope.showDuration();
				videoArray[id].complete = $scope.selectedUser.videosComplete.indexOf(id) > -1 ? true : false;
				function Video(videos, videoId, courseId, vimeoId, orderIndex, id) {
					this.orderIndex = orderIndex;
					this.videoId = videoId;
					this.courseId = courseId;
					this.vimeoId = vimeoId;
				}
				$scope.courseVideos.push(
					new Video(videoArray[id].orderIndex, videoArray[id].videoId, videoArray[id].courseId, vimeoId, id)
				)
				if (id == videoArray.length - 1) {
					//buildCourse();
					loadView();
				}
			}


			$scope.buildList = function (id, videoArray) {
				//console.log('videoArray');
				//console.log(videoArray);
					var vimeoId = videoArray[id].vimeoId;
					vimeoFactory.callVimeoData(vimeoId)
					.then(function (data) {
						$scope.vimeo = data;
						loadVimeo(id, videoArray[id].vimeoId, videoArray);
					}, function (data) {
						alert('vimeo Ajax Fail');
					})

				$scope.editVideo = true;
				$scope.toggleEditVideo = function () {
					$scope.editVideo = $scope.editVideo === false ? true : false;
				};

				//function Video() {
				//	this.vimeoId = video.vimeoId;
				//	this.courseId = $scope.selectedCourseID;
				//}
				$scope.editVimeo = function (id, video) {
					$scope.editVideo = true;

					// TODO: Save video
					var newVideo = new updateVideo(video);
					videosFactory.setVideos(newVideo)
						.success(function () {
							$scope.status = 'Upadated Video! Refreshing video list.';
							$scope.buildList(id, $scope.courseVideos);
							loadVimeo(id, video.vimeoId, $scope.courseVideos);
						}).
						error(function (error) {
							$scope.status = 'Unable to insert video: ' + error.message;
						});



					$scope.buildList(id, $scope.courseVideos);
					loadVimeo(id, video.vimeoId, $scope.courseVideos);
				};

				$scope.addNewVideo = function () {
					var newVideoId = 0;
					console.log('add new video');
					angular.forEach($scope.videos, function (value, key) {
						if ($scope.videos[key].videoId > newVideoId) {
							newVideoId = $scope.videos[key].videoId;
						}
					});
					newVideoId++;
					$scope.newVimeoId

					// TODO: Save List
					console.log(new Video().vimeoId);

					var newVideo =  new Video();
					videosFactory.setVideos(newVideo)
						.success(function () {
							$scope.status = 'Inserted Video! Refreshing video list.';
							vimeoFactory.callVimeoData(newVideo.vimeoId);
							$scope.courseVideos.push(newVideo);
						}).
						error(function (error) {
							$scope.status = 'Unable to insert video: ' + error.message;
						});

					$scope.newVimeoId = '';
					$scope.loadVideoList();



				}

				$scope.removeVideo = function (item) {
					var index = $scope.courseVideos.indexOf(item);
					var videoToDelete = item;
					$scope.courseVideos.splice(index, 1);
					//$scope.loadVideoList();
					videosFactory.deleteVideo(videoToDelete);
				}

			}

			$scope.onlyNumbers = '^[0-9]{9,9}$';

			function loadView() {
				function updateorderIndex() {
					angular.forEach($scope.courseVideos, function (value, key) {
						$scope.courseVideos[key].orderIndex = key;
						var video = $scope.courseVideos[key];
						$scope.editVimeo(key, video);
					});
				}

				$scope.courseVideos.sort(function (a, b) {
					return a.orderIndex > b.orderIndex;
				});


				$scope.editVimeo = function (id, video) {
					$scope.editVideo = true;

					// TODO: Save video
					var newVideo = new updateVideo(video);
					videosFactory.setVideos(newVideo)
						.success(function () {
							$scope.status = 'Upadated Video! Refreshing video list.';
							$scope.buildList(id, $scope.courseVideos);
							loadVimeo(id, video.vimeoId, $scope.courseVideos);
						}).
						error(function (error) {
							$scope.status = 'Unable to insert video: ' + error.message;
						});



					//$scope.buildList(id, $scope.courseVideos);
					loadVimeo(id, video.vimeoId, $scope.courseVideos);
				};


				$scope.list = $scope.courseVideos;
				$scope.sortingLog = [];
				$scope.sortableOptions = {
					handle: '> .video-drag-handle',
					placeholder: "sortable-placeholder",
					helper: 'helper',
					forceHelperSize: true,
					update: function (e, ui) {
						// var logEntry = $scope.list.map(function (i) {
						// 	return i.value;
						// }).join(', ');
						// $scope.sortingLog.push('Update: ' + logEntry);
						//console.log('update - $scope.sortingLog');
						//console.log($scope.sortingLog);
					},
					stop: function (e, ui) {
						for (var index in $scope.courseVideos) {
							if (typeof ($scope.courseVideos[index]) == 'object') {
								$scope.courseVideos[index].i = index;
								//var video = $scope.courseVideos[index];
								//$scope.editVimeo(index, video);
							}
						}

						// logModels();
						updateorderIndex();

						// TODO: Save List

						//console.log('stop - $scope.sortingLog');
						//console.log($scope.sortingLog);
					}
				};


				function logModels() {
					var logEntry = $scope.courseVideos.map(function (i) {
						return i.txt + '(pos:' + i.i + ')';
					}).join(', ');
					$scope.sortingLog.push('Stop: ' + logEntry);
				}
				//console.log($scope.courseVideos);
			}

			angular.forEach($scope.courseVideos, function (value, key) {
				$scope.buildList(key, $scope.courseVideos);

			})
			// #endregion


		};

	}]);
