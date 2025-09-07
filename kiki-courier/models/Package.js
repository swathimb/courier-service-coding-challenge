class Package {
    constructor(id, pkgId, weight, distance, offerCode) {
        this.id = id;
        this.pkgId = pkgId;
        this.weight = weight;
        this.distance = distance;
        this.offerCode = offerCode;
        this.discount = 0;
        this.totalCost = 0;
        this.estimatedDeliveryTime = 0;
    }
}

export default Package;