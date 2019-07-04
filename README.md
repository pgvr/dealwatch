# Dealwatch

Application that looks for deals on the [Geizhals Website](https://geizhals.de/) that offer a lower price than ever before. Additionally Geizhals Mega Deals will implement features like keyword search and deal alerts.

## Crawler

The script to crawl the items from all 14 categories can be executed by going into the crawler directory
and executing the bash script.

`cd crawler`
`./get_new_deals.sh`

## Backend

To test and modify the backend go into the backend directory, install the packages and start the application in watch mode.

`cd backend`

`npm i`

`npm run start:dev`

After that the application is running on localhost:3000 by default.
