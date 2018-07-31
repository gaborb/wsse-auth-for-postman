((pm, module) => {
  "use strict";

  const uuid = require("uuid");
  const CryptoJS = require("crypto-js");

  class WsseAuth {
    static _getNonce() {
      const rand = uuid.v4();
      const hex = CryptoJS.enc.Utf8.parse(rand).toString(CryptoJS.enc.Hex);
      return hex.substring(hex.length - 32);
    }

    static _getTimestamp() {
      return new Date().toISOString();
    }

    static _getDigest(nonce, timestamp, secret) {
      const hex = CryptoJS.SHA1("" + nonce + timestamp + secret).toString(
        CryptoJS.enc.Hex
      );
      return CryptoJS.enc.Utf8.parse(hex).toString(CryptoJS.enc.Base64);
    }

    static getHeader(username, secret) {
      const nonce = WsseAuth._getNonce();
      const timestamp = WsseAuth._getTimestamp();
      const digest = WsseAuth._getDigest(nonce, timestamp, secret);
      const header = `UsernameToken Username="${username}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
      return { "x-wsse": header };
    }
  }

  if (module) {
    module.exports = WsseAuth;
  }

  if (pm) {
    const username = pm.variables.get("x-wsse-username");
    const secret = pm.variables.get("x-wsse-secret");
    const header = WsseAuth.getHeader(username, secret);
    pm.variables.set("x-wsse", header["x-wsse"]);
  }
})(
  typeof pm === "undefined" ? null : pm,
  typeof module === "undefined" ? null : module
);
