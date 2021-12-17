$(document).ready(() => {
  console.log("%cHello World", "color: green; font-size: 24px;");

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
  // Add todo
  function addTodo(todo, completed, priority) {
    const todo_id = generateKey(8, true,4).toLowerCase();
    const dateAdded = new Date();
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
      dateAdded,
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

  $("#add-todo").on("submit", (e) => {
    e.preventDefault();
    const todo = $("#todo-input").val().trim();
    const completed = $("#completed-checkbox").is(":checked");
    const priority = $("#priority-input").val().trim();
    addTodo(todo, completed, priority);
  });

  // Delete todo
  function deleteTodo(id, edited) {
    all__todos = all__todos.filter((todo) => todo.id !== id);
    localStorage.setItem("stored__todos", JSON.stringify(all__todos));
    if (!edited || edited == null || edited == undefined) {
      renderTodos();
    } else {
      return;
    }
  }

  // Edit todo
  function editTodo(id) {
    const toBeEdited = all__todos.find((todo) => todo.id === id);
    $("#todo-input").val(toBeEdited.todo);
    $("#priority-input").val(toBeEdited.priority);
    $("#completed-checkbox").prop("checked", toBeEdited.completed);
    deleteTodo(id, true);
  }

  $('#sort-by-priority').on('click', () => {
    renderTodos(true,false,false);
  });
  $('#sort-by-completed').on('click', () => {
    renderTodos(false,true,false);
  });
  $('#sort-by-oldest').on('click', () => {
    renderTodos(false,false,true);
  });
  $('#sort-by-latest').on('click', () => {
    renderTodos(false,false,false);
  });

  // Render todos
  function renderTodos(byPriority, byCompleted, byDate) {
    $("#todo-list").html("");
    if (all__todos.length > 0) {
      if (byPriority) {
        all__todos.sort((a, b) => a.priority - b.priority);
      } else if (byCompleted) {
        all__todos.sort((a, b) => b.completed - a.completed);
      } else if (byDate) {
        all__todos.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
      } else {
        all__todos.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      }
      all__todos.forEach((todo, index) => {
        const todo_li = document.createElement("li");
        todo_li.classList.add("todo-el");
        todo_li.innerHTML = `
                <div class="todo-el-header">
                    <h2 class="todo-el-title">
                    <span style='color:grey; font-size:small;'>#${
                      index + 1
                    }</span>
                    ${todo.todo}</h2>
                    </div>
                    <div class="todo-el-footer">
                    <span class="todo-el-priority">Priority- ${
                      todo.priority
                    } |</span>
                    <span style='color:${todo.completed ? "green" : "red"}'>${
          todo.completed ? "Completed" : "Pending"
        } </span>
                    |
                    <button class='delete-todo-btn' todo-id='${
                      todo.id
                    }' title='Delete ToDo'>Delete</button>
                    |
                    <button class='edit-todo-btn' todo-id='${
                      todo.id
                    }' title='Edit ToDo'>Edit</button>
                </div>
                <span>Last updated: ${new Date(
                  todo.dateAdded
                ).toDateString()}, at ${new Date(
          todo.dateAdded
        ).toLocaleTimeString()}</span>
                `;
        todo.completed
          ? (todo_li.style.boxShadow = "3px 3px 0px green")
          : (todo_li.style.boxShadow = "3px 3px 0px red");
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
});
