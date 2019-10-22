import * as CryptoJS from "crypto-js";
import { Constants } from '../constants/constants';


export class Helper {
  
  static encrypt(text: string): any {
    const encrypt = CryptoJS.AES.encrypt(text, Constants.Secret_Key);
    return btoa(encrypt.toString());
  }

  static decrypt(text: string): any {
    const decrypted = CryptoJS.AES.decrypt(atob(text), Constants.Secret_Key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
