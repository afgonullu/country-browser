import React, { useEffect, useState } from "react"
import axios from "axios"
import "./App.scss"
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Form,
} from "react-bootstrap"

const App = (props) => {
  const [countries, setCountries] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [details, setDetails] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("https://restcountries.eu/rest/v2/all")

      setCountries(response.data)
    }

    fetchData()
  }, [countries])

  useEffect(() => {
    setFiltered(
      countries.filter((country) =>
        country.name.toUpperCase().includes(search.toUpperCase())
      )
    )
  }, [countries, search])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleSelectCountry = async (country) => {
    const response = await axios.get(
      `https://cors-anywhere.herokuapp.com/http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_WEATHERSTACK_API_KEY}&query=${country.capital}`
    )

    const weather = response.data.current

    setDetails(
      <Container>
        <Row className="justify-content-md-start align-items-start">
          <Col>
            <h1>{country.name}</h1>
            <p>Capital City: {country.capital}</p>
            <p>Population: {country.population}</p>
            <h3>Languages</h3>
            <ul>
              {country.languages.map((language) => (
                <li key={language.name}>{language.name}</li>
              ))}
            </ul>
            <h3>Weather in {country.capital}</h3>
            <p>temperature: {weather.temperature} Celcius</p>
            <img src={weather.weather_icons[0]} alt="Temp Icon" />
            <p>Wind Speed: {weather.wind_speed} mph</p>
            <p>Wind Direction: {weather.wind_dir}</p>
          </Col>
          <Col>
            <img
              src={country.flag}
              height="auto"
              width="320px"
              alt="country flag"
            />
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col md="3">
          <Form>
            <Form.Control
              value={search}
              type="text"
              placeholder="Filter Countries..."
              onChange={handleSearch}
            />
          </Form>
          <ListGroup>
            {filtered.map((country) => (
              <ListGroupItem
                key={country.name}
                onClick={() => handleSelectCountry(country)}
              >
                {country.name}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
        <Col md="9">{details}</Col>
      </Row>
    </Container>
  )
}

export default App
