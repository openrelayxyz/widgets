export default class AssetData {
  constructor(assetDataString) {
    this.type = assetDataString.slice(2, 10);
    this.address = "0x" + assetDataString.slice(34, 74);
    if(this.type == "02571792") {
      this.tokenId = assetDataString.slice(74);
    }
  }
}
