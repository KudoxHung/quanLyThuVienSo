using System;

namespace DigitalLibary.Service.Queries
{
    public static class UtilsSqlQueries
    {
        //public const string TotalDocumentBeforeDate = @"
        //                                                SELECT 
        //                                                    COUNT(DISTINCT i.Id) AS TotalBooks, -- Total number of books (distinct by individual sample)
        //                                                    SUM(d.Price) AS TotalPrice, -- Total price of books
        //                                                    SUM(CASE WHEN dt.DocTypeName = N'Sách thiếu nhi' THEN 1 ELSE 0 END) AS TotalChildrenBooks, -- Total number of children's books
        //                                                    SUM(CASE WHEN dt.DocTypeName = N'Sách tham khảo' THEN 1 ELSE 0 END) AS TotalReferenceBooks, -- Total number of reference books
        //                                                    SUM(CASE WHEN dt.DocTypeName = N'Sách nghiệp vụ' THEN 1 ELSE 0 END) AS TotalProfessionalBooks, -- Total number of professional books
        //                                                    SUM(CASE WHEN dt.DocTypeName = N'Sách giáo khoa' THEN 1 ELSE 0 END) AS TotalTextBooks, -- Total number of textbooks
        //                                                    SUM(CASE WHEN dt.DocTypeName NOT IN (N'Sách thiếu nhi', N'Sách tham khảo', N'Sách nghiệp vụ', N'Sách giáo khoa') THEN 1 ELSE 0 END) AS TotalOtherBooks -- Total number of other books
        //                                                FROM 
        //                                                    IndividualSample i
        //                                                JOIN 
        //                                                    Document d ON i.IdDocument = d.ID -- Join IndividualSample with Document
        //                                                JOIN 
        //                                                    DocumentType dt ON d.DocumentTypeId = dt.Id -- Join Document with DocumentType
        //                                                WHERE 
        //                                                   i.IsDeleted = 0 AND d.IsDeleted=0
        //                                                ";
        public const string AuditBookListByIdAuditReceipt = @"SELECT
                                                            d.ID AS IdBook,
                                                            d.DocName AS BookName,
                                                            ab.Price AS Price,
                                                            d.Author AS Author,
                                                            d.DocumentTypeId AS IdTypeBook,
                                                            dt.DocTypeName AS TypeBook,
                                                            i.NumIndividual AS NumIndividual,
                                                            i.Id AS IdIndividual,
                                                            ab.WasLost AS WasLost,
                                                            ab.Redundant AS Redundant,
                                                            ab.IsLiquidation AS IsLiquidation,
                                                            ab.IdStatusBook AS IdStatusBook,
                                                            sb.NameStatusBook AS NameStatusBook,
                                                            ab.Note AS Note
                                                        FROM
                                                            AuditBookList ab
                                                            left join Document d ON ab.IdDocument = d.ID
                                                            left join IndividualSample i ON ab.IdIndividualSample = i.Id
                                                            left join DocumentType dt ON d.DocumentTypeId = dt.Id
                                                            left join StatusBook sb ON ab.IdStatusBook = sb.Id
                                                        WHERE
                                                            ab.IdAuditReceipt = {0}";

        //ab.IdAuditReceipt = {0} and i.IsDeleted = 0";

        public const string AuditorListByIdAuditReceipt = @"SELECT
                                                            a.IdUser AS IdUser,
                                                            b.UnitId AS UnitId,
                                                            c.UnitName AS UnitName,
                                                            b.UserTypeId AS UserTypeId,
                                                            d.TypeName AS TypeName,
                                                            a.DescriptionRole AS DescriptionRole,
                                                            b.Fullname AS UserName,
                                                            a.Status AS Status,
                                                            a.Name AS Name,
                                                            a.Position AS Position,
                                                            a.Role AS Role,
                                                            a.Note AS Note
                                                        FROM
                                                            AuditorList a
                                                            LEFT JOIN [User] b ON a.IdUser = b.Id
                                                            LEFT JOIN [Unit] c ON b.UnitId = c.Id
                                                            LEFT JOIN UserType d ON b.UserTypeId = d.Id
                                                        WHERE
                                                            a.IdAuditReceipt = {0}";

        public const string DocumentTypeAndQuantity = @"SELECT
                                    e.DocTypeName AS DocumentType,
                                    (SELECT COUNT(*) FROM IndividualSample i
                                     WHERE i.IsDeleted = 0
                                       AND EXISTS (SELECT 1 FROM Document d
                                                   WHERE d.IsDeleted = 0
                                                     AND d.DocumentTypeId = e.Id
                                                     AND d.ID = i.IdDocument)) AS Quantity,
                                    (SELECT COUNT(*) FROM AuditBookList au
                                     WHERE au.IsLiquidation = 1 AND au.IdAuditReceipt = {0}
                                       AND EXISTS (SELECT 1 FROM Document d
                                                   WHERE d.IsDeleted = 0
                                                     AND d.DocumentTypeId = e.Id
                                                     AND d.ID = au.IdDocument)) AS QuantityLiquidated
                                FROM
                                    DocumentType e
                                WHERE
                                    e.IsDeleted = 0
                                    AND e.Status = 1
                                    AND e.ParentId IS NULL";

        public const string AnalystIndividualSample = @"WITH RankedBooks AS (
                                            SELECT i.Id AS 'IdIndividual',
                                                   i.NumIndividual AS 'NameIndividual',
                                                   d.DocName AS 'DocumentName',
                                                   d.Author,
                                                   i.EntryDate AS 'DateIn',
                                                   i.CreatedDate AS 'CreatedDate',
                                                   d.Publisher,
                                                   d.PublishPlace,
                                                   ds.StockName AS 'DocumentStock',
                                                   ds.OrdinalNumber,
                                                   d.PublishYear,
                                                   d.Price,
                                                   d.DocumentTypeId,
                                                   d.ID AS 'DocumentId',
                                                   c1.SignCode AS 'SignCode',
                                                   c1.SignName AS 'SignName',
                                                   cc.ColorName AS 'ReadingLevel',
                                                   cc.ColorName,
                                                   abl.WasLost,
                                                   ROW_NUMBER() OVER (PARTITION BY i.Id ORDER BY abl.CreatedDate DESC) AS rn
                                            FROM Document d
                                            LEFT JOIN IndividualSample i ON d.ID = i.IdDocument
                                            LEFT JOIN DocumentStock ds ON i.StockId = ds.Id
                                            LEFT JOIN CategorySign_V1 c1 ON d.IdCategorySign_V1 = c1.Id
                                            LEFT JOIN CategoryColor cc ON d.IdCategoryColor = cc.Id
                                            LEFT JOIN AuditBookList abl ON abl.IdIndividualSample = i.Id
                                            WHERE d.IsDeleted = 0
                                              AND i.IsDeleted = 0
                                              AND (abl.IsLiquidation IS NULL OR abl.IsLiquidation != 1)
                                             
                                        )
                                        SELECT *
                                        FROM RankedBooks
                                        WHERE rn = 1
                                        ORDER BY DocumentId;
                                        ";
        //IsLostedPhysicalVersion = 0  đã xoá
        public const string AnalystIndividualSampleExcel = @"WITH CombinedData AS (
    SELECT *
    FROM IndividualSample i
    WHERE  i.IsDeleted = 0
),
RankedData AS (
    SELECT cd.Id AS 'IdIndividual',
           cd.NumIndividual AS 'NameIndividual',
           d.DocName AS 'DocumentName',
           d.Author,
           cd.CreatedDate AS 'DateIn',
           d.Publisher,
           ds.StockName AS 'DocumentStock',
           d.PublishYear,
           i.Price,
           d.DocumentTypeId,
           d.ID AS 'DocumentId',
           d.PublishPlace,
           cc.ReadingLevel,
           cc.ColorName,
           ds.OrdinalNumber,
           cs.SignCode AS 'SignCode',
           cs.SignName AS 'SignName',
           abl.WasLost,
           ROW_NUMBER() OVER (PARTITION BY cd.Id ORDER BY abl.CreatedDate DESC) AS rn
    FROM Document d
    RIGHT JOIN CombinedData cd ON d.ID = cd.IdDocument
    LEFT JOIN DocumentStock ds ON cd.StockId = ds.Id
    LEFT JOIN CategoryColor cc ON d.IdCategoryColor = cc.Id
    LEFT JOIN CategorySign_V1 cs ON d.IdCategorySign_V1 = cs.Id
    LEFT JOIN AuditBookList abl ON abl.IdIndividualSample = cd.Id
    WHERE d.IsDeleted = 0
      AND d.ID IN (SELECT i.IdDocument FROM IndividualSample i)
      AND (abl.IsLiquidation IS NULL OR abl.IsLiquidation != 1)
)
SELECT *
FROM RankedData
WHERE rn = 1
ORDER BY
    DocumentStock,
    Price,
    PublishYear,
    Publisher,
    DocumentId,
    CAST(REVERSE(LEFT(REVERSE(SUBSTRING(NameIndividual, 1, CHARINDEX('/', NameIndividual) - 1)), PATINDEX('%[A-Za-z]%', REVERSE(SUBSTRING(NameIndividual, 1, CHARINDEX('/', NameIndividual) - 1)))-1)) AS INT);
";

        public const string AnalystBorrowBookMonthly = @"
WITH MonthSeries AS (SELECT 1 AS month_number
                     UNION ALL
                     SELECT month_number + 1
                     FROM MonthSeries
                     WHERE month_number < 12)
SELECT u.Id,
       u.Fullname,
       u.UnitId,
       u.UserTypeId,
       ms.month_number                                              AS Month,
       IIF(MONTH(dt.CreateDate) = ms.month_number, COUNT(dt.Id), 0) AS BorrowedBook
FROM MonthSeries ms
         CROSS JOIN
     [dbo].[User] u
         LEFT JOIN
     DocumentInvoice bb ON u.Id = bb.UserId AND bb.Status = 0 AND YEAR(BB.CreateDate) = YEAR(GETDATE())
         JOIN
     DocumentInvoiceDetail dt ON dt.IdDocumentInvoice = bb.Id
GROUP BY u.Id,
         u.Fullname,
         ms.month_number,
         DT.CreateDate,
         u.UnitId,
         u.UserTypeId
ORDER BY u.Id,
         Month";

       
    }
}