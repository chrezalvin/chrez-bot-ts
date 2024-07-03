import { calculateExpression } from "@commands/active/calculate";
jest.useFakeTimers();

const basicCalculationMap = new Map<string, string>([
    ["2 + 2", "4"],
    ["6 * 2", "12"],
    ["9 / 3", "3"],
    ["12 - 6", "6"],
    ["2 + 2 * 2", "6"],
    ["(2 + 2) * 2", "8"],
    ["2          +      2", "4"],
    ["2k + 2", "2002"],
    ["2k + 4m", "4002k"]
]);

const advancedCalculationMap = new Map<string, string>([
    ["sum(1,2,3,4,5,6,7,8,9,10)", "55"],
    ["multiply(1,2,3,4,5,6,7,8,9,10)", "3628800"],
    ["sub(1,2,3,4,5,6,7,8,9,10)", "-53"],
    ["sum(1,2,3,4,5,6,7,8,9,10) * 2", "110"],
    ["sum(1, 2k, 3)", "2004"],
]);

describe("Test Chrez calculate", () => {
    test("basic calculation test", () => {
        for(const [input, output] of basicCalculationMap)
            expect(calculateExpression(input)).toBe(output);
    });

    test("advanced calculation test", () => {
        for(const [input, output] of advancedCalculationMap)
            expect(calculateExpression(input)).toBe(output);
    });
});