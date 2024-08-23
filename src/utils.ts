
export class Utils {
  static isNode = true;
  static isBrowser = false;
  static global = global;

  static fromB64ToArray(str: string): Uint8Array {

    // if (Utils.isNode) {
    //   return new Uint8Array(Buffer.from(str, "base64"));
    // } else {
      const binaryString = Utils.global.atob(str);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    // }
  }

  static fromUrlB64ToArray(str: string): Uint8Array {
    return Utils.fromB64ToArray(Utils.fromUrlB64ToB64(str));
  }

  static fromHexToArray(str: string): Uint8Array {
    if (Utils.isNode) {
      return new Uint8Array(Buffer.from(str, "hex"));
    } else {
      const bytes = new Uint8Array(str.length / 2);
      for (let i = 0; i < str.length; i += 2) {
        bytes[i / 2] = parseInt(str.substr(i, 2), 16);
      }
      return bytes;
    }
  }

    static fromUrlB64ToB64(urlB64Str: string): string {
    let output = urlB64Str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += "==";
        break;
      case 3:
        output += "=";
        break;
      default:
        throw new Error("Illegal base64url string!");
    }

    return output;
  }

  static fromUtf8ToArray(str: string): Uint8Array {
    if (Utils.isNode) {
      return new Uint8Array(Buffer.from(str, "utf8"));
    } else {
      const strUtf8 = unescape(encodeURIComponent(str));
      const arr = new Uint8Array(strUtf8.length);
      for (let i = 0; i < strUtf8.length; i++) {
        arr[i] = strUtf8.charCodeAt(i);
      }
      return arr;
    }
  }

  static fromByteStringToArray(str: string): Uint8Array {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i);
    }
    return arr;
  }

  static fromBufferToB64(buffer: ArrayBuffer): string {
    if (Utils.isNode) {
      return Buffer.from(buffer).toString("base64");
    } else {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return Utils.global.btoa(binary);
    }
  }

  static fromBufferToUrlB64(buffer: ArrayBuffer): string {
    return Utils.fromB64toUrlB64(Utils.fromBufferToB64(buffer));
  }

  static fromB64toUrlB64(b64Str: string) {
    return b64Str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  // static fromBufferToUtf8(buffer: ArrayBuffer): string {
  //   return BufferLib.from(buffer).toString("utf8");
  // }

  static fromBufferToByteString(buffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  // ref: https://stackoverflow.com/a/40031979/1090359
  static fromBufferToHex(buffer: ArrayBuffer): string {
    if (Utils.isNode) {
      return Buffer.from(buffer).toString("hex");
    } else {
      const bytes = new Uint8Array(buffer);
      return Array.prototype.map
        .call(bytes, (x: number) => ("00" + x.toString(16)).slice(-2))
        .join("");
    }
  }
}