'use strict';
import appFactory from './app'
import {Url} from './db';


const app = appFactory(Url.getAndVisit, Url.addUrl);

app.listen(process.env.PORT || 5001);