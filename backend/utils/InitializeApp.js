// InitializeApp.js
import DatabaseService from '../models/index.js';
import Logger from './Logger.js';

class InitializeApp {
  static async init(app) {
    try {
      await DatabaseService.init();
      Logger.info("Database initialized successfully");
      return Promise.resolve();
    } catch (error) {
      Logger.error(`Error in initialization...`);
      Logger.error(error);
      return Promise.reject(error);
    }
  }
}

export default InitializeApp;