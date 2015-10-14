<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="View.ascx.cs" Inherits="RalphWilliams.Modules.Calvary_VideoCourse.View" %>
<script type="text/javascript">
	var d = new Date();
	var moduleId = <%= ModuleId %>;
	var moduleName = "<%=ModuleConfiguration.DesktopModule.FolderName%>";
	var portalId = <%= PortalId %>;
	var currentUser = <%= UserId %>;
	var currentDate = d;
	var userRoles = <%= ShowRoles() %>;
    var sf = $.ServicesFramework(<%:ModuleContext.ModuleId%>);
    <% if (IsUserAdmin) { %>
	var editMode = true;
	<% } %>
</script>
<%
	DotNetNuke.Common.Utilities.DataCache.ClearUserCache(PortalId, UserInfo.Username);
 %>
<div class="module-wrap" ng-view>
</div>