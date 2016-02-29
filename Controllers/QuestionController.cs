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
	class QuestionController
	{
		public void CreateQuestion(QuestionInfo q)
		{
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<QuestionInfo>();
				rep.Insert(q);
			}
		}

		public void DeleteQuestion(int questionId, int moduleId)
		{
			var q = GetQuestion(questionId, moduleId);
			DeleteQuestion(q);
		}

		public void DeleteQuestion(QuestionInfo q)
		{
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<QuestionInfo>();
				rep.Delete(q);
			}
		}

		public IEnumerable<QuestionInfo> GetQuestions(int moduleId)
		{
			IEnumerable<QuestionInfo> q;
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<QuestionInfo>();
				q = rep.Get(moduleId);
			}
			return q;
		}

		public QuestionInfo GetQuestion(int questionId, int moduleId)
		{
			QuestionInfo q = null;
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<QuestionInfo>();
				q = rep.GetById(questionId, moduleId);
			}
			return q;
		}

		public void UpdateQuestion(QuestionInfo q)
		{
			using (IDataContext ctx = DataContext.Instance())
			{
				var rep = ctx.GetRepository<QuestionInfo>();
				rep.Update(q);
			}
		}
	}
}