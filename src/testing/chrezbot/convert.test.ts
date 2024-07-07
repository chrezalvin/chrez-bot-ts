import { conversion } from "@commands/active/convert";

const conversionTestsTemp = [
    {
        value: 0,
        fromUnit: "C",
        toUnit: "K",
        expected: 273.15
    },
    {
        value: 273.15,
        fromUnit: "K",
        toUnit: "C",
        expected: 0
    },
    {
        value: 0,
        fromUnit: "C",
        toUnit: "F",
        expected: 32
    },
    {
        value: 32,
        fromUnit: "F",
        toUnit: "C",
        expected: 0
    },
    {
        value: 32,
        fromUnit: "F",
        toUnit: "K",
        expected: 273.15
    }
];

const conversionTestsDist = [
    {
        value: 0,
        fromUnit: "m",
        toUnit: "cm",
        expected: 0
    },
    {
        value: 0,
        fromUnit: "cm",
        toUnit: "m",
        expected: 0
    },
    {
        value: 1,
        fromUnit: "m",
        toUnit: "cm",
        expected: 100
    },
    {
        value: 100,
        fromUnit: "cm",
        toUnit: "m",
        expected: 1
    }
];

describe("test converting unit", () => {
    test("Temperature conversion test", () => {
        for(const conversionTest of conversionTestsTemp)
            expect(conversion(conversionTest.value, conversionTest.fromUnit, conversionTest.toUnit)).toBe(conversionTest.expected);
    });

    test("Distance conversion test", () => {
        for(const conversionTest of conversionTestsDist)
            expect(conversion(conversionTest.value, conversionTest.fromUnit, conversionTest.toUnit)).toBe(conversionTest.expected);
    });

    test("Invalid unit test", () => {
        expect(() => conversion(0, "C", "invalid")).toThrow();
        expect(() => conversion(0, "cm", "C")).toThrow();
    });
});