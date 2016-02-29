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
	class AnswerController
	{
		public void CreateAnswer(AnswerInfo a)
		{
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<AnswerInfo>();
				rep.Insert(a);
			}
		}

		public void DeleteAnswer(int answerId, int moduleId)
		{
			var a = GetAnswer(answerId, moduleId);
			DeleteAnswer(a);
		}

		public void DeleteAnswer(AnswerInfo a)
		{
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<AnswerInfo>();
				rep.Delete(a);
			}
		}

		public IEnumerable<AnswerInfo> GetAnswers(int moduleId)
		{
			IEnumerable<AnswerInfo> a;
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<AnswerInfo>();
				a = rep.Get(moduleId);
			}
			return a;
		}

		public AnswerInfo GetAnswer(int answerId, int moduleId)
		{
            AnswerInfo a = null;
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<AnswerInfo>();
				a = rep.GetById(answerId, moduleId);
			}
			return a;
		}

		public void UpdateAnswer(AnswerInfo a)
		{
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<AnswerInfo>();
				rep.Update(a);
			}
		}
	}
}