"use strict";

describe("WsseAuth", function() {
  const WsseAuth = require("../src/index");

  describe("#_getNonce", function() {
    it("should return a 32 characters long hex encoded string", function() {
      const value = WsseAuth._getNonce();
      const regex = new RegExp("^\\w{32}$", "i");
      expect(value).toMatch(regex);
    });
  });

  describe("#_getTimestamp", function() {
    it("should return an iso8601 formatted timestamp", function() {
      const value = WsseAuth._getTimestamp();
      const regex = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}");
      expect(value).toMatch(regex);
    });
  });

  describe("#_getDigest", function() {
    it("should return a base64 encoded string", function() {
      const value = WsseAuth._getDigest();
      const regex = new RegExp(
        "^(?:[\\w+/]{4})*(?:[\\w+/]{2}==|[\\w+/]{3}=)?$",
        "i"
      );
      expect(value).toMatch(regex);
    });
  });

  describe("#getHeader", function() {
    const dummyUsername = "username";
    const dummySecret = "secret";

    it("should have been called with the given username and password", function() {
      spyOn(WsseAuth, "getHeader");
      WsseAuth.getHeader(dummyUsername, dummySecret);
      expect(WsseAuth.getHeader).toHaveBeenCalledWith(
        dummyUsername,
        dummySecret
      );
    });

    it("should have called _getNonce once", function() {
      spyOn(WsseAuth, "_getNonce");
      WsseAuth.getHeader(dummyUsername, dummySecret);
      expect(WsseAuth._getNonce).toHaveBeenCalledTimes(1);
    });

    it("should have called _getTimestamp once", function() {
      spyOn(WsseAuth, "_getTimestamp");
      WsseAuth.getHeader(dummyUsername, dummySecret);
      expect(WsseAuth._getTimestamp).toHaveBeenCalledTimes(1);
    });

    it("should have called _getDigest once", function() {
      spyOn(WsseAuth, "_getDigest");
      WsseAuth.getHeader(dummyUsername, dummySecret);
      expect(WsseAuth._getDigest).toHaveBeenCalledTimes(1);
    });

    it("should return a wsse header", function() {
      const value = WsseAuth.getHeader(dummyUsername, dummySecret);
      expect(value["x-wsse"]).toBeDefined();
    });

    it("should return a valid value for the wsse header", function() {
      const dummyNonce = "nonce";
      const dummyTimestamp = "2018-07-25T22:44:48";
      const dummyDigest = "digest";
      spyOn(WsseAuth, "_getNonce").and.returnValue(dummyNonce);
      spyOn(WsseAuth, "_getTimestamp").and.returnValue(dummyTimestamp);
      spyOn(WsseAuth, "_getDigest").and.returnValue(dummyDigest);
      const value = WsseAuth.getHeader(dummyUsername, dummySecret);
      const regex = new RegExp(
        `^UsernameToken Username="${dummyUsername}", PasswordDigest="${dummyDigest}", Nonce="${dummyNonce}", Created="${dummyTimestamp}"$`
      );
      expect(value["x-wsse"]).toMatch(regex);
    });
  });
});
