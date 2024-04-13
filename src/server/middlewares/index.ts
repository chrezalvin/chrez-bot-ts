import sessionCheck from "./sessionCheck";

// you need to be careful with the order of the middlewares
const middlewares = [
    sessionCheck
];