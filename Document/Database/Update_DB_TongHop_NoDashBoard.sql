USE TVS_PGD_NamGiang
go

/****** Object:  Table [dbo].[CategorySignParents]    Script Date: 9/16/2024 2:25:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CategorySignParents]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[CategorySignParents](
        [Id] [uniqueidentifier] NOT NULL,
        [ParentName] [nvarchar](max) NULL,
        [ParentCode] [nvarchar](max) NULL,
        [IsDeleted] [bit] NULL,
        [CreateBy] [uniqueidentifier] NULL,
        [CreateDate] [datetime] NULL,
        [IsHided] [bit] NULL,
        [Status] [int] NULL,
        CONSTRAINT [PK_CategorySignParents] PRIMARY KEY CLUSTERED 
        (
            [Id] ASC
        ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO




-- thêm thuộc tính CategorySign_V1
IF COL_LENGTH('CategorySign_V1', 'IdCategoryParent') IS NULL
BEGIN
    ALTER TABLE CategorySign_V1
    ADD IdCategoryParent UNIQUEIDENTIFIER NULL;
END

-- thêm thuộc tính Document
IF COL_LENGTH('IndividualSample', 'Price') IS NULL
BEGIN
    ALTER TABLE IndividualSample
    ADD Price bigint NULL;
END
IF COL_LENGTH('IndividualSample', 'CheckUpdateIsLostedPhysicalVersion') IS NULL
BEGIN
    ALTER TABLE IndividualSample
    ADD CheckUpdateIsLostedPhysicalVersion int NULL DEFAULT 0;
END

GO

IF COL_LENGTH('IndividualSample', 'CheckUpdateIsLostedPhysicalVersion') IS NOT NULL
BEGIN
    UPDATE IndividualSample
    SET CheckUpdateIsLostedPhysicalVersion = 
        CASE 
            WHEN IsLostedPhysicalVersion = 1 THEN 1
            ELSE 0
        END;
END


-- thêm thuộc tính Document
IF COL_LENGTH('Document', 'IdCategoryParent') IS NULL
BEGIN
    ALTER TABLE Document
    ADD IdCategoryParent UNIQUEIDENTIFIER NULL;
END

-- Thêm mới MENU: 
IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = N'Danh mục ký hiệu phân loại cha')
BEGIN
    DECLARE @RoleId4 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO Role (Id, RoleName, Status, IsDeleted) VALUES (@RoleId4, N'Danh mục ký hiệu phân loại cha', 0, 0);
    INSERT INTO User_Role (Id, IdUser, IdRole) VALUES (NEWID(), '07A4428C-A576-4368-AE82-F18B8823963D', @RoleId4);
END
-- Sửa lại tên danh mục KHPL cha nếu đã có:
UPDATE Role
SET RoleName = N'Danh mục ký hiệu phân loại cha'
WHERE RoleName = N'Danh mục phân loại';

IF COL_LENGTH('Document', 'MagazineNumber') IS NULL
BEGIN
    ALTER TABLE Document
    ADD MagazineNumber NVARCHAR(MAX) NULL;
END

-- Kiểm tra và thêm các cột vào bảng ReceiptDetail nếu chưa tồn tại
IF COL_LENGTH('ReceiptDetail', 'StatusIndividual') IS NULL
BEGIN
    ALTER TABLE ReceiptDetail
    ADD StatusIndividual NVARCHAR(MAX) NULL;
END
-- Kiểm tra và thêm các cột vào bảng Receipt nếu chưa tồn tại
IF COL_LENGTH('Receipt', 'ExportDate') IS NULL
BEGIN
    ALTER TABLE Receipt
    ADD ExportDate DateTime NULL;
END

IF COL_LENGTH('Receipt', 'ReceiptNumber') IS NULL
BEGIN
    ALTER TABLE Receipt
    ADD ReceiptNumber NVARCHAR(MAX) NULL;
END

IF COL_LENGTH('Receipt', 'GeneralEntryNumber') IS NULL
BEGIN
    ALTER TABLE Receipt
    ADD GeneralEntryNumber NVARCHAR(MAX) NULL;
END

IF COL_LENGTH('Receipt', 'ReceiptType') IS NULL
BEGIN
    ALTER TABLE Receipt
    ADD ReceiptType INT NOT NULL DEFAULT 0;
END

-- Kiểm tra và thêm cột vào bảng ReceiptDetail nếu chưa tồn tại
IF COL_LENGTH('ReceiptDetail', 'IdIndividualSample') IS NULL
BEGIN
    ALTER TABLE ReceiptDetail
    ADD IdIndividualSample UNIQUEIDENTIFIER NULL;
END

-- Kiểm tra và thêm các cột vào bảng IndividualSample nếu chưa tồn tại
IF COL_LENGTH('IndividualSample', 'EntryDate') IS NULL
BEGIN
    ALTER TABLE IndividualSample
    ADD EntryDate DATETIME NULL;
END

IF COL_LENGTH('IndividualSample', 'GeneralEntryNumber') IS NULL
BEGIN
    ALTER TABLE IndividualSample
    ADD GeneralEntryNumber NVARCHAR(MAX) NULL;
END

IF COL_LENGTH('IndividualSample', 'IdReceipt') IS NULL
BEGIN
    ALTER TABLE IndividualSample
    ADD IdReceipt UNIQUEIDENTIFIER NULL;
END

-- Thêm mới MENU: Xuất sách và Phiếu xuất vào hệ thống nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = N'Xuất sách')
BEGIN
    DECLARE @RoleId1 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO Role (Id, RoleName, Status, IsDeleted) VALUES (@RoleId1, N'Xuất sách', 0, 0);
    INSERT INTO User_Role (Id, IdUser, IdRole) VALUES (NEWID(), '07A4428C-A576-4368-AE82-F18B8823963D', @RoleId1);
END

IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = N'Phiếu xuất')
BEGIN
    DECLARE @RoleId2 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO Role (Id, RoleName, Status, IsDeleted) VALUES (@RoleId2, N'Phiếu xuất', 0, 0);
    INSERT INTO User_Role (Id, IdUser, IdRole) VALUES (NEWID(), '07A4428C-A576-4368-AE82-F18B8823963D', @RoleId2);
END

-- Thêm mới MENU: Sổ đăng ký báo chí vào hệ thống nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = N'Sổ đăng ký báo chí')
BEGIN
    DECLARE @RoleId3 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO Role (Id, RoleName, Status, IsDeleted) VALUES (@RoleId3, N'Sổ đăng ký báo chí', 0, 0);
    INSERT INTO User_Role (Id, IdUser, IdRole) VALUES (NEWID(), '07A4428C-A576-4368-AE82-F18B8823963D', @RoleId3);
END

-- Kiểm tra và thêm các cột vào bảng ReceiptDetail nếu chưa tồn tại
IF COL_LENGTH('ReceiptDetail', 'StatusIndividual') IS NULL
BEGIN
    ALTER TABLE ReceiptDetail
    ADD StatusIndividual NVARCHAR(MAX) NULL;
END

-- Kiểm tra và thêm các cột vào bảng SchoolDocuments nếu chưa tồn tại
IF COL_LENGTH('SchoolDocuments', 'DoctypeStatus') IS NULL
BEGIN
    ALTER TABLE SchoolDocuments
    ADD DoctypeStatus int NULL DEFAULT 1;
END

--- 25/09/2024
-- Kiểm tra và thêm các cột vào bảng DocumentType nếu chưa tồn tại
--- ReleaseTerm - KyHanPhatHanh
IF COL_LENGTH('DocumentType', 'ReleaseTerm') IS NULL
BEGIN
    ALTER TABLE DocumentType
    ADD [ReleaseTerm] int NULL DEFAULT 0;
END

--- Language - NgonNgu
IF COL_LENGTH('DocumentType', 'Language') IS NULL
BEGIN
    ALTER TABLE DocumentType
    ADD [Language]  NVARCHAR(MAX) NULL;
END

--- PlaceOfProduction - NoiSanXuat
IF COL_LENGTH('DocumentType', 'PlaceOfProduction') IS NULL
BEGIN
    ALTER TABLE DocumentType
    ADD [PlaceOfProduction]  NVARCHAR(MAX) NULL;
END

--- PaperSize - KhoGiay
IF COL_LENGTH('DocumentType', 'PaperSize') IS NULL
BEGIN
    ALTER TABLE DocumentType
    ADD [PaperSize]  NVARCHAR(MAX) NULL;
END

--- NumberOfCopies - SoBanNhap
IF COL_LENGTH('DocumentType', 'NumberOfCopies') IS NULL
BEGIN
    ALTER TABLE DocumentType
    ADD [NumberOfCopies]  NVARCHAR(MAX) NULL;
END
---- Clear data Participants, ReceiptDetail, Receipt
--DELETE FROM Participants;
--DELETE FROM ReceiptDetail;
--DELETE FROM Receipt;

IF NOT EXISTS (SELECT * FROM sys.objects 
               WHERE object_id = OBJECT_ID(N'[dbo].[Supply]') 
               AND type = N'U')
BEGIN
    CREATE TABLE [dbo].[Supply](
        [ID] [uniqueidentifier] NOT NULL,
        [NameSupply] [nvarchar](max) NULL,
        CONSTRAINT [PK_Supply] PRIMARY KEY CLUSTERED 
        (
            [Id] ASC
        ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, 
               ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
        ) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
-- Trường tự mua
IF NOT EXISTS (SELECT 1 FROM [dbo].[Supply] WHERE [NameSupply] = N'Trường tự mua')
BEGIN
    INSERT INTO [dbo].[Supply] ([ID], [NameSupply]) 
    VALUES (NEWID(), N'Trường tự mua');
END

-- PGD cấp phát
IF NOT EXISTS (SELECT 1 FROM [dbo].[Supply] WHERE [NameSupply] = N'PGD cấp phát')
BEGIN
    INSERT INTO [dbo].[Supply] ([ID], [NameSupply]) 
    VALUES (NEWID(), N'PGD cấp phát');
END

-- SGD cấp phát
IF NOT EXISTS (SELECT 1 FROM [dbo].[Supply] WHERE [NameSupply] = N'SGD cấp phát')
BEGIN
    INSERT INTO [dbo].[Supply] ([ID], [NameSupply]) 
    VALUES (NEWID(), N'SGD cấp phát');
END

-- Biếu, tặng, quyên góp
IF NOT EXISTS (SELECT 1 FROM [dbo].[Supply] WHERE [NameSupply] = N'Biếu, tặng, quyên góp')
BEGIN
    INSERT INTO [dbo].[Supply] ([ID], [NameSupply]) 
    VALUES (NEWID(), N'Biếu, tặng, quyên góp');
END

-- Khác
IF NOT EXISTS (SELECT 1 FROM [dbo].[Supply] WHERE [NameSupply] = N'Khác')
BEGIN
    INSERT INTO [dbo].[Supply] ([ID], [NameSupply]) 
    VALUES (NEWID(), N'Khác');
END

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SchoolReceiptDetail]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SchoolReceiptDetail](
        [Id] [uniqueidentifier] NOT NULL,
		[IdDocument] [uniqueidentifier] NOT NULL,
		[IdIndividualSample] [uniqueidentifier] NULL,
		[IdSchool] [uniqueidentifier] NOT NULL,
        [ReceiptType] [int] NULL,
		[CreateDate] [datetime] NULL,
        CONSTRAINT [PK_SchoolReceiptDetail] PRIMARY KEY CLUSTERED 
        (
            [Id] ASC
        ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
END

GO
--- NumberOfCopies - SoBanNhap
IF COL_LENGTH('[SchoolAuditDetail]', 'IsLostedPhysicalVersion') IS NULL
BEGIN
    ALTER TABLE [SchoolAuditDetail]
    ADD IsLostedPhysicalVersion  bit NULL;
END

--- NumberOfCopies - SoBanNhap
IF COL_LENGTH('[SchoolAuditDetail]', 'IdIndividualSample') IS NULL
BEGIN
    ALTER TABLE [SchoolAuditDetail]
    ADD IdIndividualSample  uniqueidentifier NULL;
END


UPDATE [CategorySign_V1]
SET SignCode = N'ĐV13'
WHERE SignName = N'Truyện' AND SignCode = 'ĐV13' AND EXISTS (
    SELECT 1 FROM [CategorySign_V1]
    WHERE SignName = N'Truyện' AND SignCode = 'ĐV13'
)

IF COL_LENGTH('[SchoolReceiptDetail]', 'Status') IS NULL
BEGIN
    ALTER TABLE [SchoolReceiptDetail]
    ADD Status  int NULL;
END

IF COL_LENGTH('[SchoolReceiptDetail]', 'CreateDateIndi') IS NULL
BEGIN
    ALTER TABLE [SchoolReceiptDetail]
    ADD CreateDateIndi  datetime NULL;
END

IF COL_LENGTH('[SchoolReceiptDetail]', 'DocTypeName') IS NULL
BEGIN
    ALTER TABLE [SchoolReceiptDetail]
    ADD DocTypeName  nvarchar(MAX) NULL;
END