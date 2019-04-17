

var wsseHeader = wsseHeader(pm.environment.get("wsse-user"), pm.environment.get("wsse-secret")); 

pm.environment.set("wsse-header", wsseHeader);



function encodePassword(stringInput, iterations = 5000){
  
  hashWordArray = CryptoJS.SHA512(stringInput);
  uint8array    = convertWordArrayToUint8Array(hashWordArray);
  binaryString  = convertUint8ArrayToBinaryString(uint8array);

  for (var i=1; i<iterations; i++) {
      wordArrayFromString = CryptoJS.enc.Latin1.parse(binaryString+stringInput);
      hashWordArray = CryptoJS.SHA512(wordArrayFromString);
      uint8array    = convertWordArrayToUint8Array(hashWordArray);
      binaryString  = convertUint8ArrayToBinaryString(uint8array);
  }

  return binaryString;
}


// wsse header gernerate functions from
// https://github.com/vrruiz/wsse-js/blob/master/wsse.js

function wsse(Password) {
    var PasswordDigest, Nonce, Created;
    var r = new Array;
    var dateobj = new Date();
    var Created = dateobj.toISOString().split('.')[0]+"Z";
    

    Nonce = Created+'There is more than words'+Math.random();
    NonceEncoded = btoa(Nonce);

    concatenated = Nonce + Created + Password;

    PasswordDigest = encodePassword(concatenated);
    PasswordDigestEncoded = btoa(PasswordDigest);

    r[0] = NonceEncoded;
    r[1] = Created;
    r[2] = PasswordDigestEncoded;
    return r;
}

function wsseHeader(Username, Password) {
    var w = wsse(Password);
    var header = 'UsernameToken Username="' + Username + '", PasswordDigest="' + w[2] + '", Nonce="' + w[0] + '", Created="' + w[1] + '"';
    return header;
}



// binary transform functions from
// https://gist.github.com/getify/7325764

function convertWordArrayToUint8Array(wordArray) {
	var len = wordArray.words.length,
		u8_array = new Uint8Array(len << 2),
		offset = 0, word, i
	;
	for (i=0; i<len; i++) {
		word = wordArray.words[i];
		u8_array[offset++] = word >> 24;
		u8_array[offset++] = (word >> 16) & 0xff;
		u8_array[offset++] = (word >> 8) & 0xff;
		u8_array[offset++] = word & 0xff;
	}
	return u8_array;
}

function convertUint8ArrayToBinaryString(u8Array) {
	var i, len = u8Array.length, b_str = "";
	for (i=0; i<len; i++) {
		b_str += String.fromCharCode(u8Array[i]);
	}
	return b_str;
}


