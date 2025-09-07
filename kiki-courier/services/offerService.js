// Offers definition
const offers = {
  OFR001: {
    discount: 0.1,
    distance: (d) => d < 200,
    weight: (w) => w >= 70 && w <= 200,
  },
  OFR002: {
    discount: 0.07,
    distance: (d) => d >= 50 && d <= 150,
    weight: (w) => w >= 100 && w <= 250,
  },
  OFR003: {
    discount: 0.05,
    distance: (d) => d >= 50 && d <= 250,
    weight: (w) => w >= 10 && w <= 150,
  },
};

// Check discount eligibility
function getDiscount(deliveryCost, offerCode, distance, weight) {
  const offer = offers[offerCode];
  if (offer && offer.distance(distance) && offer.weight(weight)) {
    return parseFloat((deliveryCost * offer.discount).toFixed(2));
  }
  return 0;
}

export { getDiscount };