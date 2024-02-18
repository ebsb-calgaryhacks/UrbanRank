# Urban Rank

Urban Rank is a web application the allows you to select features that are important to you in your community. This includes public transport, affordability, green spaces, and nearby schools. Using these selections, the application provides a map which highlights the most recommended areas that meet your needs.

## Dependancies
See requirements.txt

## Setup
Download all dependencies from requirements.txt and the package json.

Get a open data app token from the [Open Data Portal](https://data.calgary.ca/profile/edit/developer_settings).

Create a .env file in the backend folder, with MyAppToken=(your open data app token). It is runnable without your own app token, but it will be subject to strict rate limits without one.

Open a terminal in the backend folder, and run flask --app main run

Then run index.html. We reccomend using vscode's Live Server extension.

## Developers
Ashley Anderson,
Jacob Feng,
Brant Harker,
Mihiri Kamiss,
and Jacob Stanford
