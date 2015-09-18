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
using System.Web.UI.WebControls;
using RalphWilliams.Modules.Calvary_VideoCourse.Components;
using DotNetNuke.Common.Utilities;
using DotNetNuke.Services.Exceptions;
using DotNetNuke.Framework;
using DotNetNuke.Services.Localization;
using DotNetNuke.UI.Utilities;
using DotNetNuke.Web.Client;
using DotNetNuke.Web.Client.ClientResourceManagement;
using RalphWilliams.Modules.Calvary_VideoCourse.Controllers;
using RalphWilliams.Modules.Calvary_VideoCourse.Entities;

namespace RalphWilliams.Modules.Calvary_VideoCourse
{
	/// -----------------------------------------------------------------------------
	/// <summary>
	/// The View class displays the content
	/// 
	/// Typically your view control would be used to display content or functionality in your module.
	/// 
	/// View may be the only control you have in your project depending on the complexity of your module
	/// 
	/// Because the control inherits from Calvary_VideoCourseModuleBase you have access to any custom properties
	/// defined there, as well as properties from DNN such as PortalId, ModuleId, TabId, UserId and many more.
	/// 
	/// </summary>
	/// -----------------------------------------------------------------------------
	public partial class View : Calvary_VideoCourseModuleBase
    {
        #region Properties

	    protected bool IsUserAdmin
	    {
	        get
	        {
                if (UserInfo == null || UserInfo != null && UserInfo.UserID < 1) return false;

	            return UserInfo.IsInRole(PortalSettings.AdministratorRoleName);
	        }
	    }
        #endregion

        #region Event Handlers
        protected void Page_Load(object sender, EventArgs e)
		{
			try
			{
				ServicesFramework.Instance.RequestAjaxScriptSupport();
				ServicesFramework.Instance.RequestAjaxAntiForgerySupport();

				ClientResourceManager.RegisterStyleSheet(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/Content/bootstrap.min.css"), FileOrder.Css.ModuleCss);
				ClientResourceManager.RegisterStyleSheet(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/Content/bootstrap-flat.min.css"), FileOrder.Css.ModuleCss);
				ClientResourceManager.RegisterStyleSheet(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/Content/bootstrap-flat-extras.min.css"), FileOrder.Css.ModuleCss);

                //<script src="Scripts/jquery-2.1.4.min.js"></script>
				//<script src="Scripts/jquery-ui-1.11.4.min.js"></script>
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/Scripts/froogaloop2.min.js"), 1, "DnnFormBottomProvider");
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/Scripts/angular.min.js"), 2, "DnnFormBottomProvider");
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/Scripts/angular-route.min.js"), 3, "DnnFormBottomProvider");
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/Scripts/angular-animate.min.js"), 4, "DnnFormBottomProvider");
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/Scripts/angular-ui/sortable.js"), 5, "DnnFormBottomProvider");
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/ng/app.js"), 6, "DnnFormBottomProvider");
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/ng/factories.js"), 7, "DnnFormBottomProvider");
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/ng/Controllers/videoCtrl.js"), 8, "DnnFormBottomProvider");
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/ng/Controllers/videoPlayerCtrl.js"), 9, "DnnFormBottomProvider");
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/ng/Controllers/editCourseCtrl.js"), 10, "DnnFormBottomProvider"); 
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/ng/Controllers/statusCtrl.js"), 11, "DnnFormBottomProvider");
				ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/Scripts/bootstrap.min.js"), 12, "DnnFormBottomProvider");
				//ClientResourceManager.RegisterScript(Page, Page.ResolveUrl("~/DesktopModules/Calvary_VideoCourse/Scripts/scripts.js"), 13, "DnnFormBottomProvider");

				// ReadSpecificProfileProperty();
                
				// var tc = new VideoController();
				// rptItemList.DataSource = tc.GetVideos(ModuleId);
				// rptItemList.DataBind();
			}
			catch (Exception exc) //Module failed to load
			{
				Exceptions.ProcessModuleLoadException(this, exc);
			}
		}

		protected void rptItemListOnItemDataBound(object sender, RepeaterItemEventArgs e)
		{
			if (e.Item.ItemType == ListItemType.AlternatingItem || e.Item.ItemType == ListItemType.Item)
			{
				var lnkEdit = e.Item.FindControl("lnkEdit") as HyperLink;
				var lnkDelete = e.Item.FindControl("lnkDelete") as LinkButton;

				var pnlAdminControls = e.Item.FindControl("pnlAdmin") as Panel;

				var t = (VideoInfo)e.Item.DataItem;

				if (IsEditable && lnkDelete != null && lnkEdit != null && pnlAdminControls != null)
				{
					pnlAdminControls.Visible = true;
					lnkDelete.CommandArgument = t.VideoId.ToString();
					lnkDelete.Enabled = lnkDelete.Visible = lnkEdit.Enabled = lnkEdit.Visible = true;

					lnkEdit.NavigateUrl = EditUrl(string.Empty, string.Empty, "Edit", "tid=" + t.VideoId);

					ClientAPI.AddButtonConfirm(lnkDelete, Localization.GetString("ConfirmDelete", LocalResourceFile));
				}
				else
				{
					pnlAdminControls.Visible = false;
				}
			}
		}

		public void rptItemListOnItemCommand(object source, RepeaterCommandEventArgs e)
		{
			if (e.CommandName == "Edit")
			{
				Response.Redirect(EditUrl(string.Empty, string.Empty, "Edit", "tid=" + e.CommandArgument));
			}

			if (e.CommandName == "Delete")
			{
				var tc = new VideoController();
				tc.DeleteVideo(Convert.ToInt32(e.CommandArgument), ModuleId);
			}
			Response.Redirect(DotNetNuke.Common.Globals.NavigateURL());
        }
        #endregion

        #region Helper Methods
        protected string ShowRoles()
	    {
            var stringList = UserInfo.Roles.ToJson();
            return stringList;
	    }
        #endregion
    }
}