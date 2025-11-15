const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/resume", (req, res) => {
    res.render("resumeForm");
});


router.post("/resume", (req, res) => {
    const userId = 1;

    const {
        full_name, phone, email, address, linkedin, github, portfolio,

        degree, institution, edu_city, edu_state, edu_start_year, edu_end_year, grade,

        course_name,

        company_name, role_name, exp_start_date, exp_end_date, exp_city, exp_state, exp_description,

        project_name, tech_stack, project_date, project_description, project_github_link, project_live_link,

        languages, developer_tools, technologies_or_frameworks,

        extra_title, extra_role, extra_start_date, extra_end_date, extra_description
    } = req.body;


    const resumeInsertQuery = `INSERT INTO resumes (user_id, title) VALUES (?, ?)`;

    // resume table 

    db.query(resumeInsertQuery, [userId, "My Resume"], (err, result) => {
        if (err) throw err;

        const resumeId = result.insertId;

        //personal-info table

        const personalInsertQuery = `
            INSERT INTO personal_info 
            (resume_id, full_name, phone, email, address, linkedin, github, portfolio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            personalInsertQuery,
            [resumeId, full_name, phone, email, address, linkedin, github, portfolio],
            (err) => {
                if (err) throw err;
            }
        );

        // education table 

        if (degree) {
            const q = `
                INSERT INTO education 
                (resume_id, degree, institution, city, state, start_year, end_year, grade)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            for (let i = 1; i < degree.length; i++) {
                if (!degree[i] || !institution[i]) continue;

                db.query(
                    q,
                    [
                        resumeId,
                        degree[i],
                        institution[i],
                        edu_city[i],
                        edu_state[i],
                        edu_start_year[i],
                        edu_end_year[i],
                        grade[i]
                    ],
                    (err) => { if (err) throw err; }
                );
            }
        }

        // coursework - table

        if (course_name) {
            const q = "INSERT INTO coursework (resume_id, course_name) VALUES (?, ?)";

            for (let i = 1; i < course_name.length; i++) {
                if (!course_name[i]) continue;

                db.query(q, [resumeId, course_name[i]], (err) => {
                    if (err) throw err;
                });
            }
        }


        // experience table

        if (company_name) {
            const q = `
                INSERT INTO experience 
                (resume_id, company_name, role_name, start_date, end_date, city, state, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            for (let i = 1; i < company_name.length; i++) {
                if (!company_name[i] || !role_name[i]) continue;

                db.query(
                    q,
                    [
                        resumeId,
                        company_name[i],
                        role_name[i],
                        exp_start_date[i],
                        exp_end_date[i],
                        exp_city[i],
                        exp_state[i],
                        exp_description[i]
                    ],
                    (err) => { if (err) throw err; }
                );
            }
        }

        // projects table

        if (project_name) {
            const q = `
                INSERT INTO projects
                (resume_id, project_name, tech_stack, project_date, project_description, github_link, live_link)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            for (let i = 1; i < project_name.length; i++) {
                if (!project_name[i]) continue;

                db.query(
                    q,
                    [
                        resumeId,
                        project_name[i],
                        tech_stack[i],
                        project_date[i],
                        project_description[i],
                        project_github_link[i],
                        project_live_link[i]
                    ],
                    (err) => { if (err) throw err; }
                );
            }
        }

        // technical skills table 

        if (languages) {
            const skillQuery = `
            INSERT INTO technical_skills 
            (resume_id, languages, developer_tools, technologies_or_frameworks)
            VALUES (?, ?, ?, ?)
        `;

            db.query(
                skillQuery,
                [resumeId, languages, developer_tools, technologies_or_frameworks],
                (err) => {
                    if (err) throw err;
                }
            );

        }


        // extra - curricular table 

        if (extra_title) {
            const q = `
                INSERT INTO extracurricular
                (resume_id, title, role, start_date, end_date, description)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            for (let i = 1; i < extra_title.length; i++) {
                if (!extra_title[i]) continue;

                db.query(
                    q,
                    [
                        resumeId,
                        extra_title[i],
                        extra_role[i],
                        extra_start_date[i],
                        extra_end_date[i],
                        extra_description[i]
                    ],
                    (err) => { if (err) throw err; }
                );
            }
        }

        // in resume -> particular resume id -> templates 
        res.redirect(`/resume/${resumeId}/templates`);

    });
});

router.get("/resume/:resumeId/templates", (req, res) => {

    res.render("templates/template1.ejs");

});



module.exports = router;
