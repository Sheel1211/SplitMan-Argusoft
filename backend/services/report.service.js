import { getGroupExpenses, getFriendExpenses } from '../db/report.db.js';

export const generateGroupReport = async (groupId) => {
  const expenses = await getGroupExpenses(groupId);
  return expenses;
};

export const generateFriendReport = async (userId, friendId) => {
  const expenses = await getFriendExpenses(userId, friendId);
  return expenses;
};
