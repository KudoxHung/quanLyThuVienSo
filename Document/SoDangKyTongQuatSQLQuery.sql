SELECT 
    ROW_NUMBER() OVER (ORDER BY D.[DocumentTypeId] ASC) AS STT,
    D.[ID],
    D.[DocName],
    D.[DocumentTypeId],
    DT.[DocTypeName],
    COUNT(IndSamp.[Id]) AS CountIndividualSamples,
    D.[CreatedDate],
    D.[Language],
    D.[Price]
FROM 
    [ThuVienSo_Note].[dbo].[Document] AS D
LEFT JOIN 
    [ThuVienSo_Note].[dbo].[IndividualSample] AS IndSamp ON D.[ID] = IndSamp.[IdDocument]
LEFT JOIN 
    [ThuVienSo_Note].[dbo].[DocumentType] AS DT ON D.[DocumentTypeId] = DT.[Id]
WHERE 
    D.[CreatedDate] BETWEEN '2023-01-01' AND '2024-01-12'
GROUP BY 
    D.[ID],
    D.[DocName],
    D.[DocumentTypeId],
    DT.[DocTypeName],
    D.[CreatedDate],
    D.[Language],
    D.[Price]
ORDER BY 
    D.[DocumentTypeId] ASC;
	
	



