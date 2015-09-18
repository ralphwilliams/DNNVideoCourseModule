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
using DotNetNuke.Entities.Modules;

namespace RalphWilliams.Modules.Calvary_VideoCourse.Components
{
	public class Calvary_VideoCourseModuleBase : PortalModuleBase
	{
		public int videoId
		{
			get
			{
				var qs = Request.QueryString["tid"];
				if (qs != null)
					return Convert.ToInt32(qs);
				return -1;
			}

		}
	}
}