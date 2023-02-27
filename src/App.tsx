import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './App.css'
type Person = {
  id: number
  name: string
  age: number
  city: string
}


const emptyPerson: Person = { id: 0, name: "", age: 0, city: "" };

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [person, setPerson] = useState<Person>(emptyPerson);

  const addPerson = (person: Person) => {
    setPeople([...people, person]);
  };

  useEffect(() => {
    fetch("http://localhost:3008/person")
      .then(response => response.json())
      .then(json => setPeople(json));
  }, []);

  return (
    <div className="app">
      {/* <In name={name} setName={setName}/>
      <Out name={name}/> */}
      <Container fluid>
        <Row>
          <Col className="left-column">
            <PeopleForm setPeople={setPeople} people={people} person={person} setPerson={setPerson} />
            <ImageViewer url="https://higheredparent.com/wp-content/uploads/2018/02/cultural.jpg" width={430} height={70} />
          </Col>
          <Col xs={7}><PeopleViewer people={people} setPeople={setPeople} setPerson={setPerson} /></Col>
        </Row>
      </Container>
    </div>
  )
}

const In = ({ name, setName }: { name: string, setName: React.Dispatch<React.SetStateAction<string>> }) => {
  // simple component to show how to use useState and lifting state up.
  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} /><br />
    </div>
  )
};
const Out = ({ name }: { name: string }) => {
  // simple component to show how to use useState and show the changes comming from sipling component In
  console.log("In component is rendered")
  return (
    <div>
      <p>{name}</p>
    </div>
  )
};
type PeopleFormProps = {
  setPeople: Dispatch<SetStateAction<Person[]>>
  people: Person[]
  setPerson: Dispatch<SetStateAction<Person>>
  person: Person
}

const PeopleForm = ({ setPeople, people, setPerson, person }: PeopleFormProps) => {

  const doPost = (person: Person) => {
    fetch("http://localhost:3008/person", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
      .then((response) => response.json())
      .then((json) => {
        setPeople([...people, json])
      });
    setPerson(emptyPerson);
  };
  const doPut = (person: Person) => {
    fetch(`http://localhost:3008/person/${person.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
      .then((response) => response.json())
      .then((json) => {
        setPeople(people.map((p) => (p.id === person.id ? json : p)));
      });
    setPerson(emptyPerson);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (person.id === 0) {
      doPost(person);
    } else {
      doPut(person);
    }
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    console.log('NAME AND VALUE: ', name, value);
    setPerson({ ...person, [name]: value });
  };

  const formStyle = {
    width: "100%",
    // height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    border: "1px solid gray",
    margin: "10px"
  };

  return (
    <div style={{ ...formStyle }}>
      <Form onSubmit={handleSubmit}>
        <h2>Person Form</h2>

        <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label column sm={2}>Name</Form.Label>
          <Col sm={10}><Form.Control name="name" type="text" placeholder="Put name here" value={person.name} onChange={handleChange} /></Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput2">
          <Form.Label column sm={2}>Age</Form.Label>
          <Col sm={10}><Form.Control name="age" type="text" placeholder="Put age here" value={person.age ? person.age : ""} onChange={handleChange} /></Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput3">
          <Form.Label column sm={2}>City</Form.Label>
          <Col sm={10}><Form.Control name="city" type="text" placeholder="Put city here" value={person.city} onChange={handleChange} /></Col>
        </Form.Group>

        <Button className="btn" type="submit"> Submit </Button>

      </Form>
    </div>
  );
};

type PeopleViewerProps = {
  people: Person[] // in order to display people
  setPeople: Dispatch<SetStateAction<Person[]>> // in order to delete a person
  setPerson: Dispatch<SetStateAction<Person>> // in order to edit a person
}

const PeopleViewer = ({ people, setPeople, setPerson }: PeopleViewerProps) => {

  const deletePerson = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const id = evt.currentTarget.id;
    fetch(`http://localhost:3008/person/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((json) => {
        const restOfPeople = people.filter((person) => person.id !== parseInt(id));
        setPeople([...restOfPeople]);
      });
  };

  const editPerson = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const id = evt.currentTarget.id;
    setPerson(people.find((person) => person.id === parseInt(id))!);
  };

  const containerStyle = {
    maxHeight: '100vh', // Set a maximum height of 400 pixels
    overflowY: 'auto', // Enable vertical scrollbars when content exceeds the container height
  };

  return (
    <div style={containerStyle}>
      <h1>People</h1>
      <table>
        <thead><tr><th>Id</th><th>Name</th><th>Age</th><th>City</th><th>Operations</th></tr></thead>
        <tbody>
          {(() => { console.log("PeopleViewer is rendered"); return ""; })()}
          {people.map((person) => {
            return (<tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.age}</td>
              <td>{person.city}</td>
              <td><button className="btn" id={person.id.toString()} onClick={deletePerson}>Delete</button><button className="btn" id={person.id.toString()} onClick={editPerson}>Edit</button></td>
            </tr>)
          }
          )
          }
        </tbody>
      </table>
    </div>
  )
}

const ImageViewer = ({ url, text, width, height }: { url: string, text?: string, width?: number, height?: number }) => {
  const imageUrl = url;
  const imageStyle = {
    backgroundImage: `url(${imageUrl})`,
    // backgroundSize: 'cover',
    backgroundSize: `${width}px auto`,
    backgroundPosition: 'center',
    flexDirection: 'column', // Use a column layout
    filter: 'grayscale(100%)'
    // backgroundRepeat: 'no-repeat', // Set background-repeat to "no-repeat"
  };

  const containerStyle = {
    // height: '100vh',
    height: `${height}vh`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
  };

  return (
    <div style={{ ...imageStyle, ...containerStyle }}>
      {/* <h1>My Component</h1>
      <p>This is some text on top of the image</p> */}
      <p>{text}</p>
    </div>
  );
}
export default App

