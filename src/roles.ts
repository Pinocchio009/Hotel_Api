import {AccessControl} from "accesscontrol";


const ac = new AccessControl();

ac.grant("guest")
  .readOwn("profile")
  .updateOwn("profile");

ac.grant("admin")
  .extend("guest")
  .updateAny("profile")
  .deleteAny("profile");

export const roles = ac;
