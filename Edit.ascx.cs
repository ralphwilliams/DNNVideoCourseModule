/*
' Copyright (c) 2015  Christoc.com
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
using DotNetNuke.Entities.Users;
using Christoc.Modules.Calvary_VideoCourse.Components;
using DotNetNuke.Services.Exceptions;

namespace Christoc.Modules.Calvary_VideoCourse
{
	/// -----------------------------------------------------------------------------
	/// <summary>   
	/// The Edit class is used to manage content
	/// 
	/// Typically your edit control would be used to create new content, or edit existing content within your module.
	/// The ControlKey for this control is "Edit", and is defined in the manifest (.dnn) file.
	/// 
	/// Because the control inherits from Calvary_VideoCourseModuleBase you have access to any custom properties
	/// defined there, as well as properties from DNN such as PortalId, ModuleId, TabId, UserId and many more.
	/// 
	/// </summary>
	/// -----------------------------------------------------------------------------
	public partial class Edit : Calvary_VideoCourseModuleBase
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			try
			{
				//Implement your edit logic for your module
				if (!Page.IsPostBack)
				{
					//get a list of users to assign the user to the Object
					ddlAssignedUser.DataSource = UserController.GetUsers(PortalId);
					ddlAssignedUser.DataTextField = "Username";
					ddlAssignedUser.DataValueField = "UserId";
					ddlAssignedUser.DataBind();

					//check if we have an ID passed in via a querystring parameter, if so, load that video to edit.
					//videoId is defined in the ItemModuleBase.cs file
					if (videoId > 0)
					{
						var vc = new VideoController();

						var v = vc.GetVideo(videoId, ModuleId);
						if (v != null)
						{
							txtVimeoId.Text = v.vimeoId.ToString();
							txtCourseId.Text = v.courseId.ToString();
							ddlAssignedUser.Items.FindByValue(v.AssignedUserId.ToString()).Selected = true;
						}
					}
				}
			}
			catch (Exception exc) //Module failed to load
			{
				Exceptions.ProcessModuleLoadException(this, exc);
			}
		}


		protected void btnSubmit_Click(object sender, EventArgs e)
		{
			var v = new Video();
			var vc = new VideoController();

			if (videoId > 0)
			{
				v = vc.GetVideo(videoId, ModuleId);
				v.vimeoId = int.Parse(txtVimeoId.Text);
				v.courseId = int.Parse(txtCourseId.Text);
				v.LastModifiedByUserId = UserId;
				v.LastModifiedOnDate = DateTime.Now;
				v.AssignedUserId = Convert.ToInt32(ddlAssignedUser.SelectedValue);
			}
			else
			{
				v = new Video()
				{
					AssignedUserId = Convert.ToInt32(ddlAssignedUser.SelectedValue),
					CreatedByUserId = UserId,
					CreatedOnDate = DateTime.Now,
					vimeoId = int.Parse(txtVimeoId.Text),
					courseId = int.Parse(txtCourseId.Text)

				};
			}

			v.LastModifiedOnDate = DateTime.Now;
			v.LastModifiedByUserId = UserId;
			v.ModuleId = ModuleId;

			if (v.videoId > 0)
			{
				vc.UpdateVideo(v);
			}
			else
			{
				vc.CreateVideo(v);
			}
			Response.Redirect(DotNetNuke.Common.Globals.NavigateURL());
		}

		protected void btnCancel_Click(object sender, EventArgs e)
		{
			Response.Redirect(DotNetNuke.Common.Globals.NavigateURL());
		}
	}
}