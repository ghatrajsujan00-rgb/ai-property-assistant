import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchProperties = async () => {
    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/properties')
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">AI Property Assistant</div>
        <nav>
          <a href="#search">Search</a>
          <a href="#booking">Book Inspection</a>
          <a href="#chatbot">AI Chatbot</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>Find Your Next Property with AI</h1>
          <p>
            Search properties to buy or rent, get smart recommendations,
            book inspections, and ask questions using an AI-powered assistant.
          </p>
          <button onClick={fetchProperties}>Load Property Listings</button>
        </div>

        <div className="search-card" id="search">
          <h2>Property Search</h2>
          <input type="text" placeholder="Location e.g. Sydney, Parramatta" />
          <input type="text" placeholder="Property type e.g. apartment, house" />
          <input type="text" placeholder="Budget e.g. $700 per week" />
          <button onClick={fetchProperties}>Search Properties</button>
        </div>
      </section>

      <section className="property-section">
        <h2>Available Properties from Backend API</h2>

        {loading && <p>Loading properties...</p>}

        <div className="property-grid">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <h3>{property.title}</h3>
              <p><strong>Location:</strong> {property.location}</p>
              <p><strong>Type:</strong> {property.type}</p>
              <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
              <p><strong>Price:</strong> ${property.price_per_week} per week</p>
              <p><strong>Status:</strong> {property.status}</p>
              <button>Book Inspection</button>
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Smart Recommendations</h3>
          <p>
            The system suggests suitable properties based on user preferences
            such as location, budget, property type, and number of bedrooms.
          </p>
        </div>

        <div className="feature-card" id="booking">
          <h3>Inspection Booking</h3>
          <p>
            Users can book an inspection appointment and later retrieve their
            booking details using their booking reference.
          </p>
        </div>

        <div className="feature-card" id="chatbot">
          <h3>RAG AI Chatbot</h3>
          <p>
            The chatbot will use Amazon Bedrock Knowledge Bases to answer
            questions from property documents and suburb information.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App