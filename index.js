import express from 'express';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import cors from 'cors';

import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';

import appSrc from './app.js';

const app = appSrc(express, bodyParser, fs, crypto, http, mongodb, path, cors);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server is up!');
});
