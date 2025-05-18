export const formatDate = (date, format) => {
  const day = new Date(date);
  const o = {
    "M+": day.getMonth() + 1,
    "d+": day.getDate(),
    "h+": day.getHours(),
    "m+": day.getMinutes(),
    "s+": day.getSeconds(),
    "q+": Math.floor((day.getMonth() + 3) / 3),
    S: day.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (day.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};
