
// Check discount eligibility
function getDiscount(deliveryCost, offerCode, distance, weight, offers) {
  const offer = offers[offerCode];
  if (offer && offer.distance(distance) && offer.weight(weight)) {
    return parseFloat((deliveryCost * offer.discount).toFixed(2));
  }
  return 0;
}

export { getDiscount };