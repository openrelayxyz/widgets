import "@openrelay/sra-element";
import {getFakeWeb3} from "@openrelay/element-test-utils";
import {assert} from "chai";


describe('<or-sra>', () => {
  var testArea;
  before(() => {
    testArea = document.createElement("div");
    document.body.appendChild(testArea);
  });
  beforeEach(() => {
    testArea.innerHTML = "";
  })
  it('should hasWeb3 == false', () => {
    testArea.innerHTML = '<or-sra id="fixture">Web3 Content</or-sra>';
    assert.isFalse(document.getElementById("fixture").hasWeb3);
    return document.getElementById("fixture").requestUpdate().then(() => {
      setTimeout(() => {
        assert.equal(document.getElementById("fixture").shadowRoot.innerHTML, '<slot name="noweb3">You need web3 to view this content</slot>');
      }, 250);
    })
  });
  it('should hasWeb3 == true', () => {
    testArea.innerHTML = '<or-sra id="fixture">Web3 Content</or-sra>';
    var web3 = getFakeWeb3();
    document.getElementById("fixture").dispatchEvent(
      new CustomEvent('set-web3', {detail: {web3: web3}, bubbles: false, composed: false})
    );
    setTimeout(() => {
      return document.getElementById("fixture").requestUpdate().then(() => {
        assert.isTrue(document.getElementById("fixture").hasWeb3);
        assert.equal(document.getElementById("fixture").shadowRoot.innerHTML, '<slot></slot>');
        web3.currentProvider.stop(console.log);
      });
    });
  });
  it('should sra == "https://api.openrelay.xyz/"', () => {
    testArea.innerHTML = '<or-sra id="fixture">Web3 Content</or-sra>';
    assert.equal(document.getElementById("fixture").sra, "https://api.openrelay.xyz/");
  });
  it('should sra == "https://other.relayer.com/path/"', () => {
    testArea.innerHTML = '<or-sra id="fixture" sra="https://other.relayer.com/path/">Web3 Content</or-sra>';
    assert.equal(document.getElementById("fixture").sra, "https://other.relayer.com/path/");
  });
  it('should sra == "https://other.relayer.com/path/"', () => {
    testArea.innerHTML = '<or-sra id="fixture">Web3 Content</or-sra>';
    assert.equal(document.getElementById("fixture").sra, "https://api.openrelay.xyz/");
    document.getElementById("fixture").sra = "https://other.relayer.com/path/";
    return document.getElementById("fixture").requestUpdate().then(() => {
      assert.equal(document.getElementById("fixture").sra, "https://other.relayer.com/path/");
    })
  });
});
