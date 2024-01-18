export const formatTimestamp = (timestamp) => {
  const postDate = new Date(timestamp);
  const currentDate = new Date();

  const postDay = postDate.getDate();
  const postMonth = postDate.getMonth() + 1;
  const postYear = postDate.getFullYear();

  const postHour = postDate.getHours();
  const postMinute = postDate.getMinutes();

  if (
    postDay === currentDate.getDate() &&
    postMonth === currentDate.getMonth() + 1 &&
    postYear === currentDate.getFullYear()
  ) {
    const formattedTime = `${postHour}:${
      postMinute < 10 ? "0" : ""
    }${postMinute}`;
    return formattedTime;
  } else {
    const formattedDate = `${postDay}/${postMonth}/${postYear}`;
    return formattedDate;
  }
};
