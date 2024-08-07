// session stores for server (cached)

import { TemporaryMap } from "@library";
import { User } from "@models";

// 1 hour session by default
export const sessions = new TemporaryMap<string, User>(60 * 60 * 1000);

export default sessions;