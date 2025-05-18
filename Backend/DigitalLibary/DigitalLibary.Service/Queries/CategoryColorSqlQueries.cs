using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalLibary.Service.Queries
{
    public class CategoryColorSqlQueries
    {
       public const string QueryInsertCategoryColor = @"INSERT INTO [dbo].[CategoryColor]
           (Id
           ,ColorName
           ,ReadingLevel
           ,CreatedDate
           ,Status
           ,ColorCode)
     VALUES
            (@@Id
           ,@ColorName
           ,@ReadingLevel
           ,@CreatedDate
           ,@Status
           ,@ColorCode)";
        public const string QueryGetAllCategoryColor = @"select *from [dbo].[CategoryColor] order by NameNationality";
       public const string QueryGetByIdCategoryColor = @"select * from [dbo].[CategoryColor] where Id = @Id";
       public const string QueryUpdateCategoryColor = @"UPDATE [dbo].[CategoryColor] SET NameNationality = @NameNationality, Status = @Status WHERE Id = @Id";
       public const string QueryGetCategoryColorByIds = "select * from [dbo].[CategoryColor] where Id IN @Ids";
       public const string QueryInsertCategoryColorDeleted = @"INSERT INTO [dbo].[Deleted_CategoryColor]
           ([Id]
           ,[CreatedDate]
           ,[Status]
           ,[NameNationality])
     VALUES
       (@Id,@CreatedDate,@Status,@NameNationality)";
       public const string QueryDeleteCategoryColor = "DELETE FROM [dbo].[CategoryColor] WHERE Id IN @Ids";
    }
}
