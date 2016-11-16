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
using DotNetNuke.Common.Utilities;
using DotNetNuke.Entities.Profile;
using DotNetNuke.Entities.Users;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Entities.Portals;

namespace RalphWilliams.Modules.DNNVideoCourse.Components
{

	/// -----------------------------------------------------------------------------
	/// <summary>
	/// The Controller class for DNNVideoCourse
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

		//List<DNNVideoCourseInfo> colDNNVideoCourses = GetDNNVideoCourses(ModuleID);
		//if (colDNNVideoCourses.Count != 0)
		//{
		//    strXML += "<DNNVideoCourses>";

		//    foreach (DNNVideoCourseInfo objDNNVideoCourse in colDNNVideoCourses)
		//    {
		//        strXML += "<DNNVideoCourse>";
		//        strXML += "<content>" + DotNetNuke.Common.Utilities.XmlUtils.XMLEncode(objDNNVideoCourse.Content) + "</content>";
		//        strXML += "</DNNVideoCourse>";
		//    }
		//    strXML += "</DNNVideoCourses>";
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
		//XmlNode xmlDNNVideoCourses = DotNetNuke.Common.Globals.GetContent(Content, "DNNVideoCourses");
		//foreach (XmlNode xmlDNNVideoCourse in xmlDNNVideoCourses.SelectNodes("DNNVideoCourse"))
		//{
		//    DNNVideoCourseInfo objDNNVideoCourse = new DNNVideoCourseInfo();
		//    objDNNVideoCourse.ModuleId = ModuleID;
		//    objDNNVideoCourse.Content = xmlDNNVideoCourse.SelectSingleNode("content").InnerText;
		//    objDNNVideoCourse.CreatedByUser = UserID;
		//    AddDNNVideoCourse(objDNNVideoCourse);
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

		//List<DNNVideoCourseInfo> colDNNVideoCourses = GetDNNVideoCourses(ModInfo.ModuleID);

		//foreach (DNNVideoCourseInfo objDNNVideoCourse in colDNNVideoCourses)
		//{
		//    SearchItemInfo SearchItem = new SearchItemInfo(ModInfo.ModuleTitle, objDNNVideoCourse.Content, objDNNVideoCourse.CreatedByUser, objDNNVideoCourse.CreatedDate, ModInfo.ModuleID, objDNNVideoCourse.videoId.ToString(), objDNNVideoCourse.Content, "videoId=" + objDNNVideoCourse.videoId.ToString());
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
            // these could be constants instead, but this code will very rarely be run and won't be run at such scale that it will matter that much
		    var goodResult = "true";
		    var badResult = "false";
		    var propertyCategory = "Video Module Status";
		    var propertyName = "videosComplete";

		    switch (Version)
		    {
                case "01.02.01": // should be whichever version number is being upgraded to or currently installed
                    try
                    {
                        // get a collection of portals to iterate through
                        var portals = PortalController.Instance.GetPortals();

                        // update each portal since they could each potentially use the module and we'll have no idea which one already is or will be later
                        foreach (PortalInfo portal in portals)
                        {
                            var pdef = ProfileController.GetPropertyDefinitionByName(portal.PortalID, propertyName);

                            if (pdef == null)
                            {
                                // Create the profile property programatically or throw error
                                var newProfile = new ProfilePropertyDefinition(portal.PortalID);
                                newProfile.PortalId = portal.PortalID;
                                newProfile.ModuleDefId = Null.NullInteger;
                                newProfile.DataType = 349;
                                newProfile.DefaultValue = string.Empty;
                                newProfile.PropertyCategory = propertyCategory; // made this a static object above to save memory for performance if there are lot of portals
                                newProfile.PropertyName = propertyName; // made this a static object above to save memory for performance if there are lot of portals
                                newProfile.ReadOnly = true;
                                newProfile.Required = false;
                                newProfile.Visible = false;
                                newProfile.Length = 0;
                                newProfile.DefaultVisibility = UserVisibilityMode.AllUsers;

                                ProfileController.AddPropertyDefinition(newProfile);
                            }
                        }

                        return goodResult;
                    }
                    catch
                    {
                        // attempting to report the exception here is useless, because DNN will never log it anywhere for some reason
                        return badResult;
                    }
                default:
		            return goodResult;
		    }
		}

		#endregion

	}

}
