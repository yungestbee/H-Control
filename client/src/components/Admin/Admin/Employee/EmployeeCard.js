import { useState, useEffect } from 'react'
import  './EmployeeCard.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'
import SuperAdmin from '../Login/SuperAdmin';
import Navbar from '../Primary Page/navbar';
import jwt from "jwt-decode"



  const ViewEmployeeCard = () => {
  const token = Cookies.get('jwt');
  if(token){
    var decoded = jwt(token)
  }


  const [data, setData] = useState([])
  const [error, setError]= useState('')
  const [username, setUsername] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [itemId, setItemId] = useState(null)
  const [isLoggedIn, setIsLoggedIn]= useState(token !== undefined)

  
  async function fetchData() {
    try {
      const response = await fetch('http://localhost:5002/api/employees'); // Replace with your API endpoint
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  useEffect(() => {
    fetchData();
    
  }, []);

  const handleUsername =(e)=>{
    setUsername(e.target.value)
  }

  const handleDelete = async () => {
    try {
      if (username === decoded.username) {
        const response = await fetch(`http://localhost:5002/api/employees/${itemId}`, {
          method: 'DELETE',
        });

        if (response.status === 200) {
          // If the DELETE request was successful, update the data state by removing the deleted employee
          setData(prevData => prevData.filter(item => item._id !== itemId));
        } else {
          setError('Error deleting employee');
        }
      } else {
        alert('Wrong Username');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  return (
    <>
    {isLoggedIn ? (
      <div className='yungest'>
          <Navbar />

       <div className='major'>
          <h1 className='h2text' >COMPANY EMPLOYEES</h1>
          <div className='container empcontainer'>
              {data.map((employee)=>{
                return (
                <div className='card2 ' key={employee._id}>
                <div className='cardImage'>
                    <img src={employee.image} alt='' className='employeeimage' />
                </div>
                  <div className="employee-details">
                    <h2>{`${employee.firstName} ${employee.lastName}`}</h2>
                    <p>Age: {employee.age}</p>
                    <p>Department: {employee.department}</p>
                  </div>
                  
                  <button
            type="button"
            className="btn cardButton btn-primary "
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => setItemId(employee._id)} // Set the selected item ID
          >
            Delete
          </button>
          <div className="modal fade " id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog ">
          <div className="modal-content  modalBodyYun">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Confirm Username
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#d4af37' }}>Re-Enter your username</p>
              <input type="text" onChange={handleUsername} className='modalInput' />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn modalBtn"  data-bs-dismiss="modal" onClick={handleDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
                </div>
            );
              })};
              <p>{error}</p>
          </div>
              <button className='addEmployeeBtn'><Link style={{textDecoration: "none", color: "#fff"}} to="/addEmployee">Add Employee</Link></button>
         
   </div>
    </div>
     ) :  (
      <SuperAdmin />
  )}

   </>
  );
};

export default ViewEmployeeCard
