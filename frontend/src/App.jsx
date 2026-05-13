import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [bookingMessage, setBookingMessage] = useState('')

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    preferred_date: '',
    preferred_time: ''
  })

  const [lookupId, setLookupId] = useState('')
  const [lookupResult, setLookupResult] = useState(null)
  const [lookupMessage, setLookupMessage] = useState('')

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

  const openBookingForm = (property) => {
    setSelectedProperty(property)
    setBookingMessage('')
  }

  const handleBookingChange = (event) => {
    const { name, value } = event.target

    setBookingForm({
      ...bookingForm,
      [name]: value
    })
  }

  const submitBooking = async (event) => {
    event.preventDefault()

    if (!selectedProperty) {
      return
    }

    const bookingData = {
      name: bookingForm.name,
      email: bookingForm.email,
      property_id: selectedProperty.id,
      preferred_date: bookingForm.preferred_date,
      preferred_time: bookingForm.preferred_time
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      setBookingMessage(
        `Booking confirmed. Your booking ID is ${data.booking.booking_id}.`
      )

      setBookingForm({
        name: '',
        email: '',
        preferred_date: '',
        preferred_time: ''
      })
    } catch (error) {
      console.error('Error creating booking:', error)
      setBookingMessage('Booking failed. Please check the backend server.')
    }
  }

  const retrieveBooking = async (event) => {
    event.preventDefault()
    setLookupResult(null)
    setLookupMessage('')

    try {
      const response = await fetch(`http://127.0.0.1:8000/bookings/${lookupId}`)
      const data = await response.json()

      if (data.message === 'Booking not found') {
        setLookupMessage('Booking not found. Please check the booking ID.')
      } else {
        setLookupResult(data)
      }
    } catch (error) {
      console.error('Error retrieving booking:', error)
      setLookupMessage('Could not retrieve booking. Please check the backend server.')
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">AI Property Assistant</div>
        <nav>
          <a href="#search">Search</a>
          <a href="#booking">Book Inspection</a>
          <a href="#lookup">Retrieve Booking</a>
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
              <button onClick={() => openBookingForm(property)}>
                Book Inspection
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedProperty && (
        <section className="booking-section" id="booking">
          <h2>Book Inspection</h2>
          <p>
            Selected property: <strong>{selectedProperty.title}</strong>
          </p>

          <form className="booking-form" onSubmit={submitBooking}>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={bookingForm.name}
              onChange={handleBookingChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={bookingForm.email}
              onChange={handleBookingChange}
              required
            />

            <input
              type="date"
              name="preferred_date"
              value={bookingForm.preferred_date}
              onChange={handleBookingChange}
              required
            />

            <input
              type="time"
              name="preferred_time"
              value={bookingForm.preferred_time}
              onChange={handleBookingChange}
              required
            />

            <button type="submit">Confirm Booking</button>
          </form>

          {bookingMessage && <p className="booking-message">{bookingMessage}</p>}
        </section>
      )}

      <section className="lookup-section" id="lookup">
        <h2>Retrieve Booking Details</h2>
        <p>Enter your booking ID to check your inspection booking details.</p>

        <form className="lookup-form" onSubmit={retrieveBooking}>
          <input
            type="number"
            placeholder="Enter booking ID e.g. 1"
            value={lookupId}
            onChange={(event) => setLookupId(event.target.value)}
            required
          />
          <button type="submit">Retrieve Booking</button>
        </form>

        {lookupMessage && <p className="lookup-message">{lookupMessage}</p>}

        {lookupResult && (
          <div className="lookup-result">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> {lookupResult.booking_id}</p>
            <p><strong>Name:</strong> {lookupResult.name}</p>
            <p><strong>Email:</strong> {lookupResult.email}</p>
            <p><strong>Property ID:</strong> {lookupResult.property_id}</p>
            <p><strong>Date:</strong> {lookupResult.preferred_date}</p>
            <p><strong>Time:</strong> {lookupResult.preferred_time}</p>
            <p><strong>Status:</strong> {lookupResult.status}</p>
          </div>
        )}
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Smart Recommendations</h3>
          <p>
            The system suggests suitable properties based on user preferences
            such as location, budget, property type, and number of bedrooms.
          </p>
        </div>

        <div className="feature-card">
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