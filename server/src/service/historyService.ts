import fs from 'node:fs/promises';

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
        id: Math.random().toString(36).substr(2, 9)
      }

      const history = await fs.readFile("db/db.json", "utf-8");
      const parsedHistory = JSON.parse(history);

      parsedHistory.push(data);

      await fs.writeFile("db/db.json", JSON.stringify(parsedHistory, null, 4));


  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
