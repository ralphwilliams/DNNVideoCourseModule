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
using DotNetNuke.Data;
using RalphWilliams.Modules.DNNVideoCourse.Entities;

namespace RalphWilliams.Modules.DNNVideoCourse.Controllers
{
	class VideoController
	{
		public void CreateVideo(VideoInfo v)
		{
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<VideoInfo>();
				rep.Insert(v);
			}
		}

		public void DeleteVideo(int videoId, int moduleId)
		{
			var v = GetVideo(videoId, moduleId);
			DeleteVideo(v);
		}

		public void DeleteVideo(VideoInfo v)
		{
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<VideoInfo>();
				rep.Delete(v);
			}
		}

		public IEnumerable<VideoInfo> GetVideos(int moduleId)
		{
			IEnumerable<VideoInfo> v;
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<VideoInfo>();
				v = rep.Get(moduleId);
			}
			return v;
		}

		public VideoInfo GetVideo(int videoId, int moduleId)
		{
            VideoInfo v = null;
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<VideoInfo>();
				v = rep.GetById(videoId, moduleId);
			}
			return v;
		}

		public void UpdateVideo(VideoInfo v)
		{
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<VideoInfo>();
				rep.Update(v);
			}
		}
	}
}