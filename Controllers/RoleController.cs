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

using System.Collections.Generic;
using System.Linq;
using DotNetNuke.Common.Utilities;
using DotNetNuke.Entities.Users;
using DotNetNuke.Security.Roles;

namespace RalphWilliams.Modules.DNNVideoCourse.Controllers
{
    public class RoleController
    {
        private const string ROLE_GROUP_PREFIX = "DVC_";

        /// <summary>
        /// Gets the role groups.  
        /// </summary>
        /// <param name="portalId">The portal identifier.</param>
        /// <returns></returns>
        public static List<RoleGroupInfo> GetRoleGroups(int portalId)
        {
            // This is necessary because the DNN core will cache a different version of the Roles property for various requests, affecting other users.
            DataCache.ClearCache(string.Format(DataCache.RoleGroupsCacheKey, portalId));

            var roleGroups = DotNetNuke.Security.Roles.RoleController.GetRoleGroups(portalId).Cast<RoleGroupInfo>().Where(r => r.RoleGroupName.Contains(ROLE_GROUP_PREFIX)).ToList();
            
            return roleGroups;
        }

        /// <summary>
        /// Gets the user roles.
        /// </summary>
        /// <param name="userInfo">The user information.</param>
        /// <returns></returns>
        public static List<UserRoleInfo> GetUserRoles(UserInfo userInfo)
        {
            return DotNetNuke.Security.Roles.RoleController.Instance.GetUserRoles(userInfo, true).ToList();
        }

        /// <summary>
        /// Gets the name of the role group by.
        /// </summary>
        /// <param name="portalId">The portal identifier.</param>
        /// <param name="roleGroupName">Name of the role group.</param>
        /// <returns></returns>
        public static RoleGroupInfo GetRoleGroupByName(int portalId, string roleGroupName)
        {
            return DotNetNuke.Security.Roles.RoleController.GetRoleGroupByName(portalId, roleGroupName);
        }

        /// <summary>
        /// Gets the users by role.
        /// </summary>
        /// <param name="portalId">The portal identifier.</param>
        /// <param name="roleName">Name of the role.</param>
        /// <returns></returns>
        public static List<UserInfo> GetUsersByRole(int portalId, string roleName)
        {
            return DotNetNuke.Security.Roles.RoleController.Instance.GetUsersByRole(portalId, roleName).ToList();
        }

		/// <summary>
		/// Gets the roles by role group identifier.
		/// </summary>
		/// <param name="portalId">The portal identifier.</param>
		/// <param name="roleGroupId">The role group identifier.</param>
		/// <returns></returns>
		public static List<RoleInfo> GetRolesByRoleGroupID(int portalId, int roleGroupId)
		{
			return DotNetNuke.Security.Roles.RoleController.Instance.GetRoles(portalId).Where(r => r.RoleGroupID == roleGroupId).ToList();
		}

	}
}