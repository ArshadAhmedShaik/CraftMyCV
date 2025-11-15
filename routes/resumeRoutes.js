const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/resume", (req, res) => {
    res.render("resumeForm");
});

router.post("/resume", (req, res) => {
    const userId = 3;

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

    db.query(resumeInsertQuery, [userId, "My Resume"], (err, result) => {
        if (err) throw err;

        const resumeId = result.insertId;

        const personalInsertQuery = `
            INSERT INTO personal_info 
            (resume_id, full_name, phone, email, address, linkedin, github, portfolio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(personalInsertQuery, [resumeId, full_name, phone, email, address, linkedin, github, portfolio], (err) => {
            if (err) throw err;
        });

        if (degree) {
            const q = `
                INSERT INTO education 
                (resume_id, degree, institution, city, state, start_year, end_year, grade)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            for (let i = 1; i < degree.length; i++) {
                if (!degree[i] || !institution[i]) continue;
                db.query(q, [resumeId, degree[i], institution[i], edu_city[i], edu_state[i], edu_start_year[i], edu_end_year[i], grade[i]], (err) => {
                    if (err) throw err;
                });
            }
        }

        if (course_name) {
            const q = "INSERT INTO coursework (resume_id, course_name) VALUES (?, ?)";
            for (let i = 1; i < course_name.length; i++) {
                if (!course_name[i]) continue;
                db.query(q, [resumeId, course_name[i]], (err) => { if (err) throw err; });
            }
        }

        if (company_name) {
            const q = `
                INSERT INTO experience 
                (resume_id, company_name, role_name, start_date, end_date, city, state, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            for (let i = 1; i < company_name.length; i++) {
                if (!company_name[i] || !role_name[i]) continue;
                db.query(q, [resumeId, company_name[i], role_name[i], exp_start_date[i], exp_end_date[i], exp_city[i], exp_state[i], exp_description[i]], (err) => {
                    if (err) throw err;
                });
            }
        }

        if (project_name) {
            const q = `
                INSERT INTO projects
                (resume_id, project_name, tech_stack, project_date, project_description, github_link, live_link)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            for (let i = 1; i < project_name.length; i++) {
                if (!project_name[i]) continue;
                db.query(q, [resumeId, project_name[i], tech_stack[i], project_date[i], project_description[i], project_github_link[i], project_live_link[i]], (err) => {
                    if (err) throw err;
                });
            }
        }

        if (languages) {
            const skillQuery = `
                INSERT INTO technical_skills 
                (resume_id, languages, developer_tools, technologies_or_frameworks)
                VALUES (?, ?, ?, ?)
            `;
            db.query(skillQuery, [resumeId, languages, developer_tools, technologies_or_frameworks], (err) => {
                if (err) throw err;
            });
        }

        if (extra_title) {
            const q = `
                INSERT INTO extracurricular
                (resume_id, title, role, start_date, end_date, description)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            for (let i = 1; i < extra_title.length; i++) {
                if (!extra_title[i]) continue;
                db.query(q, [resumeId, extra_title[i], extra_role[i], extra_start_date[i], extra_end_date[i], extra_description[i]], (err) => {
                    if (err) throw err;
                });
            }
        }

        res.redirect(`/resume/${resumeId}/templates`);
    });
});

router.get("/resume/:resumeId/templates", (req, res) => {
    const { resumeId } = req.params;
    const data = { resumeId };

    const personal_info_query = "SELECT * FROM personal_info WHERE resume_id = ?";
    db.query(personal_info_query, [resumeId], (err, personalResult) => {
        if (err) throw err;
        data.personal_info = personalResult;

        const education_query = "SELECT * FROM education WHERE resume_id = ?";
        db.query(education_query, [resumeId], (err, educationResult) => {
            if (err) throw err;
            data.education = educationResult;

            const coursework_query = "SELECT * FROM coursework WHERE resume_id = ?";
            db.query(coursework_query, [resumeId], (err, courseworkResult) => {
                if (err) throw err;
                data.coursework = courseworkResult;

                const experience_query = "SELECT * FROM experience WHERE resume_id = ?";
                db.query(experience_query, [resumeId], (err, experienceResult) => {
                    if (err) throw err;
                    data.experience = experienceResult;

                    const projects_query = "SELECT * FROM projects WHERE resume_id = ?";
                    db.query(projects_query, [resumeId], (err, projectsResult) => {
                        if (err) throw err;
                        data.projects = projectsResult;

                        const skills_query = "SELECT * FROM technical_skills WHERE resume_id = ?";
                        db.query(skills_query, [resumeId], (err, skillsResult) => {
                            if (err) throw err;
                            data.technical_skills = skillsResult;

                            const extra_query = "SELECT * FROM extracurricular WHERE resume_id = ?";
                            db.query(extra_query, [resumeId], (err, extraResult) => {
                                if (err) throw err;
                                data.extracurricular = extraResult;

                                res.render("templates", { data });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get("/resume/:resumeId/templates/:templateId", (req, res) => {
    const { resumeId, templateId } = req.params;
    const data = { resumeId, templateId };

    const personal_info_query = "SELECT * FROM personal_info WHERE resume_id = ?";
    db.query(personal_info_query, [resumeId], (err, personalResult) => {
        if (err) throw err;
        data.personal_info = personalResult;

        const education_query = "SELECT * FROM education WHERE resume_id = ?";
        db.query(education_query, [resumeId], (err, educationResult) => {
            if (err) throw err;
            data.education = educationResult;

            const coursework_query = "SELECT * FROM coursework WHERE resume_id = ?";
            db.query(coursework_query, [resumeId], (err, courseworkResult) => {
                if (err) throw err;
                data.coursework = courseworkResult;

                const experience_query = "SELECT * FROM experience WHERE resume_id = ?";
                db.query(experience_query, [resumeId], (err, experienceResult) => {
                    if (err) throw err;
                    data.experience = experienceResult;

                    const projects_query = "SELECT * FROM projects WHERE resume_id = ?";
                    db.query(projects_query, [resumeId], (err, projectsResult) => {
                        if (err) throw err;
                        data.projects = projectsResult;

                        const skills_query = "SELECT * FROM technical_skills WHERE resume_id = ?";
                        db.query(skills_query, [resumeId], (err, skillsResult) => {
                            if (err) throw err;
                            data.technical_skills = skillsResult;

                            const extra_query = "SELECT * FROM extracurricular WHERE resume_id = ?";
                            db.query(extra_query, [resumeId], (err, extraResult) => {
                                if (err) throw err;
                                data.extracurricular = extraResult;
                                console.log(data);
                                res.render("template.ejs", { data });
                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
