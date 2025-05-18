USE [TVS_Note]
GO

/****** Object:  Table [dbo].[CategorySignParents]    Script Date: 9/16/2024 2:25:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- thêm thuộc tính CategorySign_V1
IF COL_LENGTH('CategorySign_V1', 'IdCategoryParent') IS NULL
BEGIN
    ALTER TABLE CategorySign_V1
    ADD IdCategoryParent UNIQUEIDENTIFIER NULL;
END

-- thêm thuộc tính Document
IF COL_LENGTH('IndividualSample', 'IdCategoryParent') IS NULL
BEGIN
    ALTER TABLE IndividualSample
    ADD Price bigint NULL;
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
    DECLARE @RoleId1 UNIQUEIDENTIFIER = NEWID();
    INSERT INTO Role (Id, RoleName, Status, IsDeleted) VALUES (@RoleId1, N'Danh mục ký hiệu phân loại cha', 0, 0);
    INSERT INTO User_Role (Id, IdUser, IdRole) VALUES (NEWID(), '07A4428C-A576-4368-AE82-F18B8823963D', @RoleId1);
END
-- Thêm menu danh sách nhận xét đánh giá
IF NOT EXISTS (SELECT 1 FROM Navigation WHERE MenuName = N'Danh mục Kỳ tốt nghiệp')
BEGIN
    DECLARE @ID UNIQUEIDENTIFIER = NEWID();
    INSERT INTO Navigation(Id, MenuName, IdParent, Status, CreatedDate,Path,IconLink,MenuCode,Sort,IsHide) VALUES (@ID, N'Danh mục Kỳ tốt nghiệp'
	,'29A2BCA4-0A86-473A-84E6-81F11D3B85EB',0,GETDATE(),'/admin/MENU_QUAN_LI_KI_TOT_NGHIEP','ICON_MENU_TAO_PHIEU_THUC_TAP','MENU_QUAN_LI_KI_TOT_NGHIEP',26,0);
    INSERT INTO NavigationRole(Id, IdRole, IdNavigation) VALUES (NEWID(), 'BC9B963F-8CFF-42A5-836A-BF31D628A51D', @ID);
END
