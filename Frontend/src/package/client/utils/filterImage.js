const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

// filter Array Image for sizeImage
export function getImageFilterForSizeImage(arr, sizeImage = 1) {
  //sizeImage = 1 -> 200x230
  //sizeImage = 2 -> 400x460
  if (arr?.length > 0) {
    const filterArr = arr?.filter(
      (item) => item?.sizeImage === String(sizeImage),
    );
    return `${apiUrl}/api/Book/GetFileImage?fileNameId=${filterArr[0]?.id}.${filterArr[0]?.fileNameExtention}`;
  }
  return;
}
