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
	public class FeatureController //: IPortable, ISearchable, IUpgradeable
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
		//public string UpgradeModule(string Version)
		//{
		//	throw new System.NotImplementedException("The method or operation is not implemented.");
		//}

		#endregion

	}

}
