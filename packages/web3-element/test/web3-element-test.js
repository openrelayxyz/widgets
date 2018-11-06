import "@openrelay/web3-element";
import {getFakeWeb3} from "@openrelay/element-test-utils";
import {assert} from "chai";


describe('<or-web3>', () => {
  var testArea;
  before(() => {
    testArea = document.createElement("div");
    document.body.appendChild(testArea);
  });
  beforeEach(() => {
    testArea.innerHTML = "";
  })
  it('should hasWeb3 == false', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Web3 Content</or-web3>';
    assert.isFalse(document.getElementById("fixture").hasWeb3);
    assert.equal(document.getElementById("fixture").shadowRoot.innerHTML, '<slot name="noweb3">You need web3 to view this content</slot>');
  });
  it('should hasWeb3 == true', () => {
    testArea.innerHTML = '<or-web3 id="fixture">Web3 Content</or-web3>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    return document.getElementById("fixture").requestUpdate().then(() => {
      assert.isTrue(document.getElementById("fixture").hasWeb3);
      assert.equal(document.getElementById("fixture").shadowRoot.innerHTML, '<slot></slot>');
      web3.currentProvider.stop(console.log);
    });
  });
});
