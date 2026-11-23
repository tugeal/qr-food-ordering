import { describe, expect, it } from "vitest";
import { describePlace } from "./format";

describe("describePlace", () => {
  it("describes dine-in with and without a table", () => {
    expect(describePlace({ type: "dine_in", table: "4" })).toBe("Dine-in · Table 4");
    expect(describePlace({ type: "dine_in", table: null })).toBe("Dine-in");
  });

  it("describes takeout", () => {
    expect(describePlace({ type: "takeout", table: null })).toBe("Takeout");
  });
});
