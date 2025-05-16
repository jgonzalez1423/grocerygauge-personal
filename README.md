
# Introduction

# 🛒 GroceryGauge

## 📌 What is GroceryGauge?
GroceryGauge is a web application that helps users track inflation and price changes for grocery products — specifically Kroger items. It allows users to:

- Track historical price changes with dynamic graphs  
- Estimate the cost of a grocery list using a simulated cart  
- Set up price alerts to be notified via email when a product hits a target price  

The site pulls product data from the **Kroger Products API** and uses a forecasting model to predict prices for the next few days.

---

## Features

- Browse Kroger grocery items with regularly updated prices  
- View price history graphs for each product  
- Add/remove products to a cart to simulate a grocery trip total  
- Search for specific products by name  
- Set email alerts for preferred target prices  

---

## Technical Overview

- **Frontend:** React.js (HTML/CSS/JSX)  
- **Backend:** Django REST Framework for API management and data processing  
- **Price Prediction:** Separate Flask service that generates price prediction graphs using XGBoost  
- **Database:** MySQL to store products and price history  
- **Email Alerts:** Django backend + SMTP integration for notifications

## 🛠️ Developed With

- ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
- ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
- ![Django REST Framework](https://img.shields.io/badge/Django%20REST-FF1709?style=for-the-badge&logo=django&logoColor=white)
- ![Celery](https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white)
- ![SendGrid](https://img.shields.io/badge/SendGrid-008BB9?style=for-the-badge&logo=sendgrid&logoColor=white)
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
- ![Requests](https://img.shields.io/badge/Requests-2F2F2F?style=for-the-badge&logo=python&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
- ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
- ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
 

---
# Technical Architecture 
[image]
---
# Developers 
- Jennifer Gonzalez (Frontend): Worked on Website Design and connecting backend API calls to Frontend design
- Isabella Velez (Frontend): Mainly worked on Website Design, also handled the Product and About Us pages
- Andrew Stephan (Backend): Worked on price prediction & graph generation components
- Yinglin (Backend): Set up the Django project environment and built functionality to fetch Kroger Products API data and stored it in a MySQL database
---
# Environment Setup
- python3 -m venv .venv
- source .venv/bin/activate
- Runs the app in the development mode.\
- Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
# Development 
- pip install --upgrade pip
- pip install -r requirements.txt
## Package Updates 
- pip install pipreqs
- pipreqs . --force
## Package Management 
- pip install --upgrade pip
- pip install -r requirements.txt
- npm install
# Project Instructions 
- python runserver localhost:8000
- npm start
- cd backend/prediction
- python server.py

## Project Structure
- backend/
  - prediction/
    - server.py
  - asgi.py
  - celery.py
  - settings.py
  - urls.py
  - wsgi.py
- src/
  - components/
  - CartContext.js
  - Footer.js
  - Products.js
  - style.css
- pages/   
  - ~Pred_POC_Product.js
  - About.js
  - Cart.js
  - Cart.module.css
  - Home.js
  - Home.module.css
  - Product.js
  - TopBar.module.css
- App.css
- App.js 
- App.test.js
- globalStyles.test.js
- index.css
- index.js
- reportWebVitals.js
- setupTests.js
---
## Website Screenshots
![Home Page](https://media.discordapp.net/attachments/1287663401283223555/1371687965562245171/Screenshot_2025-05-12_221002.png?ex=68240b77&is=6822b9f7&hm=4d1870e676750eb29b0f5503e8d99eb864519cd858a1eab06d307a86fb254be9&=&format=webp&quality=lossless&width=1423&height=813)
![Product Page](https://media.discordapp.net/attachments/1287663401283223555/1371687965868294292/Screenshot_2025-05-12_221036.png?ex=68240b77&is=6822b9f7&hm=dc1e112301c63cb79a472c05a2d2935e5e3244c4c4d08e507383298f28600dc1&=&format=webp&quality=lossless&width=1420&height=813)
![Cart Page](https://media.discordapp.net/attachments/1287663401283223555/1371687966296244225/Screenshot_2025-05-12_221112.png?ex=68240b77&is=6822b9f7&hm=385ae3145e7f549c242a231a6fe7a19c2634151ba71ce770e63245f1bf064cef&=&format=webp&quality=lossless&width=1414&height=813)
![About Us Page](https://media.discordapp.net/attachments/1287663401283223555/1371687966619078790/Screenshot_2025-05-12_221139.png?ex=68240b77&is=6822b9f7&hm=15d0ca5fea80d580a75e16aecbc1c06fe4f11f31ce0f7ed2ae9009611c8df168&=&format=webp&quality=lossless&width=1410&height=813)

