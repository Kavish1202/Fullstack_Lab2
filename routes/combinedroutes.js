const express = require('express');
const { Employee, Project, ProjectAssignment } = require('../models/Schema.js'); // Adjust the path to your models

const router = express.Router();

// Get latest 5 project assignments with employee and project details
router.get('/project_assignments', async (req, res) => {
    try {
        const assignments = await ProjectAssignment.find().sort({ start_date: -1 }).limit(5);

        const results = await Promise.all(assignments.map(async assignment => {
            const employee = await Employee.findOne({ employee_id: assignment.employee_id });
            const project = await Project.findOne({ project_code: assignment.project_code });

            return {
                employee_id: employee.employee_id,
                employee_name: employee.full_name,
                project_name: project.project_name,
                start_date: assignment.start_date
            };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new project
router.post('/projects', async (req, res) => {
    try {
        const { project_code, project_name, project_description } = req.body;
        if (!project_code) {
            return res.status(400).json({ message: "Please enter project code" });
        }
        const createproj = await Project.create({
            project_code,
            project_name,
            project_description
        });
        res.status(201).json({
            message: "Project Added",
            Project: createproj.toObject({ getters: true, versionKey: false })
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new employee
router.post('/employees', async (req, res) => {
    try {
        const { employee_id, full_name, email, hashed_password } = req.body;
        if (!employee_id) {
            return res.status(400).json({ message: "Please enter Employee ID" });
        }
        const createemp = await Employee.create({
            employee_id,
            full_name,
            email,
            hashed_password
        });
        res.status(201).json({
            message: "Employee created successfully",
            employee: createemp.toObject({ getters: true, versionKey: false })
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new project assignment
router.get('/project_assignments', async (req, res) => {
    try {
        const { employee_id, project_code, start_date } = req.body;

        const existingEmployee = await Employee.findOne({ employee_id });
        if (!existingEmployee) {
            return res.status(400).json({ message: "Employee not found" });
        }

        const existingProject = await Project.findOne({ project_code });
        if (!existingProject) {
            return res.status(400).json({ message: "Project not found" });
        }

        const newAssignment = new ProjectAssignment({
            employee_id: existingEmployee.employee_id,
            project_code: existingProject.project_code,
            start_date
        });

        await newAssignment.save();

        res.status(201).json({ message: "Project assignment saved successfully", newAssignment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
