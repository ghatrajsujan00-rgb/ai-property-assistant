import './App.css'

function App() {
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
          <button>Start Property Search</button>
        </div>

        <div className="search-card" id="search">
          <h2>Property Search</h2>
          <input type="text" placeholder="Location e.g. Sydney, Parramatta" />
          <input type="text" placeholder="Property type e.g. apartment, house" />
          <input type="text" placeholder="Budget e.g. $700 per week" />
          <button>Search Properties</button>
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