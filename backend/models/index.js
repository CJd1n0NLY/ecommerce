import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import enVariables from '../config/db.config.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);
const env = 'development';
const config = enVariables[env];
const db = {};

class DatabaseService {
  static async init() {
    let sequelize;
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: config.logging || false,
      }
    );

    // First, import all models and add them to db object
    const files = fs.readdirSync(__dirname).filter((file) => {
      return (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
      );
    });

    // Load all models first
    for (const file of files) {
      const filePath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(filePath).toString();
      const module = await import(fileUrl);
      const model = module.default;
      
      // Check if model is a function (older Sequelize) or already initialized
      if (typeof model === 'function') {
        const initializedModel = model(sequelize, DataTypes);
        db[initializedModel.name] = initializedModel;
      } else {
        // Model is already initialized
        db[model.name] = model;
      }
    }

    // Now set up all associations (after all models are loaded)
    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true }); // Using alter:true to update tables if needed
      console.log('Database connected and synchronized');
    } catch (error) {
      console.error('Database initialization failed:', error);
    }

    return db;
  }

  static getDb() {
    return db;
  }
}

export default DatabaseService;