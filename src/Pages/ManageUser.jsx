import React, { useContext, useEffect, useState } from 'react';
import './ManageUser.css';
import { ModeContext } from '../Contexts/ModeContext';

const ManageUser = () => {
  const ctx = useContext(ModeContext);
  const API_URL = "http://localhost:3001/users";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data); // 👈 dynamic data set here
      console.log(data);
    } catch (error) {
      console.error("GET ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts(); // 👈 component load thai tyare call
  }, []);

  return (
    <div className={`table-container ${ctx.mode}`}>
      <div className="table-header">
        <h2>Manage Users</h2>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
            <tr>
              <td>Vishva Zala</td>
              <td>63511 25333</td>
              <td>Editor</td>
              <td>Edit</td>
              {/* <button className='btn1'>Delete</button> */}
            </tr>
            <tr>
              <td>Vidhi Zala</td>
              <td>81533 25763</td>
              <td>Author</td>
              <td>Delete</td>
              {/* <button className='btn1'>Delete</button> */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.createdAt}</td>
                <td>{user.mobilenumber}</td>
                <td>
                  <span className="role-badge">
                    {user.role}
                  </span>
                </td>
                <td>
                  <button className="action-btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUser;
