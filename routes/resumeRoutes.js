const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const db = require("../db/connection");
const util = require("util");
const exec = util.promisify(require("child_process").exec);


function escapeLatex(text = "") {
    return text
        .replace(/\\/g, "\\textbackslash{}")
        .replace(/&/g, "\\&")
        .replace(/%/g, "\\%")
        .replace(/\$/g, "\\$")
        .replace(/#/g, "\\#")
        .replace(/_/g, "\\_")
        .replace(/{/g, "\\{")
        .replace(/}/g, "\\}")
        .replace(/\^/g, "\\^{}")
        .replace(/~/g, "\\~{}");
}


router.get("/resume", (req, res) => {
    res.render("resumeForm");
});

router.post("/resume", (req, res) => {
    const userId = 10;

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
    const resumeSelectQuery = `SELECT * FROM resumes where id = ?`;
    db.query(resumeSelectQuery, [resumeId], (err, result) => {
        if (err || result.length == 0) {
            return res.send("Resume Not found!");
        }
        res.render("templates", { resumeId });
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
                                res.render("template.ejs", { data });
                            });
                        });
                    });
                });
            });
        });
    });
});


router.get("/resume/:resumeId/templates/:templateId/view", async (req, res) => {
    try {
        const { resumeId, templateId } = req.params;

        const query = (sql, params) =>
            new Promise((resolve, reject) => {
                db.query(sql, params, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

        
        const resume = await query("SELECT * FROM resumes WHERE id = ?", [resumeId]);
        if (resume.length === 0) return res.send("Resume not found!");

        const personal = await query("SELECT * FROM personal_info WHERE resume_id = ?", [resumeId]);
        const education = await query("SELECT * FROM education WHERE resume_id = ?", [resumeId]);
        const coursework = await query("SELECT * FROM coursework WHERE resume_id = ?", [resumeId]);
        const experience = await query("SELECT * FROM experience WHERE resume_id = ?", [resumeId]);
        const projects = await query("SELECT * FROM projects WHERE resume_id = ?", [resumeId]);
        const skills = await query("SELECT * FROM technical_skills WHERE resume_id = ?", [resumeId]);
        const extra = await query("SELECT * FROM extracurricular WHERE resume_id = ?", [resumeId]);

        const p = personal[0] || {};
        const s = skills[0] || {};

     
        const templatePath = path.join(__dirname, "..", "templates", `template${templateId}.tex`);
        let latex = fs.readFileSync(templatePath, "utf8");

        const safe = (v) => escapeLatex(v || "");

      
        latex = latex
            .replace(/%FULL_NAME%/g, safe(p.full_name))
            .replace(/%PHONE%/g, safe(p.phone))
            .replace(/%EMAIL%/g, safe(p.email))
            .replace(/%ADDRESS%/g, safe(p.address))
            .replace(/%LINKEDIN%/g, safe(p.linkedin))
            .replace(/%GITHUB%/g, safe(p.github));

        
        const eduBlock = education.map(e => `
\\resumeSubheading
{${safe(e.degree)}}{${safe(e.start_year)} -- ${safe(e.end_year)}}
{${safe(e.institution)}}{${safe(e.city)}, ${safe(e.state)}}
`).join("\n");

        latex = latex.replace(/%EDUCATION_BLOCK%/g, eduBlock);

   
        const courseBlock = coursework.map(c => `\\item ${safe(c.course_name)}`).join("\n");
        latex = latex.replace(/%COURSEWORK_BLOCK%/g, courseBlock);

        
        const expBlock = experience.map(ex => `
\\resumeSubheading
{${safe(ex.company_name)}}{${safe(ex.start_date)} -- ${safe(ex.end_date)}}
{${safe(ex.role_name)}}{${safe(ex.city)}, ${safe(ex.state)}}
\\resumeItem{${safe(ex.description)}}
`).join("\n");

        latex = latex.replace(/%EXPERIENCE_BLOCK%/g, expBlock);

        
        const projBlock = projects.map(pj => `
\\resumeProjectHeading
{${safe(pj.project_name)} (\\textit{${safe(pj.project_date)}})}{}
\\resumeItem{Tech: ${safe(pj.tech_stack)}}
\\resumeItem{${safe(pj.project_description)}}
`).join("\n");

        latex = latex.replace(/%PROJECTS_BLOCK%/g, projBlock);

        
        latex = latex
            .replace(/%SKILLS_LANGUAGES%/g, safe(s.languages))
            .replace(/%SKILLS_TOOLS%/g, safe(s.developer_tools))
            .replace(/%SKILLS_TECH%/g, safe(s.technologies_or_frameworks));

       
        const extraBlock = extra.map(ex => `
\\resumeSubheading
{${safe(ex.title)}}{${safe(ex.start_date)} -- ${safe(ex.end_date)}}
{${safe(ex.role)}}{}
\\resumeItem{${safe(ex.description)}}
`).join("\n");

        latex = latex.replace(/%EXTRA_BLOCK%/g, extraBlock);

        
        const outputTex = path.join(__dirname, "..", "generated", `resume_${resumeId}_template${templateId}.tex`);
        fs.writeFileSync(outputTex, latex);

        
        const outputDir = path.dirname(outputTex);

        await exec(`pdflatex -interaction=nonstopmode -output-directory "${outputDir}" "${outputTex}"`);

        
        res.render("previewTemplate", {
            pdfPath: `/generated/resume_${resumeId}_template${templateId}.pdf`,
            resumeId,
            templateId
        });

    } catch (err) {
        console.error("PDF ERROR:", err);
        res.send("Something went wrong while generating the PDF!");
    }
});



router.get("/resume/:resumeId/templates/:templateId/download", (req, res) => {
    const { resumeId, templateId } = req.params;



});


module.exports = router;
