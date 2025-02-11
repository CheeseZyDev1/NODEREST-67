const express = require('express');
const Sequelize = require('sequelize');
const app = express();

// parse incoming requests
app.use(express.json());

// set db url
const dbUrl = 'postgres://webadmin:CEDdpq52754@node71735-front-67.proen.app.ruk-com.cloud:11478/Books';

// create a connection to the database
const sequelize = new Sequelize(dbUrl);
