import { getUserFromUsernameDb, getUserNameFromRegexDb, updateInformationDb, updatePasswordDb, updateImageDb, checkUsernameDb } from "../db/user.db.js";
import { ErrorHandler } from "../middlewares/error.js";

class UserService {
  static getUserFromUsername = async (data) => {
    try {
      return await getUserFromUsernameDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static getUserNameFromRegex = async (data) => {
    try {
      return await getUserNameFromRegexDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static checkUsername = async (data) => {
    try {
      return await checkUsernameDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static updateInformation = async (data) => {
    try {
      return await updateInformationDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static updatePassword = async (data) => {
    try {
      return await updatePasswordDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static updateImage = async (data) => {
    try {
      return await updateImageDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
}


export default UserService;
