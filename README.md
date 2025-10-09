# RoadTrip Planner 🚗

A full-stack **MERN** application that allows users to create, manage, and visualize multi-stop road trip itineraries on an interactive map. This project demonstrates a complete development cycle, from initial setup and API integration to final deployment.  

**Live Demo:** [https://benevolent-kleicha-a7a703.netlify.app/](#) ✨

---

## Key Features

- **User Authentication:** Secure registration and login using JSON Web Tokens (JWT).  
- **CRUD for Trips:** Authenticated users can create, read, and delete trip itineraries.  
- **Real-time Geocoding:** Converts user-entered locations (e.g., "Paris", "Eiffel Tower") into geographic coordinates using the OpenStreetMap Nominatim API.  
- **Interactive Map Visualization:** Uses Leaflet and React-Leaflet to display trip starting points on a global map and plot full routes.  
- **RESTful API:** Well-structured backend API built with Node.js and Express for managing all application data.  
- **Fully Responsive:** Designed with Tailwind CSS for a seamless experience on desktops and mobile devices.  

---

## 🛠️ Technology Stack

**Backend:**  
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JSON Web Tokens (JWT) for authentication  
- Swagger for API documentation  

**Frontend:**  
- React (with Vite)  
- Tailwind CSS  
- Axios  
- Leaflet & React-Leaflet  

**Deployment:**  
- Backend: Render  
- Frontend: Netlify  

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+  
- npm  
- MongoDB (local instance or MongoDB Atlas cluster)  

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YashiUpadhyay1/RoadTrip.git
   cd RoadTrip
