import { combineReducers } from "redux";
import admin from "../admin/admin.reducers";
import user from "../user/user.reducer";
import modal from "../modal/modal.reducer";
import alert from "../alert/alert.reducer";
import profile from "../profile/profile.reducer";
import course from "../course/course.reducer";

const rootReducer = combineReducers({
  alert,
  modal,
  admin,
  user,
  profile,
  course,
});

export default rootReducer;
