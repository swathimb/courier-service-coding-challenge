function createDeliveryCombinations(packages, maxWeight) {
    let sortedByWeight = [...packages].sort((a, b) => {
      //if same weight, sort by distance ascending
      if (a.weight === b.weight) return a.distance - b.distance;
      return b.weight - a.weight;
    }); // sort by weight descending
    console.log("Sorted Packages by weight:", sortedByWeight);
    let combinations = [];
    while (sortedByWeight.length > 0) {
        let resultCombination = [];
        for (let i = 0; i < sortedByWeight.length; i++) {
            let j=0;
            let totalWeight = sortedByWeight[i].weight;
            let tempCombination = [sortedByWeight[i]];
            while(j < sortedByWeight.length) {
                if(i !== j && (totalWeight + sortedByWeight[j].weight) <= maxWeight) {
                    totalWeight += sortedByWeight[j].weight;
                    tempCombination.push(sortedByWeight[j]);
                }
                j++;
            }
            if (tempCombination.length > 0) {
                resultCombination.push(tempCombination);
            }
        }
        //Remove redundant combinations
        resultCombination = uniqueCombinations(resultCombination);

        // Find max length among subsets
        let maxLen = Math.max(...resultCombination.map(sub => sub.length));

        // Filter to only those with max length
        let maxSubsets = resultCombination.filter(sub => sub.length === maxLen);

        // Choose the combination with the heaviest first package
        maxSubsets.sort((a, b) => b[0].weight - a[0].weight);
        resultCombination = maxSubsets[0];

        combinations.push(resultCombination);
        sortedByWeight = sortedByWeight.filter(n => !resultCombination.includes(n));
    }
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

// Function to create a unique signature for each array
function getSignature(arr) {
  // Sort objects by 'id' to handle different orderings
  return arr
    .map(obj => obj.id)        // Extract 'id' from each object
    .sort((a, b) => a - b)    // Sort numerically
    .join(',');                // Join into a string signature
}

function uniqueCombinations(data) {
    const seen = new Set();
    const unique = data.filter(arr => {
    const signature = getSignature(arr);
    if (seen.has(signature)) {
        return false;
    }
    seen.add(signature);
    return true;
    });
    return unique;
}

export { createDeliveryCombinations, calculateDeliveryTimes };