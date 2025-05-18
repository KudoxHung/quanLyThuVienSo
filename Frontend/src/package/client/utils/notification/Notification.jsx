const { notification } = require("antd");

export const openNotificationWithIcon = (
  type,
  title,
  contract,
  duration = 4,
  placement = "topRight",
) => {
  notification[type]({
    message: title,
    description: contract,
    duration: duration,
    placement: placement,
  });
};
