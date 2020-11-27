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
            <h2>{country.name}</h2>
            <p>Capital City: {country.capital}</p>
            <p>Population: {country.population}</p>
            <h4>Languages</h4>
            <ul>
              {country.languages.map((language) => (
                <li key={language.name}>{language.name}</li>
              ))}
            </ul>
            <h4>Weather in {country.capital}</h4>
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
              className="shadow rounded"
            />
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container fluid className="bg-light">
      <h1 className="text-center text-primary p-5">Country Browser</h1>
      <Row>
        <Col md="3" className="py-2">
          <Form className="pb-3">
            <Form.Label>Find A Country</Form.Label>
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
                action
                key={country.name}
                onClick={() => handleSelectCountry(country)}
              >
                {country.name}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
        <Col md="9" className="py-2">
          {details}
        </Col>
      </Row>
    </Container>
  )
}

export default App
