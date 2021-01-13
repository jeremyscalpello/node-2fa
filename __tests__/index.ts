import { generateSecret, generateToken, verifyToken } from "../src";

describe("node-2fa", () => {
  const { secret } = generateSecret();
  const token = generateToken(secret);

  test("Generates a valid secret without options", () => {
    expect(typeof secret).toBe("string");
  });

  test("Generates a valid token", () => {
    expect(typeof token?.token).toBe("string");
  });

  test("Verifies a valid token", () => {
    const verification = verifyToken(secret, token?.token);
    expect(typeof verification?.delta).toBe("number");
  });

  test("Verifies a token with window 1", () => {
    const verification = verifyToken(secret, token?.token, 1);
    expect(typeof verification?.delta).toBe("number");
  });

  test("Verifies a token with window -3", () => {
    const verification = verifyToken(secret, token?.token, -3);
    expect(verification).toBeNull();
  });

  test("Check an invalid token", () => {
    const verification = verifyToken(secret, "111111");
    expect(verification).toBeNull();
  });
});
