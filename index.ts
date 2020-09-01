import crypto from "crypto";
const b32 = require("thirty-two");
const notp = require("notp");

interface IGenerateSecretOptions {
  name?: string;
  account?: string;
}

interface IGenerateSecretResult {
  secret: string;
  uri: string;
  qr: string;
}

interface IVerifyTokenOptions {
  secret: string;
  token: string;
  window?: number;
}

interface IVerifyTokenResult {
  delta: number;
}

export function generateSecret({ name, account }: IGenerateSecretOptions) {
  let bin = crypto.randomBytes(20);
  let base32 = b32.encode(bin).toString("utf8").replace(/=/g, "");
  let secret = base32
    .toLowerCase()
    .replace(/(\w{4})/g, "$1 ")
    .trim()
    .split(" ")
    .join("")
    .toUpperCase();
  let uri = `otpauth://totp/${encodeURIComponent(
    name || "App"
  )}:${encodeURIComponent(account || "")}%3Fsecret=${secret}`;
  return {
    secret,
    uri,
    qr: `https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=${uri}`,
  } as IGenerateSecretResult;
}

export function generateToken(secret: string = "") {
  if (secret === "") return null;
  let unformatted = secret.replace(/\W+/g, "").toUpperCase();
  let bin = b32.decode(unformatted);
  return { token: notp.totp.gen(bin) as string };
}

export function verifyToken({
  secret = "",
  token = "",
  window = 4,
}: IVerifyTokenOptions) {
  if (token === "" || secret === "") return null;

  let unformattedSecret = secret.replace(/\W+/g, "").toUpperCase();
  let bin = b32.decode(unformattedSecret);
  let unformattedToken = token.replace(/\W+/g, "");

  return notp.totp.verify(unformattedToken, bin, {
    window,
    time: 30,
  }) as IVerifyTokenResult;
}
