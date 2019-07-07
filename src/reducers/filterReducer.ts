import { FilterAction } from "../typeDefinitions";

const filterReducer = (state: string, action: FilterAction) => {
  switch (action.type) {
    case "SHOW_ALL":
      return "ALL";
    case "SHOW_COMPLETE":
      return "COMPLETE";
    case "SHOW_INCOMPLETE":
      return "INCOMPLETE";
    default:
      throw new Error();
  }
};

export default filterReducer;
