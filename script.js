$(document).ready(() => {
  console.log("%c-> Loading...", "color: royalblue; font-size: 14px;");
  console.log(
    "%cApp Initialized Successfully!",
    "color: limegreen; font-size: 14px;"
  );

  const allModals = document.querySelectorAll(".modal");

  // function to generate random id for todo
  function generateKey(tokenLen, hyphen, hyphenPos) {
    let string = "abcdefghijklmnopqrstuvwxyz0123456789";
    var token = [];
    if (hyphen == true) {
      for (let i = 0; i < tokenLen; i++) {
        let pos = Math.floor(Math.random() * (35 - 0 + 1) + 0);
        if (hyphenPos == undefined) hyphenPos = 1;
        if (i % hyphenPos == 0) {
          token.push("-");
        }
        token.push(string[pos]);
      }
      token.shift();
    } else if (hyphen == false) {
      for (let i = 0; i < tokenLen; i++) {
        let pos = Math.floor(Math.random() * (35 - 0 + 1) + 0);
        token.push(string[pos]);
      }
    } else {
      token = ["Incorrect", " ", "Arguments", " ", "Provided"];
    }

    token = token.join("").toUpperCase();
    return token;
  }

  let all__todos = JSON.parse(localStorage.getItem("stored__todos")) || [];
  window.onload = renderTodos();

  // add todo function
  function addTodo(todo, completed, priority) {
    const todo_id = generateKey(8, true, 4).toLowerCase();
    if (!todo || todo.length == 0) {
      alert("Please enter a todo");
      return;
    }
    if (!priority) {
      alert("Please enter a priority");
      return;
    }
    const newTodo = {
      id: todo_id,
      todo,
      completed,
      priority,
      dateAdded: new Date(),
      lastUpdated: new Date(),
    };
    if (newTodo) {
      console.log(newTodo);
      all__todos.push(newTodo);
      localStorage.setItem("stored__todos", JSON.stringify(all__todos));
      $("#todo-input").val("");
      $("#priority-input").val("");
      renderTodos();
    }
  }

  // add todo handler
  $("#add-todo").on("submit", (e) => {
    e.preventDefault();
    const todo = $("#todo-input").val().trim();
    const completed = $("#completed-checkbox").is(":checked");
    const priority = $("#priority-input").val().trim();
    addTodo(todo, completed, priority);
  });

  // delete todo function
  function deleteTodo(id) {
    all__todos = all__todos.filter((todo) => todo.id !== id);
    localStorage.setItem("stored__todos", JSON.stringify(all__todos));
    renderTodos();
  }

  // edit todo function
  function editTodo(id) {
    const toBeEdited = all__todos.find((todo) => todo.id === id);
    $("#edit-todo #edit-todo-input").val(toBeEdited.todo);
    $("#edit-todo #edit-priority-input").val(toBeEdited.priority);
    $("#edit-todo #edit-completed-checkbox").prop(
      "checked",
      toBeEdited.completed
    );
    $("#edit-todo-submit-btn").attr("data-id", id);
    $(".edit-todo-modal").addClass("active");
  }

  // edit todo submit handler
  $("#edit-todo").on("submit", (e) => {
    e.preventDefault();
    const todo = $("#edit-todo-input").val().trim();
    const completed = $("#edit-completed-checkbox").is(":checked");
    const priority = $("#edit-priority-input").val();
    const id = $("#edit-todo-submit-btn").attr("data-id");
    const toBeEdited = all__todos.find((todo) => todo.id === id);
    toBeEdited.todo = todo;
    toBeEdited.completed = completed;
    toBeEdited.priority = priority;
    localStorage.setItem("stored__todos", JSON.stringify(all__todos));
    renderTodos();
    $(".edit-todo-modal").removeClass("active");
  });

  $("#sort-by-priority").on("click", () => {
    renderTodos(true, false, false);
  });
  $("#sort-by-completed").on("click", () => {
    renderTodos(false, true, false);
  });
  $("#sort-by-oldest").on("click", () => {
    renderTodos(false, false, true);
  });
  $("#sort-by-latest").on("click", () => {
    renderTodos(false, false, false);
  });

  // format date function
  function formatDate(date) {
    if(new Date(date)){
      const preFormatted = new Date(date).toDateString().split(' ');
      preFormatted.shift();
      preFormatted[1] = preFormatted[1]+', ';
      return preFormatted.join(' ');
    } else {
      return "Some error occured while formatting the date" + date;
    }
  }

  // Render todos
  function renderTodos(byPriority, byCompleted, byDate) {
    $("#todo-list").html("");
    const totalTodos = all__todos.length;
    const completedTodos = all__todos.filter(
      (todo) => todo.completed === true
    ).length;
    const pendingTodos = all__todos.filter(
      (todo) => todo.completed === false
    ).length;
    $("#total-todos").text(totalTodos);
    $("#total-completed").text(completedTodos);
    $("#total-pending").text(pendingTodos);
    if (all__todos.length > 0) {
      if (byPriority) {
        all__todos.sort((a, b) => a.priority - b.priority);
      } else if (byCompleted) {
        all__todos.sort((a, b) => b.completed - a.completed);
      } else if (byDate) {
        all__todos.sort(
          (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
        );
      } else {
        all__todos.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
      }
      all__todos.forEach((todo, index) => {
        const todo_li = document.createElement("li");
        todo_li.classList.add("todo-el");
        todo_li.setAttribute("data-id", todo.id);
        todo_li.innerHTML = `
                <div class="todo-el-header">
                    <span class="todo-el-priority">Priority - ${todo.priority}</span>
                    <span class='todo-status' style='color:${todo.completed ? "var(--TEXT_SUCCESS)" : "var(--TEXT_DANGER)"}'>
                      ${todo.completed ? "Completed" : "Pending"} 
                    </span>
                </div>
                <hr style='width:100%;'>
                <div class="todo-el-body">
                  <span>
                    <span style='color:royalblue;'>Updated:</span> 
                    <span style='color:unset !important;'>${formatDate(todo.dateAdded)} at ${new Date(todo.dateAdded).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</span>
                  </span>
                  <h2 class="todo-el-title">
                    ${todo.todo}
                  </h2>
                </div>
                
                <div class="todo-el-footer">
                  <div class='date-time'>
                    <span>
                      <span style='color:var(--TEXT_SUCCESS);'>Added:</span> 
                      <span style='color:unset !important;'>${formatDate(todo.dateAdded)} at ${new Date(todo.dateAdded).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</span>
                    </span>
                    
                  </div>
                  <div class='cta-buttons'>
                    <button class='delete-todo-btn' todo-id='${todo.id}' title='Delete ToDo'>
                      <ion-icon name="trash-outline"></ion-icon>
                    </button>
                    <button class='edit-todo-btn' todo-id='${todo.id}' title='Edit ToDo'>
                      <ion-icon name="create-outline"></ion-icon>
                    </button>
                  </div>
                </div>
                `;
        todo.completed
          ? (todo_li.style.boxShadow = "3px 3px 0px var(--TEXT_SUCCESS)")
          : (todo_li.style.boxShadow = "3px 3px 0px var(--TEXT_DANGER)");
        $("#todo-list").append(todo_li);

        $(".delete-todo-btn").click((e) => {
          deleteTodo($(e.target).attr("todo-id"));
        });
        $(".edit-todo-btn").click((e) => {
          editTodo($(e.target).attr("todo-id"));
        });
      });
    } else {
      $("#todo-list").html(`
            <li class="todo-el">
                <span>No Todos added</span>
            </li>
        `);
    }
  }

  // close modal handler
  $(".modal-close-btn").click(() => {
    allModals.forEach((modal) => {
      modal.classList.remove("active");
    });
  });
});
