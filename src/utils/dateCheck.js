export const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const filterPostsByWeek = (userPosts) => {
  const today = new Date();
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay()
  );
  const endOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + (6 - today.getDay())
  );

  const postsFromCurrentWeek = userPosts.filter((post) =>
    isDateInRange(new Date(post.timestamp), startOfWeek, endOfWeek)
  );

  return postsFromCurrentWeek;
};

export const isDateInRange = (date, startDate, endDate) => {
  return date >= startDate && date <= endDate;
};
