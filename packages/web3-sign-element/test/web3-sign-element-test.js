import "@openrelay/web3-sign-element";
import "@openrelay/web3-element";
import {getFakeWeb3} from "@openrelay/element-test-utils";
import {assert} from "chai";
import * as ethjsutil from 'ethereumjs-util';


describe('<or-web3-sign>', () => {
  var testArea;
  before(() => {
    testArea = document.createElement("div");
    document.body.appendChild(testArea);
  });
  beforeEach(() => {
    testArea.innerHTML = "";
  })
  it('should sign the message', () => {
    var web3 = getFakeWeb3(true);
    testArea.innerHTML = '<or-web3 id="fixture">Content <or-web3-sign id="test-element" message="' + web3.sha3("hello world") + '"></or-web3-sign></or-web3>';
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    return document.getElementById('test-element').accountReady.then(() => {
      return new Promise((resolve, reject) => {
        document.getElementById('test-element').addEventListener("sign", (e) => {
          if(e.detail.error){
            assert.isOk(false, e.detail.error);
            reject(e.detail.error);
            return;
          }
          let message = ethjsutil.toBuffer(document.getElementById('test-element').message);
          let signature = ethjsutil.toBuffer(document.getElementById('test-element').value);
          let v = signature[0];
          let r = signature.slice(1, 33);
          let s = signature.slice(33, 65);
          let sigType = signature[65];
          if(sigType == 3) {
            message = ethjsutil.keccak256(Buffer.concat([ethjsutil.toBuffer("\x19Ethereum Signed Message:\n32"), message]));
          }
          assert.equal(
            ethjsutil.bufferToHex(ethjsutil.pubToAddress(ethjsutil.ecrecover(message, v, r, s))),
            document.getElementById('test-element').account
          );
          resolve();
        });
        document.getElementById('test-element').shadowRoot.querySelector("button").click();
      });
    })
  });
});
