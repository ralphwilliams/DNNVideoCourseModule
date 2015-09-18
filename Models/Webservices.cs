/*
' Copyright (c) 2015  Ralph Williams (RalphWilliams.com)
'  All rights reserved.
' 
' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
' TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
' THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
' CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
' DEALINGS IN THE SOFTWARE.
' 
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DotNetNuke.Common;
using DotNetNuke.Common.Utilities;
using DotNetNuke.Entities.Users;
using DotNetNuke.Web.Api;
using RalphWilliams.Modules.Calvary_VideoCourse.Entities;
using DotNetNuke.Security.Roles;
using DotNetNuke.Services.Exceptions;
using DotNetNuke.Services.Mail;
using RalphWilliams.Modules.Calvary_VideoCourse.Controllers;

namespace RalphWilliams.Modules.Calvary_VideoCourse.Models
{
	public class Calvary_VideoCourseController : DnnApiController
	{
		// Get Videos
		[AllowAnonymous]
		[HttpGet]
		public HttpResponseMessage GetVideos(int moduleId)
		{
			try
			{
                Requires.NotNegative("moduleId", moduleId);

				var ctl = new VideoController();
				var videos = ctl.GetVideos(moduleId).ToJson();
				
                return Request.CreateResponse(HttpStatusCode.OK, videos);
			}
			catch (Exception exc)
            {
                Exceptions.LogException(exc);
				return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, exc);
			}
		}
        
        // Get Videos
        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage GetVideosByUser(int moduleId, int userId)
        {
            try
            {
                Requires.NotNegative("moduleId", moduleId);
                Requires.NotNegative("userId", userId);

                var ctl = new VideoController();
                var videos = ctl.GetVideos(moduleId).Where(v => v.AssignedUserId == userId).ToJson();

                return Request.CreateResponse(HttpStatusCode.OK, videos);
            }
            catch (Exception exc)
            {
                Exceptions.LogException(exc);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, exc);
            }
        }

		//  Get Role Groups
		[AllowAnonymous]
		[HttpGet]
		public HttpResponseMessage GetAllGroups() 
		{
			try
			{
                //
                // TODO: don't hard code the PortalID
                //
			    var portalId = PortalSettings.PortalId;
			    var filteredRoleGroups = string.Empty;

                if (UserInfo == null || (UserInfo != null && UserInfo.UserID < 1))
			    {
                    // you can only get information if you're logged in
                    Exceptions.LogException(new AccessViolationException("Unauthorized attempt to access GetAllGroups API end point"));

                    // return 404 error simply to discourage hacking
			        return Request.CreateResponse(HttpStatusCode.NotFound);
			    }

                // get all role groups
                var roleGroups = Controllers.RoleController.GetRoleGroups(portalId);

				if (UserInfo.IsInRole(PortalSettings.AdministratorRoleName) || UserInfo.IsSuperUser)
				{
					// return ALL role groups
					filteredRoleGroups = roleGroups.ToJson();
				}
				else
				{
                    // get a listing of the unique role group IDs
                    var roleGroupIds = roleGroups.Select(g => g.RoleGroupID).ToList();

                    var userRoles = Controllers.RoleController.GetUserRoles(UserInfo);

                    // filter the role groups by only those that have a matching role for the user
                    var filteredRoleGroupIds = userRoles.Where(r => roleGroupIds.Contains(r.RoleGroupID)).Select(r => r.RoleGroupID).ToList();

                    // return only the role groups that the user is a part of
				    var uncleanRoleGroups = roleGroups.Where(g => filteredRoleGroupIds.Contains(g.RoleGroupID));

                    // remove any roles that the user is not a part of, and system roles
				    var roleGroupsToReturn = new List<RoleGroupInfo>();
				    foreach (var group in uncleanRoleGroups.ToList())
				    {
				        var newGroup = new RoleGroupInfo();
				        newGroup = group;

				        foreach (var role in newGroup.Roles.ToList())
				        {
				            var roleInfo = (RoleInfo) role.Value;
				            if (roleInfo.IsSystemRole || !UserInfo.IsInRole(roleInfo.RoleName))
				            {
				                newGroup.Roles.Remove(role.Key);
				            }
				        }

                        roleGroupsToReturn.Add(newGroup);
				    }

				    filteredRoleGroups = roleGroupsToReturn.ToJson();
				}

                return Request.CreateResponse(HttpStatusCode.OK, filteredRoleGroups);
			}
			catch (Exception exc)
			{
                Exceptions.LogException(exc);
				return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, exc);
			}
		}
        
		//  Get Role Groups by User
		[AllowAnonymous]
		[HttpGet]
		public HttpResponseMessage GetGroupsByUser()
		{
			// Get Role Groups
		    var portalId = PortalSettings.PortalId;
            // NOTE: these two variables are never used
			var checkRoleGroup = Controllers.RoleController.GetRoleGroupByName(portalId, "Role Group");
			var roleGroup = Controllers.RoleController.GetRoleGroups(portalId);

            var roles = Controllers.RoleController.GetUserRoles(UserInfo);

			var newroleGroup = roles.Where(role => UserInfo.IsInRole(role.RoleName)).Cast<RoleInfo>().ToList();

			return Request.CreateResponse(HttpStatusCode.OK, newroleGroup);
		}
        
		// Get Users Video Complete status
		[AllowAnonymous]
		[HttpGet]
		public HttpResponseMessage GetVideosComplete()
		{

			var objInfo = new UserInfo(); // DNN Classes
			objInfo = UserController.GetUserById(PortalSettings.PortalId, UserInfo.UserID);

			var videosComplete = "false";
			
            if (objInfo != null)
			{
				videosComplete = objInfo.Profile.GetPropertyValue("videosComplete");
				videosComplete = string.Concat("[", videosComplete, "]");
			}

			return Request.CreateResponse(HttpStatusCode.OK, videosComplete);
		}

		// Get list of users
		[AllowAnonymous]
		[HttpGet]
		public HttpResponseMessage GetListOfUsers()
		{
			try
			{
				var portalId = PortalSettings.PortalId;
				var checkRoleGroup = Controllers.RoleController.GetRoleGroupByName(portalId, "Role Group");
                var groups = Controllers.RoleController.GetRoleGroups(portalId);

				var returnGroups = new List<RoleGroupsInListDTO>();
				if (groups != null && groups.Count > 0)
				{

					foreach (var group in groups)
					{
                        var roles = Controllers.RoleController.GetRolesByRoleGroupID(portalId, group.RoleGroupID);
						if (roles != null && roles.Count > 0)
						{

							var returnRoles = new List<RolesInListDTO>();
							foreach (var role in roles)
							{
								var users = Controllers.RoleController.GetUsersByRole(portalId, role.RoleName);
								if (users != null && users.Count > 0)
								{
									var returnUsers = new List<UsersInRoleDTO>();
									foreach (var user in users)
									{
										returnUsers.Add(new UsersInRoleDTO()
										{
											FirstName = user.FirstName,
											LastName = user.LastName,
											DisplayName = user.DisplayName,
											Email = user.Email,
											Videos = user.Profile.GetPropertyValue("videosComplete")
										});
									}
									returnRoles.Add(new RolesInListDTO()
									{
										Name = role.RoleName,
										Id = role.RoleID,
										Users = returnUsers
									});
								}
								else if (users != null && users.Count == 0)
								{
									returnRoles.Add(new RolesInListDTO()
									{
										Name = role.RoleName,
										Id = role.RoleID
									});
								}
							}
							returnGroups.Add(new RoleGroupsInListDTO()
							{
								Name = group.RoleGroupName,
								Id = group.RoleGroupID,
								Roles = returnRoles
							});

						}
					}
				}

				return Request.CreateResponse(HttpStatusCode.OK, returnGroups.ToJson());
			}
			catch (Exception exc)
            {
                Exceptions.LogException(exc);
				return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, exc);
			}

		}
        
		// [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Edit)]
		// [ValidateAntiForgeryToken]
		[AllowAnonymous]
		[HttpPost]
		public HttpResponseMessage DeleteVideo(VideoInfo video)
		{
			try
			{
                Requires.NotNull("video", video);
                Requires.NotNegative("video.ModuleId", video.ModuleId);
                Requires.NotNegative("video.VideoId", video.VideoId);

				if (UserInfo.IsInRole(PortalSettings.AdministratorRoleName))
				{
					var vc = new VideoController();

					//vc.DeleteVideo(video);
                    vc.DeleteVideo(video.VideoId, video.ModuleId);
					
                    return Request.CreateResponse(HttpStatusCode.OK);
				}
				else
				{
					return Request.CreateResponse(HttpStatusCode.Forbidden);
				}
			}
			catch (Exception exc)
            {
                Exceptions.LogException(exc);
				return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, exc);
			}
		}
        
		// [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Edit)]
		// [ValidateAntiForgeryToken]
		[AllowAnonymous]
		[HttpPost]
		public HttpResponseMessage AddVideo(VideoInfo videoDto)
		{
			try
			{
                Requires.NotNull("videoDto", videoDto);
                Requires.NotNegative("videoDto.CourseId", videoDto.CourseId);
                Requires.NotNegative("videoDto.ModuleId", videoDto.ModuleId);
                Requires.NotNegative("videoDto.OrderIndex", videoDto.OrderIndex);
                Requires.NotNegative("videoDto.CreatedByUserId", videoDto.CreatedByUserId);
                Requires.NotNegative("videoDto.LastModifiedByUserId", videoDto.LastModifiedByUserId);

				if (UserInfo.IsInRole(PortalSettings.AdministratorRoleName)) 
				{
                    var vc = new VideoController();

                    // get the video from the database to maintain data integrity
                    var video = vc.GetVideo(videoDto.VideoId, videoDto.ModuleId);

				    if (video == null)
				    {
                        // this is a new video
                        // update all values
                        video = new VideoInfo()
                        {
                            VimeoId = videoDto.VimeoId,
                            CourseId = videoDto.CourseId,
                            ModuleId = videoDto.ModuleId,
                            OrderIndex = videoDto.OrderIndex,
                            CreatedByUserId = videoDto.CreatedByUserId,
                            LastModifiedByUserId = videoDto.LastModifiedByUserId,
                            LastModifiedOnDate = DateTime.Now,
                            CreatedOnDate = DateTime.Now
                        };

                        vc.CreateVideo(video);
				    }
				    else
				    {
                        // this is an existing video that's getting updated
                        // we'll only update the values that are allowed to be updated
                        video.VimeoId = videoDto.VimeoId;
                        video.CourseId = videoDto.CourseId;
                        video.OrderIndex = videoDto.OrderIndex;
                        video.LastModifiedByUserId = videoDto.LastModifiedByUserId;
				        video.LastModifiedOnDate = DateTime.Now;

                        vc.UpdateVideo(video);
				    }
				}

				return Request.CreateResponse(HttpStatusCode.OK);
			}
			catch (Exception exc)
            {
                Exceptions.LogException(exc);
				return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, exc);
			}
		}

		[AllowAnonymous]
		[HttpPost]
		public HttpResponseMessage SaveComplete(NewVideoDTO thisVideo)
		{
			try
			{
				var video = new VideoInfo()
				{
					VideoId = thisVideo.VideoId
				};

				List<string> list = new List<string>();
				var property = UserInfo.Profile.GetPropertyValue("videosComplete");
				if (property != null)
				{
					list = property.Split(',').ToList();
				}

				list.Add(video.VideoId.ToString());
				
                string videoComplete = string.Empty;

				for (int i = 0; i < list.Count; i++)
				{
                    if (videoComplete == string.Empty)
					{
						videoComplete = videoComplete + list[i];

					}
					else if (!string.IsNullOrEmpty(videoComplete))
					{
						videoComplete = string.Concat(videoComplete, ",", list[i]);
					}
				}

				UserInfo.Profile.SetProfileProperty("videosComplete", videoComplete);
				UserController.UpdateUser(UserInfo.PortalID, UserInfo);

				return Request.CreateResponse(HttpStatusCode.OK);
			}
			catch (Exception exc)
            {
                Exceptions.LogException(exc);
				return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, exc);
			}
		}
        
		[AllowAnonymous]
		[HttpPost]
		public HttpResponseMessage SendEmail(SubjLineDTO newEmail)
		{
			var subjTitle = new SubjLineDTO()
			{
				Title = newEmail.Title,
				RoleId = newEmail.RoleId,
				CategoryId = newEmail.CategoryId
			};

			UserInfo objInfo = new UserInfo(); // DNN Classes
			objInfo = UserController.GetUserById(PortalSettings.PortalId, UserInfo.UserID);

			string UserDisplayName = objInfo.DisplayName;
			string UserEmail = objInfo.Email;

			// Gets the email address of the current portal
			string fromAddress = String.Empty;
			string toAddress = PortalSettings.Email;
            //
            // TODO: don't hard code the HTML
            //
			string subject = "**Training Course: " + subjTitle.Title + "** completed by " + UserDisplayName;
			string body = "<b>" + UserDisplayName + "</b> has completed the course " + subjTitle.Title + ". " + 
							"Their email address is: " + UserEmail +
							"<br /><br /><br /><i>This email was sent automatically from the Ministry Partner Training website.</i><br />";

			try
			{
				if (UserInfo.UserID >= 0)
				{
					//Get the logged in user's email address
					fromAddress = UserInfo.Email;
					//Get the current PortalId
					var portalID = PortalSettings.PortalId;

					//Check to see if it's a valid email address
					if (Mail.IsValidEmailAddress(toAddress, portalID))
					{
						//Send the email using DotNetNuke's SendMail method
						Mail.SendEmail(fromAddress, toAddress, subject, body);
					}
					else
					{
						throw new Exception("User has an invalid email address");
					}
				}

				return Request.CreateResponse(HttpStatusCode.OK);
			}
			catch (Exception exc)
            {
                Exceptions.LogException(exc);
				return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, exc);
			}
		}
	}
}