# Kiki's Courier Service CLI

This is a Node.js command-line application to calculate delivery costs and estimated delivery times based on input packages and vehicle details.

## Requirements
- Node.js version >= 14.x (LTS recommended)
- No additional packages are required

## How to Run

1. Clone the repository or download the files. (https://github.com/swathimb/courier-service-coding-challenge.git)
2. Open a terminal and navigate to the project folder.
3. Run ```npm install```
4. Run the app with the following command:

```bash
node main.js
```
### Enter Input in the following format:
base_delivery_cost &nbsp; no_of_packges <br>
pkg_id1 &nbsp; pkg_weight1_in_kg &nbsp; distance1_in_km &nbsp; offer_code1 <br>
pkg_id2 &nbsp; pkg_weight2_in_kg &nbsp; distance2_in_km &nbsp; offer_code2 <br>
...<br>

no_of_vehicles &nbsp; max_speed &nbsp; max_carriable_weight

example: <br>
100 5 <br>
PKG1 50 30 OFR001 <br>
PKG2 75 125 OFR008 <br>
PKG3 175 100 OFR003 <br>
PKG4 110 60 OFR002 <br>
PKG5 115 95 NA <br>
2 70 200

## Run test 
```bash
npm test
```







