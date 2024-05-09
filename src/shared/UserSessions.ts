// session stores for server (cached)

import { TemporaryMap } from "@library";
import { I_User } from "@services";

// 1 hour session by default
export const sessions = new TemporaryMap<string, I_User>(60 * 60 * 1000);

export default sessions;