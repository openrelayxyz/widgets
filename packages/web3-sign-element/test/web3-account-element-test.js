import "@openrelay/web3-account-element";
import "@openrelay/web3-element";
import {getFakeWeb3} from "@openrelay/element-test-utils";
import {assert} from "chai";


describe('<or-web3-account>', () => {
  var testArea;
  before(() => {
    testArea = document.createElement("div");
    document.body.appendChild(testArea);
  });
  beforeEach(() => {
    testArea.innerHTML = "";
  })
  it('should have id of 0xf00df00d...', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Content <or-web3-account id="test-element"></or-web3-account></or-web3>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    return document.getElementById('test-element').accountReady.then(() => {
      document.getElementById("test-element").requestRender();
      return document.getElementById("fixture").renderComplete.then(() => {
        assert.notEqual(document.getElementById('test-element').shadowRoot.innerHTML.indexOf("0xf00df00df00df00df00df00df00df00df00df00d"), -1);
        web3.currentProvider.stop(console.log);
      });
    })
  });
});
