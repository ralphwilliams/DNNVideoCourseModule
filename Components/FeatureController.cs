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
using System.Web.Configuration;
using System.Web.Http;
using DotNetNuke.Common;
using DotNetNuke.Common.Utilities;
using DotNetNuke.Entities.Profile;
using DotNetNuke.Entities.Users;
using DotNetNuke.Security;
using DotNetNuke.Web.Api;
using RalphWilliams.Modules.Calvary_VideoCourse.Entities;
using DotNetNuke.Security.Roles;
using DotNetNuke.Services.Exceptions;
using DotNetNuke.Services.Mail;
using DotNetNuke.Security.Roles.Internal;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Entities.Portals;
using DotNetNuke.Services.Localization;

using RalphWilliams.Modules.Calvary_VideoCourse.Controllers;

namespace RalphWilliams.Modules.Calvary_VideoCourse.Components
{

	/// -----------------------------------------------------------------------------
	/// <summary>
	/// The Controller class for Calvary_VideoCourse
	/// 
	/// The FeatureController class is defined as the BusinessController in the manifest file (.dnn)
	/// DotNetNuke will poll this class to find out which Interfaces the class implements. 
	/// 
	/// The IPortable interface is used to import/export content from a DNN module
	/// 
	/// The ISearchable interface is used by DNN to index the content of a module
	/// 
	/// The IUpgradeable interface allows module developers to execute code during the upgrade 
	/// process for a module.
	/// 
	/// Below you will find stubbed out implementations of each, uncomment and populate with your own data
	/// </summary>
	/// -----------------------------------------------------------------------------

	//uncomment the interfaces to add the support.
	public class FeatureController : IUpgradeable //: IPortable, ISearchable, 
	{


		#region Optional Interfaces

		/// -----------------------------------------------------------------------------
		/// <summary>
		/// ExportModule implements the IPortable ExportModule Interface
		/// </summary>
		/// <param name="ModuleID">The Id of the module to be exported</param>
		/// -----------------------------------------------------------------------------
		//public string ExportModule(int ModuleID)
		//{
		//string strXML = "";

		//List<Calvary_VideoCourseInfo> colCalvary_VideoCourses = GetCalvary_VideoCourses(ModuleID);
		//if (colCalvary_VideoCourses.Count != 0)
		//{
		//    strXML += "<Calvary_VideoCourses>";

		//    foreach (Calvary_VideoCourseInfo objCalvary_VideoCourse in colCalvary_VideoCourses)
		//    {
		//        strXML += "<Calvary_VideoCourse>";
		//        strXML += "<content>" + DotNetNuke.Common.Utilities.XmlUtils.XMLEncode(objCalvary_VideoCourse.Content) + "</content>";
		//        strXML += "</Calvary_VideoCourse>";
		//    }
		//    strXML += "</Calvary_VideoCourses>";
		//}

		//return strXML;

		//	throw new System.NotImplementedException("The method or operation is not implemented.");
		//}

		/// -----------------------------------------------------------------------------
		/// <summary>
		/// ImportModule implements the IPortable ImportModule Interface
		/// </summary>
		/// <param name="ModuleID">The Id of the module to be imported</param>
		/// <param name="Content">The content to be imported</param>
		/// <param name="Version">The version of the module to be imported</param>
		/// <param name="UserId">The Id of the user performing the import</param>
		/// -----------------------------------------------------------------------------
		//public void ImportModule(int ModuleID, string Content, string Version, int UserID)
		//{
		//XmlNode xmlCalvary_VideoCourses = DotNetNuke.Common.Globals.GetContent(Content, "Calvary_VideoCourses");
		//foreach (XmlNode xmlCalvary_VideoCourse in xmlCalvary_VideoCourses.SelectNodes("Calvary_VideoCourse"))
		//{
		//    Calvary_VideoCourseInfo objCalvary_VideoCourse = new Calvary_VideoCourseInfo();
		//    objCalvary_VideoCourse.ModuleId = ModuleID;
		//    objCalvary_VideoCourse.Content = xmlCalvary_VideoCourse.SelectSingleNode("content").InnerText;
		//    objCalvary_VideoCourse.CreatedByUser = UserID;
		//    AddCalvary_VideoCourse(objCalvary_VideoCourse);
		//}

		//	throw new System.NotImplementedException("The method or operation is not implemented.");
		//}

		/// -----------------------------------------------------------------------------
		/// <summary>
		/// GetSearchItems implements the ISearchable Interface
		/// </summary>
		/// <param name="ModInfo">The ModuleInfo for the module to be Indexed</param>
		/// -----------------------------------------------------------------------------
		//public DotNetNuke.Services.Search.SearchItemInfoCollection GetSearchItems(DotNetNuke.Entities.Modules.ModuleInfo ModInfo)
		//{
		//SearchItemInfoCollection SearchItemCollection = new SearchItemInfoCollection();

		//List<Calvary_VideoCourseInfo> colCalvary_VideoCourses = GetCalvary_VideoCourses(ModInfo.ModuleID);

		//foreach (Calvary_VideoCourseInfo objCalvary_VideoCourse in colCalvary_VideoCourses)
		//{
		//    SearchItemInfo SearchItem = new SearchItemInfo(ModInfo.ModuleTitle, objCalvary_VideoCourse.Content, objCalvary_VideoCourse.CreatedByUser, objCalvary_VideoCourse.CreatedDate, ModInfo.ModuleID, objCalvary_VideoCourse.videoId.ToString(), objCalvary_VideoCourse.Content, "videoId=" + objCalvary_VideoCourse.videoId.ToString());
		//    SearchItemCollection.Add(SearchItem);
		//}

		//return SearchItemCollection;

		//	throw new System.NotImplementedException("The method or operation is not implemented.");
		//}

		/// -----------------------------------------------------------------------------
		/// <summary>
		/// UpgradeModule implements the IUpgradeable Interface
		/// </summary>
		/// <param name="Version">The current version of the module</param>
		/// -----------------------------------------------------------------------------
		public string UpgradeModule(string Version)
		{
			try
			{
				ProfilePropertyDefinition pdef = ProfileController.GetPropertyDefinitionByName(PortalSettings.PortalId, "newTestProperty1");
				if (pdef == null)
				{
					/// Create the profile property programatically or throw error
					var newProfile = new ProfilePropertyDefinition(PortalSettings.PortalId);
					newProfile.PortalId = PortalSettings.PortalId;
					newProfile.ModuleDefId = Null.NullInteger;
					newProfile.DataType = 349;
					newProfile.DefaultValue = "";
					newProfile.PropertyCategory = "TestCategory";
					newProfile.PropertyName = "newTestProperty1";
					newProfile.ReadOnly = false;
					newProfile.Required = false;
					newProfile.Visible = true;
					newProfile.Length = 0;
					newProfile.DefaultVisibility = UserVisibilityMode.AllUsers;

					ProfileController.AddPropertyDefinition(newProfile);
				}
				return Request.CreateResponse(HttpStatusCode.OK);
			}
			catch (Exception exc)
			{
				Exceptions.LogException(exc);
				return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, exc);
			}
		}

		#endregion

	}

}
