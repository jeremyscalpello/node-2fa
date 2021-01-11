declare module "node-2fa" {
  export interface Options {
    name: string;
    account: string;
  }

  export interface Secret {
    secret: string;
    uri: string;
    qr: string;
  }

  export interface GenerateResult {
    token: string;
  }

  export interface VerifyResult {
    delta: number;
  }

  type Node2FA = {
    generateSecret: (options: Options) => Secret;
    generateToken: () => GenerateResult;
    verifyToken: (secret: string, code: string) => VerifyResult;
  };

  export = Node2FA;
}
