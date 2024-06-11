import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [assignments, setAssignments] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'start_date', direction: 'ascending' });

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(), 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/project_assignments');
            setAssignments(res.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const sortBy = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAssignments = [...assignments].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    return (
        <table>
            <thead>
                <tr>
                    <th onClick={() => sortBy('employee_id')}>Employee_ID</th>
                    <th onClick={() => sortBy('full_name')}>Employee_name</th>
                    <th onClick={() => sortBy('project_name')}>Project_name</th>
                    <th onClick={() => sortBy('start_date')}>Start_date</th>
                </tr>
            </thead>
            <tbody>
                {sortedAssignments.map(assignment => (
                    <tr key={assignment._id}>
                        <td>{assignment.employee_id}</td>
                        <td>{assignment.employee_name}</td>
                        <td>{assignment.project_name}</td>
                        <td>{new Date(assignment.start_date).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default App;
