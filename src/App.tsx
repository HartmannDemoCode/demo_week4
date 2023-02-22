import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  console.log("App component is rendered")
  const [name, setName] = useState<string>("initial name")

  return (
    <div className="App">
      <In name={name} setName={setName}/>
      <Out name={name}/>
      <PeopleViewer />
    </div>
  )
}

const In = ({name, setName}:{name:string, setName:React.Dispatch<React.SetStateAction<string>>}) => {
  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} /><br />
    </div>
  )
};
const Out = ({name}:{name:string}) => {
  console.log("In component is rendered")
  return (
    <div>
      <p>{name}</p>
    </div>
  )
};
const PeopleViewer = () => {
  type Person = {
    id: number
    name: string
    age: number
    city: string
  }
  const [people, setPeople] = useState<Person[]>([]);
    
  useEffect(() => {
    fetch("http://localhost:3008/person")
      .then(response => response.json())
      .then(json => setPeople(json));
  }, []);

  return (
    <div>
      <h1>People</h1>
      <table>
        <thead> <tr> <th>Id</th> <th>Name</th> <th>Age</th> <th>City</th> </tr> </thead>
        <tbody>
          {people.map((person) => {
            return (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.age}</td>
              <td>{person.city}</td>
            </tr>
            //)
          }
          )
          }
        </tbody>
      </table>
      </div>
  )
}
export default App
