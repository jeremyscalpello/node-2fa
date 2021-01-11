import { generateSecret, generateToken, verifyToken } from "../src";

test("Generates a valid secret without options", () => {
  expect(typeof generateSecret().secret).toBe("string");
});

test("Generates a valid token", () => {
  const { secret } = generateSecret();
  const result = generateToken(secret);
  expect(typeof result?.token).toBe("string");
});

test("Verifies a valid token", () => {
  const { secret } = generateSecret();

  const result = generateToken(secret);
  expect(typeof result?.token).toBe("string");

  const verification = verifyToken(secret, result?.token);
  expect(typeof verification?.delta).toBe("number");
});

test("Verifies a token with window 1", () => {
  const { secret } = generateSecret();

  const result = generateToken(secret);
  expect(typeof result?.token).toBe("string");

  const verification = verifyToken(secret, result?.token, 1);
  expect(typeof verification?.delta).toBe("number");
});

test("Verifies a token with window -3", () => {
  const { secret } = generateSecret();

  const result = generateToken(secret);
  expect(typeof result?.token).toBe("string");

  const verification = verifyToken(secret, result?.token, -3);
  expect(verification).toBeFalsy();
});

test("Check an invalid token", () => {
  const { secret } = generateSecret();

  const verification = verifyToken(secret, "111111");
  expect(verification).toBeFalsy();
});
