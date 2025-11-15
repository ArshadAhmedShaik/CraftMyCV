function createInput(name, value, labelText) {
    const wrapper = document.createElement("div");

    const p = document.createElement("p");
    p.innerText = `${labelText}: ${value}`;
    wrapper.appendChild(p);

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = name;
    hidden.value = value;
    wrapper.appendChild(hidden);

    return wrapper;
}

function createDeleteButton(parentDiv) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerText = "Delete";
    btn.classList.add("delete_btn");

    btn.onclick = function () {
        parentDiv.remove();
    };

    return btn;
}


function addEducation() {
    const degree = document.querySelector('input[name="degree[]"]').value;
    const institution = document.querySelector('input[name="institution[]"]').value;
    const city = document.querySelector('input[name="edu_city[]"]').value;
    const state = document.querySelector('input[name="edu_state[]"]').value;
    const start = document.querySelector('input[name="edu_start_year[]"]').value;
    const end = document.querySelector('input[name="edu_end_year[]"]').value;
    const grade = document.querySelector('input[name="grade[]"]').value;

    if (!degree || !institution || !city || !state || !start || !end || !grade) {
        alert("Fill the required fields to add!");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("added_box");

    div.appendChild(createInput("degree[]", degree, "Degree"));
    div.appendChild(createInput("institution[]", institution, "Institution"));
    div.appendChild(createInput("edu_city[]", city, "City"));
    div.appendChild(createInput("edu_state[]", state, "State"));
    div.appendChild(createInput("edu_start_year[]", start, "Start"));
    div.appendChild(createInput("edu_end_year[]", end, "End"));
    div.appendChild(createInput("grade[]", grade, "Grade"));

    div.appendChild(createDeleteButton(div)); 

    document.getElementById("added_education").appendChild(div);

    document.querySelector('input[name="degree[]"]').value = "";
    document.querySelector('input[name="institution[]"]').value = "";
    document.querySelector('input[name="edu_city[]"]').value = "";
    document.querySelector('input[name="edu_state[]"]').value = "";
    document.querySelector('input[name="edu_start_year[]"]').value = "";
    document.querySelector('input[name="edu_end_year[]"]').value = "";
    document.querySelector('input[name="grade[]"]').value = "";
}


function addCourse() {
    const course = document.querySelector('input[name="course_name[]"]').value;
    if (!course)  {
        alert("Fill the required fields to add!");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("added_box");

    div.appendChild(createInput("course_name[]", course, "Course"));
    div.appendChild(createDeleteButton(div));

    document.getElementById("added_coursework").appendChild(div);

    document.querySelector('input[name="course_name[]"]').value = "";
}



function addExperience() {
    const company = document.querySelector('input[name="company_name[]"]').value;
    const role = document.querySelector('input[name="role_name[]"]').value;
    const start = document.querySelector('input[name="exp_start_date[]"]').value;
    const end = document.querySelector('input[name="exp_end_date[]"]').value;
    const city = document.querySelector('input[name="exp_city[]"]').value;
    const state = document.querySelector('input[name="exp_state[]"]').value;
    const desc = document.querySelector('textarea[name="exp_description[]"]').value;

    if (!company || !role || !start || !end || !city || !state || !desc)  {
        alert("Fill the required fields to add!");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("added_box");

    div.appendChild(createInput("company_name[]", company, "Company"));
    div.appendChild(createInput("role_name[]", role, "Role"));
    div.appendChild(createInput("exp_start_date[]", start, "Start"));
    div.appendChild(createInput("exp_end_date[]", end, "End"));
    div.appendChild(createInput("exp_city[]", city, "City"));
    div.appendChild(createInput("exp_state[]", state, "State"));
    div.appendChild(createInput("exp_description[]", desc, "Description"));

    div.appendChild(createDeleteButton(div));

    document.getElementById("added_experience").appendChild(div);

    document.querySelector('input[name="company_name[]"]').value = "";
    document.querySelector('input[name="role_name[]"]').value = "";
    document.querySelector('input[name="exp_start_date[]"]').value = "";
    document.querySelector('input[name="exp_end_date[]"]').value = "";
    document.querySelector('input[name="exp_city[]"]').value = "";
    document.querySelector('input[name="exp_state[]"]').value = "";
    document.querySelector('textarea[name="exp_description[]"]').value = "";
}



function addProject() {
    const name = document.querySelector('input[name="project_name[]"]').value;
    const tech = document.querySelector('input[name="tech_stack[]"]').value;
    const date = document.querySelector('input[name="project_date[]"]').value;
    const desc = document.querySelector('textarea[name="project_description[]"]').value;
    const github = document.querySelector('input[name="project_github_link[]"]').value;
    const live = document.querySelector('input[name="project_live_link[]"]').value;

    if (!name || !tech || !date || !desc)  {
        alert("Fill the required fields to add!");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("added_box");

    div.appendChild(createInput("project_name[]", name, "Project"));
    div.appendChild(createInput("tech_stack[]", tech, "Tech"));
    div.appendChild(createInput("project_date[]", date, "Date"));
    div.appendChild(createInput("project_description[]", desc, "Description"));
    div.appendChild(createInput("project_github_link[]", github, "Github"));
    div.appendChild(createInput("project_live_link[]", live, "Live"));

    div.appendChild(createDeleteButton(div));

    document.getElementById("added_project").appendChild(div);

    document.querySelector('input[name="project_name[]"]').value = "";
    document.querySelector('input[name="tech_stack[]"]').value = "";
    document.querySelector('input[name="project_date[]"]').value = "";
    document.querySelector('textarea[name="project_description[]"]').value = "";
    document.querySelector('input[name = "project_github_link[]"]').value = "";
    document.querySelector('input[name = "project_live_link[]"]').value = "";

}

document.addEventListener("input", function (e) {
    if (e.target.tagName.toLowerCase() === "textarea") {
        e.target.style.height = "auto";    
        e.target.style.height = e.target.scrollHeight + "px";
    }
});

function addExtracurricular() {
    const title = document.querySelector('input[name="extra_title[]"]').value;
    const role = document.querySelector('input[name="extra_role[]"]').value;
    const start = document.querySelector('input[name="extra_start_date[]"]').value;
    const end = document.querySelector('input[name="extra_end_date[]"]').value;
    const desc = document.querySelector('textarea[name="extra_description[]"]').value;

    if (!title || !role || !start || !end || !desc)  {
        alert("Fill the required fields to add!");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("added_box");

    div.appendChild(createInput("extra_title[]", title, "Title"));
    div.appendChild(createInput("extra_role[]", role, "Role"));
    div.appendChild(createInput("extra_start_date[]", start, "Start"));
    div.appendChild(createInput("extra_end_date[]", end, "End"));
    div.appendChild(createInput("extra_description[]", desc, "Description"));

    div.appendChild(createDeleteButton(div));

    document.getElementById("added_extracurricular").appendChild(div);

    document.querySelector('input[name="extra_title[]"]').value = "";
    document.querySelector('input[name="extra_role[]"]').value = "";
    document.querySelector('input[name="extra_start_date[]"]').value = "";
    document.querySelector('input[name="extra_end_date[]"]').value = "";
    document.querySelector('textarea[name="extra_description[]"]').value = "";
}
