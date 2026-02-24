import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./List.css";

function List() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.post(
        "https://backend.jotish.in/backend_dev/gettabledata.php",
        {
          username: "test",
          password: "123456",
        }
      );

      const tableData = response.data.TABLE_DATA.data;

      const formattedData = tableData.map((row) => ({
        name: row[0],
        role: row[1],
        city: row[2],
        EmpId: row[3],          
        JoiningDate: row[4],
        salary: row[5],
      }));

      setEmployees(formattedData);
      localStorage.setItem("employees", JSON.stringify(formattedData));
      setLoading(false);

    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // 🔍 Search Filtering
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.role.toLowerCase().includes(search.toLowerCase()) ||
    emp.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="list-container">

        <div className="list-header">

  <h2>Employee Directory</h2>
  <p className="list-subtitle">
    Manage and explore workforce data
  </p>

  <button
    className="analytics-btn"
    onClick={() => navigate("/analytics", { state: employees })}
  >
    View Analytics
  </button>

  <div className="search-wrapper">
    <input
      type="text"
      placeholder="Search by name, role or city"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-input"
    />
  </div>

</div>

        {/* Table Section */}
        <div className="table-card">
          {loading ? (
            <div className="loading">Loading employees...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="empty-state">
              No employees found matching your search.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>City</th>
                  <th>Emp ID</th>
                  <th>Joining Date</th>
                  <th>Salary</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((emp, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      navigate("/details", { state: emp })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>{emp.name}</td>
                    <td>{emp.role}</td>
                    <td>{emp.city}</td>
                    <td>{emp.EmpId}</td>
                    <td>{emp.JoiningDate}</td>
                    <td>{emp.salary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </>
  );
}

export default List;