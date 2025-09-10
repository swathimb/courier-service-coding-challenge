import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from 'url';


export default function extractOfferCodes() {

    const __filename = fileURLToPath(import.meta.url); //Holds the absolute path of the current file
    const __dirname = path.dirname(__filename); //Holds the path of the current file's directory

    // Load the Excel file
    const workbook = xlsx.readFile(path.join(__dirname, '../data/offers.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON array
    const offersData = xlsx.utils.sheet_to_json(worksheet);
    let offers = {};

    offersData.forEach(offer => {
        const [minWeight, maxWeight] = offer.WEIGHT.split('-').map(Number);
        const [minDistance, maxDistance] = offer.DISTANCE.split('-').map(Number);
        offers[offer.OFFER_CODE] = {
        discount: offer.DISCOUNT,
        weight: (w) => w >= minWeight && w <= maxWeight,
        distance: (d) => d >= minDistance && d <= maxDistance,
        };
    });

    return offers;

}