const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Employee Schema
const EmployeeSchema = new Schema({
    employee_id: { type: String, unique: true, required: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    hashed_password: String,
});

// Project Schema
const ProjectSchema = new Schema({
    project_code: { type: String, unique: true, required: true },
    project_name: { type: String, required: true },
    project_description: { type: String, required: true }
});

// Project Assignment Schema
const ProjectAssignmentSchema = new Schema({
    employee_id: { type: String, ref: 'Employee', required: true },
    project_code: { type: String, ref: 'Project', required: true },
    start_date: { type: Date, required: true }
});

// Create models
const Employee = mongoose.model('Employee', EmployeeSchema);
const Project = mongoose.model('Project', ProjectSchema);
const ProjectAssignment = mongoose.model('ProjectAssignment', ProjectAssignmentSchema);

// Export models
module.exports = {
    Employee,
    Project,
    ProjectAssignment
};
