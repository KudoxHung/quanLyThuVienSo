USE TVS_Note_TTH_PhongHoa1
go

/****** Object:  Table [dbo].[CategorySignParents]    Script Date: 9/16/2024 2:25:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


UPDATE i
SET i.IdReceipt = r.IdReceipt
FROM IndividualSample i
JOIN ReceiptDetail rd ON i.IdDocument = rd.IdDocument
JOIN Receipt r ON r.IdReceipt = rd.IdReceipt
WHERE r.IdReceipt in (select DISTINCT r.IdReceipt from IndividualSample i join ReceiptDetail a on a.IdDocument = i.IdDocument
join Receipt r on r.IdReceipt = a.IdReceipt where i.IdReceipt is null and CAST(i.CreatedDate AS DATE) = CAST(r.CreatedDate AS DATE))
  AND CAST(i.CreatedDate AS DATE) = CAST(r.CreatedDate AS DATE)
  AND r.IsDeleted != 1
  AND r.ReceiptType = 0

UPDATE r
SET r.ReceiptNumber = r.ReceiptCode
FROM Receipt r
where r.ReceiptNumber is null

update i
set i.Price = d.Price
from IndividualSample i join Document d on i.IdDocument = d.ID
where d.Price is not null and i.Price is null