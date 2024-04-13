// session stores for server (cached)

import { TemporaryMap } from "@library/TemporaryMap";
import { I_User } from "@services/users";

export const sessions = new TemporaryMap<string, I_User>(60 * 60 * 1000);

export default sessions;