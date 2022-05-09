const modal = document.querySelector("#form_modal");
const modalOpenerBtn = document.querySelector("#modal_opener");
const modalCloserBtn = document.querySelector("#form_closer_btn");

const signupForm = document.querySelector("#user-signup-form");

const user_id = document.querySelector("#user_id");
const first_name = document.querySelector("#first_name");
const last_name = document.querySelector("#last_name");
const zip = document.querySelector("#zip");
const personal_number = document.querySelector("#personal_number");
const mobile_number = document.querySelector("#mobile_number");
const gender = document.querySelector("#gender");
const email = document.querySelector("#email");
const status = document.querySelector("#status");

modalOpenerBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

modalCloserBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  signupForm.reset();
});

async function getUsers() {
  try {
    const response = await fetch("http://api.kesho.me/v1/user-test/index");
    const users = await response.json();

    await renderUsers(users);
  } catch (e) {
    console.log("Error - ", e);
  }
}

getUsers();

async function renderUsers(usersArray) {
  const tableBody = document.querySelector("#table_body");
  let tableBodyContent = "";
  for (let index = 0; index < usersArray.length; index++) {
    const user = usersArray[index];
    tableBodyContent =
      tableBodyContent +
      `<tr>
        <td>${user.id}</td>
        <td>${user.email}</td>
        <td>${user.first_name}</td>
        <td>${user.last_name}</td>
        <td>${user.gender}</td>
        <td>${user.mobile}</td>
        <td>${user.pn}</td>
        <td>${user.zip}</td>
        <td>${user.status}</td>
        <td>
            <button class="btn_edit" data-user-id="${user.id}">Edit</button>
            <button class="btn_delete" data-user-id="${user.id}">Delete</button>
        </td>
      <tr>
      `;
  }

  tableBody.innerHTML = tableBodyContent;
  await userActions();
}

function userActions() {
  const allDeleteBtns = document.querySelectorAll(".btn_delete");
  const allEditBtns = document.querySelectorAll(".btn_edit");

  for (let index = 0; index < allDeleteBtns.length; index++) {
    const button = allDeleteBtns[index];
    button.addEventListener("click", async (e) => {
      await deleteUser(e.target.dataset.userId);
    });
  }

  for (let index = 0; index < allEditBtns.length; index++) {
    const button = allEditBtns[index];
    button.addEventListener("click", async (e) => {
      await getUser(e.target.dataset.userId);
    });
  }
}

async function getUser(userId) {
  try {
    const response = await fetch(
      `http://api.kesho.me/v1/user-test/view?id=${userId}`
    );
    const user = await response.json();

    user_id.value = user.id;
    first_name.value = user.first_name;
    last_name.value = user.last_name;
    zip.value = user.zip;
    personal_number.value = user.pn;
    mobile_number.value = user.mobile;
    gender.value = user.gender;
    email.value = user.email;
    status.value = user.status;

    modal.classList.add("show");
  } catch (e) {
    console.log("Error - ", e);
  }
}

async function deleteUser(userId) {
  try {
    await fetch(`http://api.kesho.me/v1/user-test/delete?id=${userId}`, {
      method: "delete",
      body: {},
      headers: { "Content-Type": "application/json" },
    });
    await getUsers();
  } catch (e) {
    console.log("Error - ", e);
  }
}

async function createUser(userData) {
  try {
    const response = await fetch("http://api.kesho.me/v1/user-test/create", {
      method: "post",
      body: JSON.stringify(userData),
      headers: { "Content-Type": "application/json" },
    });
    await response.json();
    await getUsers();
  } catch (e) {
    console.log("Error - ", e);
  }
}

async function updateUser(userObject) {
  try {
    const response = await fetch(
      `http://api.kesho.me/v1/user-test/update?id=${userObject.id}`,
      {
        method: "post",
        body: JSON.stringify(userObject),
        headers: { "Content-Type": "application/json" },
      }
    );
    await response.json();
    await getUsers();
  } catch (e) {
    console.log("Error - ", e);
  }
}

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    id: user_id.value,
    first_name: first_name.value,
    last_name: last_name.value,
    zip: zip.value,
    mobile: mobile_number.value,
    pn: personal_number.value,
    gender: gender.value,
    email: email.value,
    status: status.value,
  };

  if (user_id.value === "") {
    await createUser(userData);
    modal.classList.remove("show");
    signupForm.reset();
  } else {
    await updateUser(userData);
    modal.classList.remove("show");
    signupForm.reset();
  }
});
