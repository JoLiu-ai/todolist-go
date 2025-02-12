/**
 * 日期工具函数
 */

/**
 * 格式化日期为 YYYY-MM-DD 格式
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm 格式
 */
export const formatDateTime = (date: Date): string => {
  return date.toISOString().slice(0, 16).replace('T', ' ');
};

/**
 * 判断日期是否为今天
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * 判断日期是否已过期
 */
export const isOverdue = (date: Date): boolean => {
  const now = new Date();
  return date < now;
}; 