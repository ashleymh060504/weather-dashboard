import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const history = await fs.readFile("db/db.json", "utf-8");
    const parsedHistory = JSON.parse(history);

    return parsedHistory
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
      const data = {
        name: city,
        id: uuidv4()
        // id: Math.random().toString(36).substr(2, 9)
      }

      const history = await fs.readFile("db/db.json", "utf-8");
      const parsedHistory = JSON.parse(history);

      // check if city already exists in history array
      const cityExists = parsedHistory.some((city: any) => city.name === data.name);

      if(!cityExists) {
        parsedHistory.push(data);
      } else {
        console.log("city already exists!")
      }


      await fs.writeFile("db/db.json", JSON.stringify(parsedHistory, null, 4));


  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const history = await fs.readFile("db/db.json", "utf-8");
    const parsedHistory = JSON.parse(history);

    const updatedHistory = parsedHistory.filter((city: any) => city.id !== id);

    await fs.writeFile("db/db.json", JSON.stringify(updatedHistory, null, 4));

    console.log("City has been removed!")

  }
}

export default new HistoryService();
