import c_active from "./active";
import c_inline from "./inline";
import c_experimental from "./experimental";
import c_private from "./private";
import c_hidden from "./hidden";

export const active = [...c_active, ...c_hidden];
export const inline = c_inline;
export const experimental = c_experimental;

export default {active, inline, experimental, c_private};