 function createDeliveryCombinations(packages, maxWeight) {
  let sortedByWeight = [...packages].sort((a, b) => b.weight - a.weight); // sort descending
  let combinations = [];

  while (sortedByWeight.length > 0) {
    let combo = [];
    let total = 0;

    for (let i = 0; i < sortedByWeight.length; i++) {
      if (total + sortedByWeight[i].weight <= maxWeight) {
        total += sortedByWeight[i].weight;
        combo.push(sortedByWeight[i]);
      }
    }

    if (combo.length === 0) break;
    combinations.push(combo);
    sortedByWeight = sortedByWeight.filter(n => !combo.includes(n));

  }
  // Sort combination:
    combinations.sort((a, b) => {
      if (b.length !== a.length) {
        return b.length - a.length;
      }
      if (a.length === 1 && b.length === 1) {
        return b[0] - a[0];
      }
      return 0;
    });

    return combinations;
}

function calculateDeliveryTimes(deliveryCombinations, vehiclesInfo) {
  let vehicles = new Array(vehiclesInfo.noVehicles).fill(0);
  for(let i = 0; i < deliveryCombinations.length; i++) {
    let nextVehicleIndex = vehicles.indexOf(Math.min(...vehicles));
    let j =0;
    let estimatedTime = [];
    while(j < deliveryCombinations[i].length) {
      const time = parseFloat((deliveryCombinations[i][j].distance / vehiclesInfo.speed).toFixed(2));
      deliveryCombinations[i][j].estimatedDeliveryTime = (vehicles[nextVehicleIndex] + time);
      estimatedTime.push(time);
      j++;
    }

    let deliveryTime = Math.max(...estimatedTime);
    if(i < deliveryCombinations.length + 1){
      vehicles[nextVehicleIndex] = vehicles[nextVehicleIndex] + 2 * deliveryTime;
    } else {
      vehicles[nextVehicleIndex] += deliveryTime;
    }
  }
}

export { createDeliveryCombinations, calculateDeliveryTimes };